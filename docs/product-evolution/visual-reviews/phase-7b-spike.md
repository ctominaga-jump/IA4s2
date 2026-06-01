# Phase 7B-spike — Pipeline 3D · Review & Decisão

Data: 2026-06-01 · Spike técnico (NÃO é o 3D definitivo).

## Objetivo

Provar o pipeline 3D de ponta a ponta, isolado, antes de decidir assets de marca/avatar.
Sem 3D definitivo nesta fase.

## Escopo executado

- Instalado: `three` 0.184.0, `@react-three/fiber` 9.6.1, `@react-three/drei` 10.7.7,
  `@types/three` 0.184.1 (devDep, pin).
- **Uma** cena procedural leve (`src/components/three/procedural-scene.tsx`): núcleo low-poly
  com `MeshDistortMaterial`, casca wireframe e `Sparkles`. 100% código, sem assets externos.
- Carregamento sob demanda (`src/components/three/lazy-scene.tsx`): `dynamic(ssr:false)` +
  mount-on-visible (`IntersectionObserver`, rootMargin 200px) + `ErrorBoundary` → fallback.
- **Fallback estático obrigatório** (`src/components/three/scene-fallback.tsx`): puro, sem
  three, mesma altura da cena (sem CLS). Usado em loading, erro de WebGL e `?fallback=1`.
- Rota isolada de preview `/preview/scene-3d` (guardada por `NODE_ENV==="production" → notFound`).
- `prefers-reduced-motion`: cena para toda animação e usa `frameloop="demand"` (1 frame, ocioso).

## Não tocado

auth, XP (`progression.ts`), `src/server/*`, review (`reviews.ts`), Boss Final, banco, landing,
cockpit, telas de aluno/professor. Spike puramente aditivo (verificado por grep pelos revisores).

## Validações automáticas

| Gate | Resultado |
|---|---|
| `npm run typecheck` | ✅ sem erros (com `@types/three` explícito) |
| `npm run lint` | ✅ sem warnings/erros |
| `npm run test` | ✅ 25/25 |
| `npm run build` | ✅ compila |

## Impacto de bundle (medido)

- `/preview/scene-3d` = **105 kB First Load JS** — equivalente a uma rota vazia.
- Shared First Load JS: 102 → **103 kB** (+1 kB; libs 3D NÃO entram no shared).
- Payload three.js: **2 chunks assíncronos, ~182 kB gzip combinado (~722 kB bruto)**, baixados
  **somente sob demanda** quando a cena entra na viewport. Fora do First Load JS de qualquer rota.
- **Todas as outras rotas inalteradas** (landing 143 kB, cockpit 154 kB, professor 106 kB).

## Evidências visuais

`docs/product-evolution/visual-reviews/phase-7b-spike-*` (desktop 1440×900 + mobile 390×844):
- `scene-{desktop,mobile}` — cena WebGL renderizada (SwiftShader no headless).
- `fallback-{desktop,mobile}` — fallback estático forçado via `?fallback=1`.
Conteúdo da página renderiza acima e abaixo da cena (prova de não-bloqueio). Sem CLS entre
cena e fallback (mesma altura). Sem overflow/clipping no mobile.

## Pareceres

- **Visual Reviewer:** aprovado com ressalvas (estéticas, p/ 7B final): violeta sub-representado
  na cena; alinhar "temperatura" de paleta cena↔fallback; reforçar contraste do wireframe.
- **QA:** PRONTO. Isolamento total; todas as garantias de não-bloqueio confirmadas no código e
  no SSR; reduced-motion coberto; rota guardada em produção; sem regressão.
- **Codex:** aprovado. P2: (1) `@types/three` não declarado — **resolvido** pelo Orchestrator
  (adicionado como devDep pin); (2) telemetria de erro ausente no ErrorBoundary — para 7B final.

## DECISÃO FINAL: APROVADO

Spike concluído com sucesso. O envelope técnico (dynamic ssr:false + mount-on-visible +
fallback de mesma altura + error boundary + reduced-motion) está provado e deve ser o baseline
do 7B final. **Custo conhecido: ~182 kB gzip sob demanda por cena.**

## Pré-requisitos para o 7B final (com decisão de assets)

1. Decidir assets (procedural vs GLB/HDR; Ready Player Me p/ avatar) — define o orçamento de bytes.
2. Ao usar assets: `<Suspense>` interno + estratégia de preload; o payload async crescerá.
3. Medir FPS em device móvel real (material distorcido + sparkles); considerar `antialias:false`/dpr menor.
4. Pausar render fora da viewport (`frameloop="demand"` quando a cena sai da tela).
5. Equilibrar ciano/violeta e unificar paleta cena↔fallback.
6. Telemetria no ErrorBoundary para distinguir "sem WebGL" de bug real.
