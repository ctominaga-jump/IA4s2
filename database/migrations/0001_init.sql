-- ============================================================
-- IA para Vida Real — Migration 0001: schema inicial
-- Fonte: database/data-model.md e product/mvp-scope.md
-- ============================================================

create extension if not exists "pgcrypto";

-- ------------------------------------------------------------
-- Enums (valores controlados)
-- ------------------------------------------------------------
create type user_role as enum ('student', 'teacher');
create type user_status as enum ('active', 'inactive');
create type declared_level as enum ('beginner', 'basic', 'intermediate');
create type goal_category as enum (
  'study', 'career', 'business', 'creation', 'productivity', 'personal', 'other'
);
create type goal_status as enum ('active', 'paused', 'completed', 'archived');
create type content_status as enum ('draft', 'published', 'archived');
create type submission_status as enum ('pending', 'approved', 'rejected');
create type feedback_decision as enum ('approved', 'rejected');
create type xp_reason as enum ('mission_approved', 'manual_adjustment');
create type badge_trigger as enum ('course_completed', 'mission_count', 'manual');

-- ------------------------------------------------------------
-- Trigger utilitario: updated_at
-- ------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ------------------------------------------------------------
-- Level
-- ------------------------------------------------------------
create table public.levels (
  id uuid primary key default gen_random_uuid(),
  number integer not null unique,
  title text not null,
  min_xp integer not null,
  max_xp integer,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint levels_min_xp_nonneg check (min_xp >= 0),
  constraint levels_range_valid check (max_xp is null or max_xp >= min_xp)
);
create unique index levels_min_xp_key on public.levels (min_xp);
create trigger trg_levels_updated_at
  before update on public.levels
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- User (perfil de aplicacao ligado ao Supabase Auth)
-- ------------------------------------------------------------
create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique,
  name text not null,
  email text not null unique,
  role user_role not null,
  status user_status not null default 'active',
  last_login_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index users_role_idx on public.users (role);
create index users_status_idx on public.users (status);
create trigger trg_users_updated_at
  before update on public.users
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- StudentProfile
-- ------------------------------------------------------------
create table public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  declared_level declared_level,
  total_xp integer not null default 0,
  current_level_id uuid references public.levels (id),
  active_learning_goal_id uuid,
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint student_total_xp_nonneg check (total_xp >= 0)
);
create index student_profiles_level_idx on public.student_profiles (current_level_id);
create trigger trg_student_profiles_updated_at
  before update on public.student_profiles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- TeacherProfile
-- ------------------------------------------------------------
create table public.teacher_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users (id) on delete cascade,
  bio text,
  area text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_teacher_profiles_updated_at
  before update on public.teacher_profiles
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- LearningGoal (objetivo real do aluno)
-- ------------------------------------------------------------
create table public.learning_goals (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles (id) on delete cascade,
  title text not null,
  description text,
  category goal_category,
  status goal_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint learning_goals_title_not_blank check (length(btrim(title)) > 0)
);
create index learning_goals_student_idx on public.learning_goals (student_profile_id);
create index learning_goals_status_idx on public.learning_goals (status);
create trigger trg_learning_goals_updated_at
  before update on public.learning_goals
  for each row execute function public.set_updated_at();

-- FK do objetivo ativo (apos criar learning_goals)
alter table public.student_profiles
  add constraint student_profiles_active_goal_fk
  foreign key (active_learning_goal_id)
  references public.learning_goals (id) on delete set null;

-- ------------------------------------------------------------
-- Course
-- ------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null,
  status content_status not null default 'draft',
  teacher_profile_id uuid references public.teacher_profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index courses_status_idx on public.courses (status);
create trigger trg_courses_updated_at
  before update on public.courses
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Module
-- ------------------------------------------------------------
create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  description text,
  position integer not null default 1,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index modules_course_idx on public.modules (course_id);
create index modules_status_idx on public.modules (status);
create trigger trg_modules_updated_at
  before update on public.modules
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Mission
-- ------------------------------------------------------------
create table public.missions (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  title text not null,
  description text not null,
  learning_objective text not null,
  instructions text not null,
  expected_submission text not null,
  xp_reward integer not null,
  position integer not null default 1,
  status content_status not null default 'draft',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint missions_xp_positive check (xp_reward > 0)
);
create index missions_module_idx on public.missions (module_id);
create index missions_status_idx on public.missions (status);
create trigger trg_missions_updated_at
  before update on public.missions
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Submission (entrega textual)
-- ------------------------------------------------------------
create table public.submissions (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles (id) on delete cascade,
  mission_id uuid not null references public.missions (id) on delete cascade,
  content text not null,
  status submission_status not null default 'pending',
  attempt_number integer not null default 1,
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint submissions_content_not_blank check (length(btrim(content)) > 0),
  constraint submissions_attempt_positive check (attempt_number > 0)
);
create index submissions_student_idx on public.submissions (student_profile_id);
create index submissions_mission_idx on public.submissions (mission_id);
create index submissions_status_idx on public.submissions (status);
create index submissions_submitted_at_idx on public.submissions (submitted_at desc);

-- No maximo uma entrega pendente por aluno/missao.
create unique index submissions_one_pending_per_mission
  on public.submissions (student_profile_id, mission_id)
  where status = 'pending';

-- No maximo uma entrega aprovada por aluno/missao (missao aprovada nao reenvia).
create unique index submissions_one_approved_per_mission
  on public.submissions (student_profile_id, mission_id)
  where status = 'approved';

create trigger trg_submissions_updated_at
  before update on public.submissions
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- Feedback (avaliacao do professor)
-- ------------------------------------------------------------
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions (id) on delete cascade,
  teacher_profile_id uuid not null references public.teacher_profiles (id) on delete restrict,
  decision feedback_decision not null,
  comment text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint feedback_comment_not_blank check (length(btrim(comment)) > 0)
);
create index feedback_teacher_idx on public.feedback (teacher_profile_id);
create trigger trg_feedback_updated_at
  before update on public.feedback
  for each row execute function public.set_updated_at();

-- ------------------------------------------------------------
-- XPTransaction
-- ------------------------------------------------------------
create table public.xp_transactions (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles (id) on delete cascade,
  mission_id uuid references public.missions (id) on delete set null,
  submission_id uuid references public.submissions (id) on delete set null,
  amount integer not null,
  reason xp_reason not null,
  created_at timestamptz not null default now(),
  constraint xp_amount_positive check (amount > 0)
);
create index xp_transactions_student_idx on public.xp_transactions (student_profile_id);

-- XP de mission_approved e concedido no maximo uma vez por aluno/missao.
create unique index xp_one_mission_approved_per_student
  on public.xp_transactions (student_profile_id, mission_id)
  where reason = 'mission_approved';

-- ------------------------------------------------------------
-- Badge (estrutura futura — sem uso operacional no MVP)
-- ------------------------------------------------------------
create table public.badges (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  title text not null,
  description text not null,
  icon text,
  trigger_type badge_trigger not null,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger trg_badges_updated_at
  before update on public.badges
  for each row execute function public.set_updated_at();
