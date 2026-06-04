# Avatar 3D evolutivo — Infraestrutura (pronta para assets) · Review & Decisão

Data: 2026-06-01 · Decisão do usuário: evoluir para assets reais (modo **híbrido**), começando
pela **infraestrutura plugável** sem baixar assets. Plano: `docs/product-evolution/13-real-3d-assets-plan.md`.

## Escopo executado

- Registry dos **7 estados** (`avatar-states.ts`): config procedural (accent, secundária, anéis,
  partículas, distort, coroa) + **plug point `modelUrl` (todos `null`)**.
- `procedural-avatar.tsx`: scene-graph — núcleo procedural **ou** GLB (`<Suspense>`/`useGLTF`,
  dormente) + anéis orbitais + partículas + coroa (Boss). Modo híbrido: camadas permanecem ao redor do modelo.
- `avatar-model.tsx`: loader GLB (`useGLTF`) + `preloadAvatar` — **dormente** (só monta se `modelUrl`).
- `avatar-canvas.tsx`: `<Canvas>` único, `prefers-reduced-motion` → `frameloop="demand"`.
- `lazy-avatar.tsx` (`EvolvingAvatar`): envelope validado — `dynamic(ssr:false)` + mount-on-visible
  + `SceneErrorBoundary` → **fallback `AvatarFigure` 2D** (mesma dimensão) + `forceFallback` + LoadingDisc.
- Preview `/preview/avatar-evolution` (guardado em produção; `?fallback=1` força o 2D).
- Reaproveita `use-in-viewport.ts` + `scene-error-boundary.tsx` (DRY). **Sem dependências novas.**

## Restrições do usuário — atendidas

- **Sem dependência externa de plataforma de avatar** (RPM descontinuado em 31/01/2026 — não usado),
  sem SDK. O plug point GLB (`modelUrl`) aceita GLB próprio/licenciado, documentado.
- **Nenhum asset baixado/commitado** (0 `.glb/.gltf/.hdr/.fbx` no repo), **sem placeholder público**,
  **sem o GLB de canguru**. Todos os `modelUrl` = `null` → núcleos procedurais.
- **Evolução por camadas procedurais primeiro** (aura/anéis/partículas/cores/badges/coroa).
- **Hero da landing inalterado** (segue procedural v1). **Cockpit/perfil não tocados** (entrega via preview).
- Não toca auth/XP/`src/server/*`/review/Boss Final/banco.

## Validações automáticas

| Gate | Resultado |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ |
| `npm run test` | ✅ 25/25 |
| `npm run build` | ✅ (limpo, exit 0) |

## Bundle (medido)

- `/preview/avatar-evolution` = **114 kB First Load** — three **fora** do First Load (chunk async).
- Landing 145 kB (inalterada); **`/aluno` 155 kB SEM three** (confirmado: cockpit não importa 3D — não-vazamento); shared 103 kB; demais rotas estáveis. Sem deps novas.

## Evidências visuais

`docs/product-evolution/visual-reviews/phase-avatar-evolution-*`:
- `desktop.png` — 7 estados procedurais (cores ciano→violeta→âmbar, anéis 0→3, partículas crescentes, coroa no Boss).
- `mobile.png` — reflow em 2 colunas, sem overflow.
- `fallback-desktop.png` — `?fallback=1` → `AvatarFigure` 2D nos 7 estados, mesma dimensão.

## Pareceres

- **Visual: APROVADO COM RESSALVAS** (estéticas, não-bloqueantes): curva de anéis com platôs
  (0,1,1,2,2,3,3); Operador volta ao ciano (salto ambíguo lado a lado); célula órfã do Boss no
  mobile. A progressão lê via cor + densidade de partículas; clímax do Boss bem resolvido.
- **QA: PRONTO.** Boundaries + não-vazamento; zero asset/dep/placeholder/kanguru; `modelUrl` todos
  null; reduced-motion e não-bloqueio corretos; responsivo; fallback 2D de mesma dimensão. Sem bugs.
- **Codex: APROVADO.** Plug point **dormente** confirmado (`useGLTF` nunca executa agora); DRY;
  sem deps novas; rollback documentado. P2: `preloadAvatar` sem uso (helper futuro); escala do GLB
  no modo híbrido a validar ao plugar; caminho `<Suspense>` não exercido até asset real.

## DECISÃO FINAL: APROVADO

Infraestrutura plugável entregue e validada; produto vivo inalterado. Ressalvas estéticas do
registry ficam como **tuning** para a fase de assets (rollback-safe, em `avatar-states.ts`).

## Próximos passos (decisão/insumo do usuário)

1. Fornecer **GLBs próprios/licenciados** de uma fonte estável → preencher `modelUrl`. (RPM
   descontinuado em 31/01/2026 — não usar.)
2. Ao plugar o 1º asset: re-capturar os 3 screenshots; validar escala/origem do GLB vs. anéis;
   z-order da coroa sobre o avatar; `<Suspense>` sem CLS na célula.
3. Medir FPS em device móvel real com modelo carregado (não só procedural).
4. (Tuning opcional) suavizar a curva de anéis / reforçar glow do Operador; ancorar o Boss no mobile.
5. Integrar `EvolvingAvatar` no cockpit/perfil (swap do `AvatarFigure`) sob o protocolo.
