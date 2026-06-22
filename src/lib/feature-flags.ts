/**
 * Feature flags de runtime (server-side).
 *
 * `ENABLE_3D_AVATAR_IN_APP` controla o EvolvingAvatar 3D nas superfícies
 * VIVAS do aluno (cockpit/perfil) — mesmo padrão do `ENABLE_PREVIEW_ROUTES`
 * (docs/deploy/render.md):
 *
 * - produção: 3D só com `ENABLE_3D_AVATAR_IN_APP=1` (lançamento conservador;
 *   rollback = remover a env var no host + deploy, sem reverter código);
 * - dev/preview: 3D ligado por padrão (desligável com `=0`).
 *
 * Racional (decisão da fase 17): os GLBs base de Brasa/Verdejante/Nebulosa
 * ainda estão em otimização intermediária (~1,5-1,9 MB); o gate permite ligar
 * o 3D no produto quando decidido, e desligar sem deploy de código. Com o
 * gate desligado, o `EvolvingAvatar` recebe `forceFallback` e NEM baixa o
 * chunk three.js — o AvatarFigure 2D (mesma dimensão) permanece.
 *
 * Server-only: lê env não-NEXT_PUBLIC. Se este módulo vazar para bundle de
 * client, a env e `undefined` e o gate falha FECHADO (2D) — direção segura.
 */
export function avatar3dEnabledInApp(): boolean {
  if (process.env.NODE_ENV === "production") {
    return process.env.ENABLE_3D_AVATAR_IN_APP === "1";
  }
  return process.env.ENABLE_3D_AVATAR_IN_APP !== "0";
}
