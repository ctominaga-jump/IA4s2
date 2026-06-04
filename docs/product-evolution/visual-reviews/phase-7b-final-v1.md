# Phase 7B-final v1 — Núcleo 3D branded no hero · Review & Decisão

Data: 2026-06-01 · Opção 2 (núcleo 3D dentro do card do cockpit), escolhida pelo usuário.

## Escopo executado

Integração **controlada** de uma cena procedural branded **apenas** no disco do avatar do
card "Cockpit do aluno" no hero da landing (`src/app/page.tsx`). Copy, CTAs, layout, hierarquia
e o restante do card (XP 72%, próxima missão, 18/27, badges, Rota Boss) — **preservados da 7A**.

- Cena branded (`src/components/three/hero-core-scene.tsx`): núcleo low-poly distorcido +
  casca wireframe + anel orbital com nós (skills/missões). Paleta dual ciano+violeta.
  100% procedural (sem GLB/HDR/textura/Ready Player Me).
- Slot (`src/components/three/hero-core.tsx`): `dynamic(ssr:false)` + mount-on-visible +
  `SceneErrorBoundary` + `forceFallback`. Disco com dimensão fixa (`aspect-square max-w-[180px]`).
- Fallback estático = ícone **Bot** centralizado no disco (mesma dimensão) — usado em SSR,
  loading do chunk, sem WebGL e sem JS. Resultado: sem WebGL/JS, o card volta a ser o da 7A.
- `prefers-reduced-motion`: cena sem animação contínua (`frameloop="demand"`).
- Envelope reutilizável extraído e compartilhado: `use-in-viewport.ts` (hook) +
  `scene-error-boundary.tsx`. `lazy-scene.tsx` (spike) refatorado para consumi-los — comportamento idêntico.

## Não tocado

auth, XP (`progression.ts`), `src/server/*`, review (`reviews.ts`), Boss Final, banco. Nenhuma
regra de negócio. A única mudança em `page.tsx` foi trocar o nó visual do disco do avatar.

## Validações automáticas

| Gate | Resultado |
|---|---|
| `npm run typecheck` | ✅ |
| `npm run lint` | ✅ |
| `npm run test` | ✅ 25/25 |
| `npm run build` | ✅ (limpo, exit 0) |

## Orçamento de bundle (medido)

- **Landing First Load JS: 143 → 145 kB (+2 kB).** O three.js **não** entra no First Load.
- Payload three permanece em **chunk async ~182 kB gzip**, baixado sob demanda quando o hero
  fica visível (topo da página → logo após o paint), **não-bloqueante**, com Bot estático enquanto isso.
- Demais rotas inalteradas; shared 103 kB.

## Evidências visuais

`docs/product-evolution/visual-reviews/phase-7b-final-landing-*`:
- `desktop.png` / `mobile.png` — hero com núcleo 3D (WebGL).
- `fallback-desktop.png` — **JS desligado**: Bot estático no disco + landing completa renderizada
  (prova do fallback e do SSR). Footprint idêntico ao 3D (sem CLS).

## Pareceres

- **Visual Reviewer: APROVADO** (cheio). Sem perda de legibilidade; 3D on-brand e contido;
  fallback de dimensão idêntica (transição imperceptível); mobile sem overflow. Veredito da regra
  do usuário: **não** houve perda de legibilidade nem peso excessivo. v2 (opcional): reforçar o violeta.
- **QA: PRONTO para deploy.** Boundaries OK; **100% procedural** confirmado por grep (sem
  GLB/HDR/textura/RPM); reduced-motion e não-bloqueio implementados; sem CLS; +2 kB aceitável;
  fallback no-JS íntegro; sem regressão.
- **Codex: APROVADO.** Fronteira server/client correta; isolamento de bundle confirmado; envelope
  DRY (hook + EB compartilhados); refator do spike equivalente. P2 cosméticos: `rootMargin`
  redundante, `componentDidCatch` vazio (telemetria adiada), dois fallbacks por design.

## DECISÃO FINAL: APROVADO

7B-final v1 entregue: 3D procedural branded integrado de forma controlada, com fallback de mesma
dimensão, dynamic ssr:false + mount-on-visible, reduced-motion, sem assets reais. Orçamento de
bundle respeitado (+2 kB no First Load; three async). A regra "se perda de legibilidade ou peso
excessivo, manter fallback" **não foi acionada** — 3D permanece como padrão.

## Próxima decisão (do usuário)

Avaliar se vale evoluir para **assets reais** (GLB/HDR próprio/licenciado; sem Ready Player Me — descontinuado 31/01/2026). Trade-off: maior
fidelidade de marca vs. payload async crescente (hoje ~182 kB) + necessidade de `<Suspense>`/preload
e medição de FPS em device móvel real. O envelope atual já é o baseline para essa evolução.
