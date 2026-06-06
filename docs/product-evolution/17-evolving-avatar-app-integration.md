# 17 - Relatório: EvolvingAvatar 3D no cockpit e perfil do aluno

Data: 2026-06-05 · Orquestração: PO → Tech Architect → UX → Integration
Reviewer → Executor → Visual Reviewer → QA → Codex → rodada de correção
(iluminação) → re-check UX.

## Recomendação final: **APROVADO COM RESSALVAS**

- Avatar Integration Reviewer: `Aprovado com ressalvas` (checklist 9/9; ressalva
  = peso dos GLBs base não-Aurora, herdada).
- UX/Visual: 1ª rodada `aprovado com ressalvas` (P1 legibilidade de identidades
  escuras no card) → correção de iluminação → re-check **`aprovado`**.
- Codex Reviewer: `aceite` (zero P0/P1; P2 opcionais documentados).
- QA: typecheck ✓ lint ✓ 38 testes ✓ build ✓ (estado final).

## Decisão técnica: 3D gateado por env var (Opção C sobre engenharia da B)

`ENABLE_3D_AVATAR_IN_APP` (novo, em `src/lib/feature-flags.ts`), mesmo padrão
do `ENABLE_PREVIEW_ROUTES` (docs/deploy/render.md):

- **Produção: 2D por padrão**; 3D só com `ENABLE_3D_AVATAR_IN_APP=1` no host.
  Rollback = remover a env var + deploy (lembrete: no Render, env var só aplica
  com deploy, não restart), **sem reverter código**.
- **Dev/preview: 3D por padrão** (desligável com `=0`).
- Gate = `forceFallback={!avatar3d}` no `EvolvingAvatar`: desligado, o
  `AvatarFigure` 2D de MESMA dimensão renderiza e o chunk three.js **nem é
  baixado** (`useInViewport({enabled:false})`).

Por que não A (3D só Aurora): quebraria a consistência de identidade entre
alunos. Por que não B pura (3D para todos sem gate): os GLBs base de
Brasa/Verdejante/Nebulosa seguem em otimização intermediária (~1,5–1,9 MB,
37k–47k tris) — publicável atrás de gate, não como default de produção mobile.

**Condição para ligar em produção**: nova passada de otimização dos 3 GLBs
base (alvo 15k–30k tris, envelope da Aurora ~752 KB) OU decisão explícita de
aceitar o peso em produção desktop.

## Arquivos alterados

- `src/lib/feature-flags.ts` (novo) — `avatar3dEnabledInApp()`; server-only,
  falha fechada (2D) se vazar para client.
- `src/components/game/student-cockpit.tsx` — painel "Seu agente" usa
  `EvolvingAvatar` (md, 150 px) com `forceFallback={!vm.avatar3d}`; campo
  opcional `avatar3d?: boolean` no `CockpitViewModel`; `AvatarTrophyTag`
  mantido.
- `src/components/game/profile-view.tsx` — hero de identidade usa
  `EvolvingAvatar` (lg, 184 px), mesmo gate; campo no `ProfileViewModel`.
- `src/app/aluno/page.tsx`, `src/app/aluno/perfil/page.tsx` — única mudança:
  `avatar3d: avatar3dEnabledInApp()` no vm.
- `src/app/preview/cockpit/page.tsx`, `src/app/preview/perfil/page.tsx` —
  fixtures (sem auth/banco) ganham `?variant=`, `?phase=` (cockpit) e
  `?fallback=1` para evidência visual; continuam `notFound()` em produção.
- `src/app/preview/levelup/page.tsx` — fixture passa `avatar3d: true` (P2 do
  Codex; consistência em dev).
- `src/components/three/avatar/avatar-canvas.tsx` — correção da revisão UX:
  key light 2.4→3.2 + fill frontal-baixa 1.2 (só com GLB) para identidades
  escuras (Aurora/Nebulosa) lerem sobre cards escuros, sem estourar
  Brasa/Verdejante (validado em re-check).
- `scripts/shoot-avatar-app.mjs` (novo) — evidências da fase.
- `AvatarFigure` NÃO foi removido: segue como fallback do `EvolvingAvatar` e
  em todos os caminhos 2D.

## Como funciona o fallback (4 camadas)

1. **Gate desligado / `forceFallback`** → `AvatarFigure` 2D direto, sem chunk.
2. **Carregando** (chunk three.js baixando) → `LoadingDisc` (skeleton de mesma
   área; nunca espaço vazio); antes de visível → 2D.
3. **Sem WebGL / erro de cena / GLB base falhou** → `SceneErrorBoundary` →
   `AvatarFigure` 2D de mesma dimensão (validado bloqueando
   `avatar-aurora.glb`: card 2D, página viva).
4. **Kit da fase falhou** → boundary aninhado: só o kit some, avatar continua
   3D (base + camadas).

Reduced motion: 3D estático (`frameloop="demand"`, rotação/flutuação/partículas
congeladas).

## Impacto de performance

| Rota | First Load antes | depois |
|---|---|---|
| `/aluno` | 155 kB | **158 kB** (+3 kB de glue do dynamic import) |
| `/aluno/perfil` | 119 kB | **123 kB** |

three.js (~182 kB gzip) permanece em chunk async, baixado só com gate ligado +
card visível. GLBs servidos de `public/` sob demanda (aurora ~752 KB; demais
1,5–1,9 MB — ver ressalva). Kits: 8–71 KB por fase. Com gate desligado
(produção default), custo adicional ≈ zero.

## Evidências (docs/product-evolution/visual-reviews/)

`phase-app-avatar-cockpit-{desktop,mobile,ember-desktop,verdant-desktop,nebula-desktop,boss-desktop,fallback-desktop,asset-error-desktop,reduced-motion-desktop}.png`,
`phase-app-avatar-perfil-{desktop,mobile,nebula-desktop}.png`,
`phase-app-avatar-evolution-sanity-desktop.png` (preview de evolução intacto).

Capturadas via fixtures `/preview/cockpit` e `/preview/perfil` — mesmos
componentes das rotas vivas, sem tocar banco/auth. Cenários: 4 variantes,
fase Boss Final (kit boss + coroa), fallback forçado, erro de GLB base,
reduced motion, desktop + mobile.

## Testes executados

`npm run typecheck` ✓ · `npm run lint` ✓ · `npm run test` (38/38, inclui
`tests/avatar-states.test.ts`) ✓ · `npm run build` ✓ — re-executados após a
correção de iluminação.

## Riscos e ressalvas

1. **(Principal) GLBs base não-Aurora intermediários** — manter o gate
   DESLIGADO em produção até a passada de otimização; ligar primeiro em
   desktop/validação com `ENABLE_3D_AVATAR_IN_APP=1`.
2. `preview/levelup` exercita o 3D só em dev (fixture); rota guardada.
3. Melhorias futuras sugeridas pelo UX (não bloqueantes): micro-pose por fase;
   rim light padronizado; interação de hover no perfil; captura do estado
   LoadingDisc.
4. Dev-only: HMR do Next pode quebrar (`a[d] is not a function`) após editar
   componentes 3D com o server quente — reiniciar o dev server; produção não
   afetada.

## Próximos passos

1. Otimizar GLBs base de Brasa/Verdejante/Nebulosa (pendência herdada — agora
   é O bloqueio para ligar o 3D em produção).
2. Ligar `ENABLE_3D_AVATAR_IN_APP=1` no Render (com deploy) após a otimização
   e validar `/aluno` online.
3. Medir FPS em device móvel real com gate ligado.
