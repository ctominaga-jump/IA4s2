-- ============================================================
-- IA para Vida Real — Migration 0007: Boss Final / Projeto Final
--
-- Fase 6 do roadmap. Cria o projeto final (capstone) do aluno: um
-- produto com IA descrito em 5 etapas (problema, solucao, arquitetura,
-- prototipo, validacao), com ciclo de submissao e avaliacao do professor.
--
-- Decisoes de design:
--   - 1 projeto por aluno (student_profile_id unico).
--   - Ciclo: draft -> submitted -> approved | rejected. Reprovado volta a
--     edicao e pode ser reenviado (espelha o reenvio das submissoes).
--   - NAO concede XP nem mexe em niveis: o Boss Final e o clima da jornada
--     e a recompensa e a aprovacao (diploma). O sistema de XP/review de
--     missoes (review_submission/level_for_xp) NAO e tocado.
--   - review_boss_project: SECURITY DEFINER, transacional, revogada de
--     anon/authenticated — mesma postura de seguranca de review_submission.
--   - RLS habilitada sem policies publicas (lockdown); acesso so via service
--     role na camada de servidor, apos validacao de perfil.
-- ============================================================

create type boss_project_status as enum ('draft', 'submitted', 'approved', 'rejected');

-- ------------------------------------------------------------
-- BossProject (projeto final do aluno)
-- ------------------------------------------------------------
create table public.boss_projects (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null unique
    references public.student_profiles (id) on delete cascade,
  title text,
  -- Etapas do produto final (preenchidas incrementalmente).
  problem text,
  solution text,
  architecture text,
  prototype text,
  validation text,
  status boss_project_status not null default 'draft',
  -- Avaliacao do professor.
  reviewer_teacher_profile_id uuid
    references public.teacher_profiles (id) on delete set null,
  feedback text,
  submitted_at timestamptz,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index boss_projects_status_idx on public.boss_projects (status);
create index boss_projects_submitted_at_idx
  on public.boss_projects (submitted_at desc);
create trigger trg_boss_projects_updated_at
  before update on public.boss_projects
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- submit_boss_project: transiciona o projeto para 'submitted'.
-- Exige que as 5 etapas e o titulo estejam preenchidos. So a partir de
-- draft ou rejected (reenvio). SECURITY DEFINER para consistencia; a
-- autorizacao (dono do projeto) e validada na camada de servidor.
-- ------------------------------------------------------------
create or replace function public.submit_boss_project(
  p_project_id uuid,
  p_student_profile_id uuid
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_project public.boss_projects%rowtype;
begin
  select * into v_project
  from public.boss_projects
  where id = p_project_id
  for update;

  if not found then
    raise exception 'boss_project_not_found' using errcode = 'P0002';
  end if;

  if v_project.student_profile_id <> p_student_profile_id then
    raise exception 'boss_project_forbidden' using errcode = 'P0004';
  end if;

  if v_project.status = 'submitted' then
    raise exception 'boss_project_already_submitted' using errcode = 'P0003';
  end if;

  if v_project.status = 'approved' then
    raise exception 'boss_project_already_approved' using errcode = 'P0003';
  end if;

  if length(btrim(coalesce(v_project.title, ''))) = 0
     or length(btrim(coalesce(v_project.problem, ''))) = 0
     or length(btrim(coalesce(v_project.solution, ''))) = 0
     or length(btrim(coalesce(v_project.architecture, ''))) = 0
     or length(btrim(coalesce(v_project.prototype, ''))) = 0
     or length(btrim(coalesce(v_project.validation, ''))) = 0 then
    raise exception 'boss_project_incomplete' using errcode = 'P0001';
  end if;

  update public.boss_projects
  set status = 'submitted',
      submitted_at = now(),
      -- Limpa avaliacao anterior em caso de reenvio.
      feedback = null,
      reviewed_at = null,
      reviewer_teacher_profile_id = null
  where id = p_project_id;

  return jsonb_build_object('project_id', p_project_id, 'status', 'submitted');
end;
$$;

-- ------------------------------------------------------------
-- review_boss_project: avaliacao do professor (aprovar/reprovar) com
-- feedback obrigatorio. So avalia projetos 'submitted'. Espelha a postura
-- de review_submission, mas SEM XP/nivel. SECURITY DEFINER.
-- ------------------------------------------------------------
create or replace function public.review_boss_project(
  p_project_id uuid,
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
  v_project public.boss_projects%rowtype;
begin
  if p_comment is null or length(btrim(p_comment)) = 0 then
    raise exception 'feedback_required' using errcode = 'P0001';
  end if;

  select * into v_project
  from public.boss_projects
  where id = p_project_id
  for update;

  if not found then
    raise exception 'boss_project_not_found' using errcode = 'P0002';
  end if;

  if v_project.status <> 'submitted' then
    raise exception 'boss_project_not_submitted' using errcode = 'P0003';
  end if;

  update public.boss_projects
  set status = p_decision::text::boss_project_status,
      feedback = btrim(p_comment),
      reviewer_teacher_profile_id = p_teacher_profile_id,
      reviewed_at = now()
  where id = p_project_id;

  return jsonb_build_object(
    'project_id', p_project_id,
    'decision', p_decision
  );
end;
$$;

-- ------------------------------------------------------------
-- Row Level Security + revoke (defesa em profundidade)
-- ------------------------------------------------------------
alter table public.boss_projects enable row level security;

revoke all on function public.submit_boss_project(uuid, uuid) from public;
revoke all on function public.review_boss_project(uuid, uuid, feedback_decision, text) from public;
