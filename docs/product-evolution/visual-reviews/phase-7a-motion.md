# Phase 7A — Motion · Visual Review & Decisão

Data: 2026-06-01 · Orquestração de agentes (protocolo 09).

## Escopo executado

framer-motion (^11.18.2) instalado. Motion primitives em `src/components/motion/index.tsx`
(`Appear`, `Reveal`, `Stagger`/`StaggerItem`, `HoverLift`, `FloatLoop`, `Pop`, `MotionBar`),
todas respeitando `prefers-reduced-motion`. Aplicado em: landing (entrada, stagger das 7
fases/pilares, float do cockpit ilustrativo, reveal do CTA Boss), cockpit do aluno (cascata
de entrada + barras de XP animadas), cards de missão (hover/tap lift + barra), level-up
(spring + glow pulsante via `AnimatePresence`), transição leve de rota do aluno
(`src/app/aluno/template.tsx`). 3D **não** iniciado.

## Evidências (rotas × viewports)

`/`, `/preview/cockpit`, `/preview/jornada`, `/preview/levelup` em desktop (1440×900) e
mobile (390×844) → 8 PNGs `phase-7a-*` neste diretório.

## Validações automáticas

| Gate | Resultado |
|---|---|
| `npm run typecheck` | ✅ sem erros |
| `npm run lint` | ✅ sem warnings/erros |
| `npm run test` | ✅ 25/25 (6 arquivos) |
| `npm run build` | ✅ compila; professor 106 kB (sem vazamento); landing 142 kB, cockpit 155 kB |

## Pareceres

- **Visual Reviewer:** aprovado com ressalvas. Conteúdo assentado, sem clipping/overflow,
  dark premium coerente, mapa lê como progressão, modal legível. Ressalvas (não-bloqueantes):
  rótulo "Construtor" no mock do preview vs taxonomia de avatar; backdrop do level-up mobile;
  densidade do mapa horizontal no mobile.
  - **Resolução (2026-06-01):** o item "Construtor" foi um **falso positivo**. "Construtor" é
    o título oficial do **nível 4** em `database/seeds/0001_seed.sql` (sistema de níveis por XP),
    distinto da taxonomia de fases/avatar. O preview já reflete o banco real; mantido sem
    alteração por decisão do usuário.
- **QA Tester:** PRONTO. test+typecheck verdes; zero toque em server/auth/XP/review/submissão;
  formulários intactos; `prefers-reduced-motion` 100% coberto; rotas públicas HTTP 200 sem erro.
- **Codex Reviewer:** aprovado com ressalvas. Boundaries e fronteira server/client corretos;
  reduced-motion coberto; evidência visual presente. P2 substantivo: conteúdo `opacity:0` podia
  ficar invisível sem hidratação de JS.

## Ação do Orchestrator antes do aceite

Resolvido o único achado substantivo (Codex P2 no-JS): classe-âncora `m-reveal` nas primitives
de opacidade + `<noscript>` global em `src/app/layout.tsx` que força visibilidade quando o
scripting está desabilitado. Verificado no HTML SSR (estilo presente, 16 elementos com a classe,
H1 do hero no DOM). Pipeline re-rodado: typecheck/lint/test/build verdes.

## DECISÃO FINAL: APROVADO COM RESSALVAS

Pode seguir. Ressalvas remanescentes documentadas (preview mock label, polimentos finos) —
nenhuma bloqueia e parte está fora do escopo de motion. 3D (7B) é a próxima fase.
