-- ============================================================
-- IA para Vida Real — Migration 0004: hardening de funcoes
--
-- Motivacao (Supabase database linter / advisors de seguranca):
-- 1. `review_submission` e SECURITY DEFINER e confia em `p_teacher_profile_id`.
--    Por padrao o Supabase concede EXECUTE a `anon`/`authenticated`, expondo a
--    RPC via `/rest/v1/rpc/...` e permitindo que qualquer usuario logado
--    aprove/reprove entregas e conceda XP, contornando a autorizacao do app.
--    A funcao so deve ser chamada pelo `service_role` no servidor, apos validar
--    o perfil de professor. Revogamos EXECUTE de anon/authenticated/public.
-- 2. `search_path` mutavel em funcoes: fixamos para reduzir risco de hijacking.
-- ============================================================

revoke execute on function public.review_submission(uuid, uuid, public.feedback_decision, text) from anon, authenticated, public;
revoke execute on function public.level_for_xp(integer) from anon, authenticated, public;

-- O app chama a RPC pelo service_role no servidor; garantimos o EXECUTE a ele.
grant execute on function public.review_submission(uuid, uuid, public.feedback_decision, text) to service_role;
grant execute on function public.level_for_xp(integer) to service_role;

alter function public.set_updated_at() set search_path = '';
alter function public.level_for_xp(integer) set search_path = '';
-- review_submission ja define `set search_path = public` na sua criacao.
