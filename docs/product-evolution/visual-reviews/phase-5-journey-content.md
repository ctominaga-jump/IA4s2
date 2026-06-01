# Fase 5 — Jornada Educacional Completa — Relatorio de Orquestracao

Data: 2026-05-31
Rotas tocadas: `/aluno/missoes` (jornada), `/aluno/missoes/[missionId]` (detalhe),
`/professor/entregas/[submissionId]` (avaliacao). Conteudo via banco.
Banco: projeto `gvivzcajymwhljvjrjoq` — seed `0003_journey_content` aplicado (apenas dados).
Evidencias visuais: `/preview/jornada`.

## Escopo declarado

- Criar o conteudo completo das fases de aprendizagem Despertar -> Arquiteto de IA.
- Cada missao com objetivo, instrucoes, entrega esperada e criterio de aceite (rubrica).
- Revisar XP por dificuldade e tempo estimado.
- Dar ao professor contexto suficiente para avaliar de forma consistente.

## Fora de escopo (nao alterado)

- XP, `review_submission`, `level_for_xp`, niveis, submissoes, feedback, auth.
- Schema do banco (nenhum DDL — todas as colunas ja existiam desde a Fase 3).
- Boss Final / projeto final (Fase 6 do roadmap) — fase 7 segue sem missoes.
- Avatar/3D/motion.

## Agentes acionados

1. **Product Vision** — a jornada deve levar o aluno do zero a arquitetura, com promessa honesta: entregas sao texto, o produto nao executa codigo nem automatiza sozinho.
2. **Tech Architect** — mudanca 100% aditiva e somente em dados; seed idempotente (UUIDs fixos + `ON CONFLICT`). Reatribuir `module_id` de missoes e seguro (submissoes referenciam `mission_id`; 0 submissoes no banco). Niveis e regras de XP intocados.
3. **Learning Experience** — definiu objetivos por fase, 18 missoes praticas, entregas esperadas e rubricas objetivas para reduzir variacao entre professores.
4. **Gamification** — XP cresce com dificuldade (easy 40-60 / medium 70-100 / hard 120-150); L5 alcancado ao fim de Criador; Operador e Arquiteto como maestria.
5. **Claude Executor** — escreveu o seed, aplicou no banco, exibiu o criterio de aprovacao na tela do professor, atualizou o preview e o script de screenshots.
6. **Visual Reviewer** — analisou a jornada completa em desktop/mobile (decisao abaixo).
7. **QA Tester** — validou regressao, integridade do conteudo e o gap do professor (abaixo).
8. **Codex Reviewer** — verificou escopo aditivo, idempotencia, ausencia de regressao, cobertura de testes e evidencia visual.

## Arquivos alterados / criados

- `database/seeds/0003_journey_content.sql` — curso reposicionado, 6 modulos (1 por fase), 18 missoes com rubrica.
- `src/app/professor/entregas/[submissionId]/page.tsx` — exibe "Criterio de aprovacao" ao professor.
- `src/app/preview/jornada/page.tsx` — preview atualizado para a jornada completa (18 missoes, 7 fases).
- `scripts/shoot.mjs` — captura `phase-5-jornada-completa`.
- `docs/product-evolution/10-phase-5-learning-content.md` — objetivos por fase + rubrica + briefing do professor.
- Screenshots `phase-5-jornada-completa-{desktop,mobile}.png`.

## Validacao automatica

- `npm run typecheck` — sem erros.
- `npm run lint` — sem warnings/erros.
- `npm run test` — 22/22 passam (a logica de `buildJourneyMap` ja cobre o agrupamento por fase; conteudo e dado, validado direto no banco).
- `npm run build` — sucesso.

## Aplicacao no banco (Supabase real) e verificacao

- Seed `0003` aplicado via MCP `execute_sql` (dados, nao DDL).
- Verificado por consulta agregada:
  - Despertar 3 / 130 XP, Explorador 3 / 200, Estrategista 3 / 255, Criador 3 / 320, Operador 3 / 330, Arquiteto 3 / 430, Boss Final 0.
  - Total: 18 missoes publicadas, 1665 XP, 6 modulos, **0 missoes sem criterio de aceite**.
- Regressao: nenhuma alteracao em XP/review/submissoes/niveis; nada removido (5 missoes do seed 0001 preservadas e reaproveitadas).

## Parecer Visual Reviewer

Decisao: **Aprovado**.

- A jornada agora le como progressao real: 7 fases, 18 missoes, do Despertar ao Boss Final.
- Header com objetivo do aluno, barra de progresso global (6/18) e fases com estado (concluida/ativa/bloqueada).
- Cada missao mostra titulo, descricao, status e chips de dificuldade, tempo e XP.
- Boss Final destacado como clima da jornada ("em breve").
- Desktop (1440x900) e mobile (390x844) sem overflow/clipping; coerente com o tema premium.
- Nota de processo: a primeira captura saiu sem CSS porque um dev server antigo da sessao anterior ocupava a porta 3000 com cache `.next` corrompido (CSS 404). Recapturado contra o server novo (`:3004`) com CSS 200.

## Parecer QA

- XP/review/submissoes/auth intactos (seed so insere/atualiza conteudo).
- Conteudo integro: 18 missoes publicadas, todas com objetivo, instrucoes, entrega e criterio.
- Gap corrigido: o professor agora ve o criterio de aprovacao na tela da entrega — antes so via objetivo, instrucoes e entrega esperada.
- Detalhe da missao do aluno ja exibia dificuldade, tempo, XP e criterio de aceite (desde a Fase 3) — sem regressao.
- Idempotencia: reaplicar o seed nao duplica (UUIDs fixos + `ON CONFLICT DO UPDATE`).

## Riscos remanescentes

- Validacao autenticada real depende de conta de aluno/professor no Supabase; validada via preview + verificacao do schema/agregados.
- As missoes de Operador/Arquiteto pedem artefatos mais densos; o professor deve usar a rubrica para manter consistencia.
- A jornada cruza o nivel maximo (L5) na fase 4; se no futuro quisermos alinhar o apice ao fim da jornada, sera preciso revisar `levels` (fora do escopo desta fase).

## Decisao da fase

**Aprovado.** Conteudo das fases Despertar -> Arquiteto completo e aplicado.
Pronto para a Fase 6 (Boss Final / TCC) e, depois, Fase 7 (motion/3D).
