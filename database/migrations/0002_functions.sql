-- ============================================================
-- IA para Vida Real — Migration 0002: funcoes de dominio
-- - level_for_xp: resolve o nivel a partir do XP total
-- - review_submission: avaliacao atomica (feedback + status + XP + nivel)
-- ============================================================

-- ------------------------------------------------------------
-- level_for_xp(xp): retorna o id do nivel correspondente ao XP.
-- ------------------------------------------------------------
create or replace function public.level_for_xp(p_xp integer)
returns uuid
language sql
stable
as $$
  select id
  from public.levels
  where p_xp >= min_xp
    and (max_xp is null or p_xp <= max_xp)
  order by number desc
  limit 1;
$$;

-- ------------------------------------------------------------
-- review_submission: aplica a avaliacao do professor em uma unica
-- transacao. Garante:
--   - feedback obrigatorio (comentario nao vazio);
--   - so avalia entregas pendentes;
--   - cria Feedback e atualiza status/reviewed_at da Submission;
--   - na aprovacao, concede XP uma unica vez por aluno/missao,
--     atualiza total_xp e recalcula o nivel atual.
--
-- SECURITY DEFINER: roda com privilegios do owner para que a logica
-- transacional seja consistente independentemente da role chamadora.
-- A AUTORIZACAO (perfil professor) e validada na camada de servidor
-- ANTES de chamar esta funcao.
-- ------------------------------------------------------------
create or replace function public.review_submission(
  p_submission_id uuid,
  p_teacher_profile_id uuid,
  p_decision feedback_decision,
  p_comment text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_submission public.submissions%rowtype;
  v_mission public.missions%rowtype;
  v_xp_awarded integer := 0;
  v_total_xp integer;
  v_level_id uuid;
  v_level_number integer;
  v_level_title text;
  v_row_count integer := 0;
begin
  if p_comment is null or length(btrim(p_comment)) = 0 then
    raise exception 'feedback_required' using errcode = 'P0001';
  end if;

  -- Bloqueia a linha da entrega para evitar avaliacao concorrente.
  select * into v_submission
  from public.submissions
  where id = p_submission_id
  for update;

  if not found then
    raise exception 'submission_not_found' using errcode = 'P0002';
  end if;

  if v_submission.status <> 'pending' then
    raise exception 'submission_not_pending' using errcode = 'P0003';
  end if;

  select * into v_mission
  from public.missions
  where id = v_submission.mission_id;

  -- Registra o feedback (uma unica avaliacao final por entrega).
  insert into public.feedback (submission_id, teacher_profile_id, decision, comment)
  values (p_submission_id, p_teacher_profile_id, p_decision, btrim(p_comment));

  -- Atualiza a entrega.
  update public.submissions
  set status = p_decision::text::submission_status,
      reviewed_at = now()
  where id = p_submission_id;

  -- Aprovacao concede XP (idempotente por aluno/missao).
  if p_decision = 'approved' then
    insert into public.xp_transactions
      (student_profile_id, mission_id, submission_id, amount, reason)
    values
      (v_submission.student_profile_id, v_submission.mission_id,
       p_submission_id, v_mission.xp_reward, 'mission_approved')
    on conflict (student_profile_id, mission_id)
      where reason = 'mission_approved'
      do nothing;

    get diagnostics v_row_count = row_count;

    if v_row_count > 0 then
      v_xp_awarded := v_mission.xp_reward;

      update public.student_profiles
      set total_xp = total_xp + v_mission.xp_reward
      where id = v_submission.student_profile_id
      returning total_xp into v_total_xp;

      v_level_id := public.level_for_xp(v_total_xp);

      update public.student_profiles
      set current_level_id = v_level_id
      where id = v_submission.student_profile_id;
    else
      select total_xp into v_total_xp
      from public.student_profiles
      where id = v_submission.student_profile_id;
    end if;
  else
    select total_xp into v_total_xp
    from public.student_profiles
    where id = v_submission.student_profile_id;
  end if;

  select number, title into v_level_number, v_level_title
  from public.levels
  where id = public.level_for_xp(coalesce(v_total_xp, 0));

  return jsonb_build_object(
    'submission_id', p_submission_id,
    'decision', p_decision,
    'xp_awarded', v_xp_awarded,
    'total_xp', coalesce(v_total_xp, 0),
    'level_number', v_level_number,
    'level_title', v_level_title
  );
end;
$$;
