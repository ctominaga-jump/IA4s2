-- ============================================================
-- IA para Vida Real — Migration 0005: fases da jornada + quests
--
-- Evolucao ADITIVA e idempotente (Fase 3). NAO altera XP, review,
-- submissoes nem auth. Apenas:
--   - cria a entidade narrativa `journey_phases` (Despertar -> Boss Final);
--   - enriquece `missions` com fase, dificuldade, tempo estimado e
--     criterio de aceite (campos opcionais/com default, sem quebrar dados
--     existentes nem a RPC review_submission).
--
-- Re-executavel: guards com IF NOT EXISTS / DO blocks.
-- ============================================================

-- ------------------------------------------------------------
-- Enum de dificuldade da missao
-- ------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'mission_difficulty') then
    create type mission_difficulty as enum ('easy', 'medium', 'hard');
  end if;
end
$$;

-- ------------------------------------------------------------
-- Fases narrativas da jornada
-- ------------------------------------------------------------
create table if not exists public.journey_phases (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  slug text not null unique,
  name text not null,
  tagline text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint journey_phases_number_positive check (number > 0)
);

drop trigger if exists trg_journey_phases_updated_at on public.journey_phases;
create trigger trg_journey_phases_updated_at
  before update on public.journey_phases
  for each row execute function public.set_updated_at();

-- RLS: mesma estrategia das demais tabelas de conteudo (sem policies;
-- acesso de dominio passa pelo service role no servidor).
alter table public.journey_phases enable row level security;

-- ------------------------------------------------------------
-- Campos de quest em missions (aditivos)
-- ------------------------------------------------------------
alter table public.missions
  add column if not exists phase_id uuid references public.journey_phases (id) on delete set null;

alter table public.missions
  add column if not exists difficulty mission_difficulty not null default 'easy';

alter table public.missions
  add column if not exists estimated_minutes integer not null default 15;

alter table public.missions
  add column if not exists acceptance_criteria text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'missions_estimated_minutes_positive'
  ) then
    alter table public.missions
      add constraint missions_estimated_minutes_positive check (estimated_minutes > 0);
  end if;
end
$$;

create index if not exists missions_phase_idx on public.missions (phase_id);
