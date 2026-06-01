-- ============================================================
-- IA para Vida Real — Migration 0003: Row Level Security
--
-- Estrategia de seguranca do MVP (ver docs/tech-stack.md):
-- A aplicacao renderiza tudo no servidor. Toda leitura/escrita de dados
-- de dominio passa pela camada de servidor, que (1) valida o perfil do
-- usuario e (2) usa a chave de service role. O service role IGNORA RLS.
--
-- Habilitamos RLS em todas as tabelas SEM policies para as roles anon e
-- authenticated. Isso bloqueia por padrao qualquer acesso direto via chave
-- publica (defesa em profundidade), mesmo que uma chave anon vaze. A
-- evolucao para policies granulares por aluno/professor esta prevista no
-- roadmap, sem alterar o modelo.
-- ============================================================

alter table public.levels enable row level security;
alter table public.users enable row level security;
alter table public.student_profiles enable row level security;
alter table public.teacher_profiles enable row level security;
alter table public.learning_goals enable row level security;
alter table public.courses enable row level security;
alter table public.modules enable row level security;
alter table public.missions enable row level security;
alter table public.submissions enable row level security;
alter table public.feedback enable row level security;
alter table public.xp_transactions enable row level security;
alter table public.badges enable row level security;

-- Garante que nenhuma role publica (anon/authenticated) chame a RPC de
-- avaliacao diretamente. Ela so deve ser invocada pelo service role no
-- servidor, apos a validacao de perfil.
revoke all on function public.review_submission(uuid, uuid, feedback_decision, text) from public;
revoke all on function public.level_for_xp(integer) from public;
