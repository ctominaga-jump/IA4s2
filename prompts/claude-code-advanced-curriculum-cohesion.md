# Prompt para Claude Code - Coesao do curriculo avancado

Voce e o orquestrador tecnico do projeto **IA para Vida Real**. Sua tarefa e
coordenar os agentes do repositorio para executar uma rodada curta de **coesao
visual, narrativa e tecnica** apos a criacao do curriculo avancado.

## Contexto do problema

A rodada anterior criou o curriculo avancado com 8 fases e 24 missoes:

1. Despertar
2. Explorador
3. Estrategista
4. Criador
5. Operador de IA
6. Operador Tecnico
7. Arquiteto de Agentes
8. Boss Final

O conteudo e os seeds foram aprovados em validacao automatica, mas a aplicacao
ainda possui pontos hardcoded para 7 fases. Antes de aplicar o seed 0004 em
producao, esta rodada deve alinhar cockpit, perfil, jornada, avatar e textos
para a nova estrutura de 8 fases.

## Contexto obrigatorio

Leia antes de propor ou alterar qualquer coisa:

- `docs/product-evolution/02-new-product-vision.md`
- `docs/product-evolution/03-game-design-learning-journey.md`
- `docs/product-evolution/18-advanced-curriculum-and-ai-agents.md`
- `docs/product-evolution/19-advanced-curriculum-content.md`
- `docs/product-evolution/07-agent-execution-plan.md`
- `docs/product-evolution/09-agent-orchestration-validation-protocol.md`
- `prompts/agents/orchestrator.md`
- `prompts/agents/product-owner.md`
- `prompts/agents/ux-gamification.md`
- `prompts/agents/tech-architect.md`
- `prompts/agents/claude-executor.md`
- `prompts/agents/visual-reviewer.md`
- `prompts/agents/qa-tester.md`
- `prompts/agents/codex-reviewer.md`
- `database/seeds/0004_advanced_curriculum.sql`
- `src/app/aluno/page.tsx`
- `src/app/aluno/perfil/page.tsx`
- `src/components/game/journey-phases.ts`
- `src/components/game/student-cockpit.tsx`
- `src/components/game/profile-view.tsx`
- `src/components/three/avatar/avatar-states.ts`
- `src/app/page.tsx`

## Objetivo da rodada

Resolver a dessincronia entre a jornada real de 8 fases e a interface ainda
baseada em 7 fases.

Esta rodada deve:

1. Atualizar a metadata visual de fases para 8 fases.
2. Evitar que cockpit/perfil/avatar exibam fase errada quando o aluno progride
   pelas 24 missoes.
3. Atualizar literais de produto que ainda dizem "7 fases" ou "sete fases".
4. Garantir que a fase "Operador Tecnico" tenha representacao visual honesta,
   mesmo que ainda nao exista kit GLB proprio.
5. Validar as telas alteradas em desktop e mobile com screenshots.

## Agentes a orquestrar

Use a seguinte sequencia:

1. Product Owner
   - Confirma que a rodada e apenas coesao da interface com o curriculo
     aprovado.
   - Bloqueia mudancas de conteudo, IA avaliadora, avatar tutor e LLM.

2. Tech Architect
   - Define a forma mais simples e segura de representar 8 fases.
   - Decide se a fase visual deve continuar em constante local ou usar dados de
     `journey_phases`.
   - Protege auth, XP, review, submissions e seeds.

3. UX Gamification Agent
   - Define nome, icone e tratamento visual para "Operador Tecnico".
   - Garante que cockpit, perfil e jornada comuniquem 8 fases sem parecer
     remendo.
   - Define criterios visuais de aceite.

4. Claude Executor
   - Implementa somente a coesao aprovada.
   - Mantem escopo pequeno.

5. Visual Reviewer Agent
   - Abre as rotas alteradas.
   - Captura screenshots desktop e mobile.
   - Avalia se a jornada de 8 fases esta clara e visualmente coerente.

6. QA Tester
   - Valida fluxo do aluno, missoes, perfil, cockpit e estados de progresso.
   - Roda testes automatizados.

7. Codex Reviewer
   - Revisa diffs, regressao, aderencia ao escopo e riscos remanescentes.

## Escopo permitido

Pode alterar:

- `src/components/game/journey-phases.ts`
- `src/app/aluno/page.tsx`
- `src/app/aluno/perfil/page.tsx`
- `src/components/game/student-cockpit.tsx`
- `src/components/game/profile-view.tsx`
- `src/components/three/avatar/avatar-states.ts`
- `src/app/page.tsx`
- previews relacionados, se quebrarem por depender de 7 fases
- testes automatizados relacionados a fases/progresso/avatar
- docs em `docs/product-evolution/` para registrar a coesao

Pode criar:

- helper pequeno para calcular fase atual com base no total real de fases;
- teste unitario para garantir que a metadata visual tem 8 fases;
- fallback visual ou mapeamento para "Operador Tecnico" no avatar.

## Fora de escopo

Nao implementar:

- IA avaliadora;
- avatar tutor conversacional;
- chamadas LLM;
- multiagentes em runtime;
- execucao de codigo do aluno;
- sandbox;
- novas missoes;
- mudanca de XP;
- mudanca de schema;
- aplicacao do seed 0004 em producao;
- geracao obrigatoria de novo GLB nesta rodada.

Se o agente de UX ou Tech Architect concluir que um novo GLB para
`operador-tecnico` e necessario, registre como follow-up. Nesta rodada, aceite
fallback visual coerente.

## Pontos conhecidos a corrigir

- `JOURNEY_PHASE_COUNT = 7` em `src/app/aluno/page.tsx`.
- `JOURNEY_PHASE_COUNT = 7` em `src/app/aluno/perfil/page.tsx`.
- `PHASES[]` com 7 itens em `src/components/game/journey-phases.ts`.
- Comentario "7 fases narrativas" em `journey-phases.ts`.
- Literais "7 fases" ou "Sete fases" em landing/cockpit/perfil/previews.
- `AVATAR_STATES` e `KIT_PHASE_SLUGS` sem representacao explicita para
  `operador-tecnico`.

## Regras de produto

- A jornada deve comunicar 8 fases, nao 7.
- "Operador de IA" e "Operador Tecnico" devem parecer fases diferentes.
- O aluno nao deve ver "Boss Final" antes da hora por erro de calculo visual.
- O avatar pode usar fallback ou kit reaproveitado, desde que a fase tecnica nao
  desapareca.
- O app nao deve depender de aplicar o seed 0004 em producao para compilar.
- As missoes devem continuar sendo carregadas do banco e ordenadas por posicao.

## Criterios de aceite

- Cockpit mostra mapa com 8 fases.
- Perfil/avatar conseguem representar a fase 6 "Operador Tecnico".
- Nenhum literal visivel continua prometendo 7 fases.
- Progressao visual nao comprime 24 missoes em 7 fases.
- Build, typecheck, lint e testes passam.
- Screenshots desktop e mobile das rotas alteradas foram capturados e revisados.
- Visual Reviewer classifica como aprovado ou aprovado com ressalvas nao
  bloqueantes.
- Codex Reviewer nao encontra P0/P1.

## Rotas para validacao visual

Abrir e capturar desktop e mobile:

- `/`
- `/aluno`
- `/aluno/perfil`
- `/aluno/missoes`
- previews relevantes, se existirem e forem alterados:
  - `/preview/cockpit`
  - `/preview/perfil`
  - `/preview/jornada`

## Comandos de validacao obrigatorios

Execute e reporte:

- `npm run test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

Se algum comando falhar, corrija ou registre bloqueio claro.

## Entrega final esperada

Ao final, responda com:

- resumo das decisoes de produto e arquitetura;
- arquivos alterados;
- como a jornada de 8 fases ficou representada;
- como o avatar/fallback lida com "Operador Tecnico";
- screenshots capturados e parecer do Visual Reviewer;
- comandos de validacao executados e resultados;
- riscos remanescentes;
- recomendacao sobre aplicar ou nao o seed 0004 em producao.
