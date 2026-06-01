-- ============================================================
-- IA para Vida Real — Migration 0006: identidade visual do avatar
--
-- Evolucao ADITIVA e idempotente (Fase 4). NAO altera XP, review,
-- submissoes nem auth. Adiciona apenas a variante cosmetica do avatar
-- escolhida pelo aluno (a evolucao do avatar por nivel/fase e derivada
-- em tempo de render, sem persistencia).
-- ============================================================

do $$
begin
  if not exists (select 1 from pg_type where typname = 'avatar_variant') then
    create type avatar_variant as enum ('aurora', 'ember', 'verdant', 'nebula');
  end if;
end
$$;

alter table public.student_profiles
  add column if not exists avatar_variant avatar_variant not null default 'aurora';
