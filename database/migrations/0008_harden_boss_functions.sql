-- ============================================================
-- IA para Vida Real — Migration 0008: hardening das funcoes do Boss Final
--
-- Mesma motivacao da 0004: por padrao o Supabase concede EXECUTE a
-- `anon`/`authenticated`, expondo as RPCs SECURITY DEFINER via
-- `/rest/v1/rpc/...`. `revoke ... from public` (feito na 0007) NAO cobre
-- esses roles. Revogamos EXECUTE de anon/authenticated/public e garantimos
-- ao `service_role`, que e quem chama no servidor apos validar o perfil.
-- ============================================================

revoke execute on function public.submit_boss_project(uuid, uuid) from anon, authenticated, public;
revoke execute on function public.review_boss_project(uuid, uuid, public.feedback_decision, text) from anon, authenticated, public;

grant execute on function public.submit_boss_project(uuid, uuid) to service_role;
grant execute on function public.review_boss_project(uuid, uuid, public.feedback_decision, text) to service_role;
