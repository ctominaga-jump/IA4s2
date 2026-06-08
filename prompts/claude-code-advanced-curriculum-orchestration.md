# Prompt para Claude Code - Curriculo avancado

Voce e o orquestrador tecnico do projeto **IA para Vida Real**. Sua tarefa e
coordenar os agentes do repositorio para idealizar e preparar a implementacao do
**Curriculo Avancado Proposto**, sem implementar IA avaliadora nem avatar tutor
nesta rodada.

## Contexto obrigatorio

Leia antes de propor ou alterar qualquer coisa:

- `docs/product-evolution/02-new-product-vision.md`
- `docs/product-evolution/03-game-design-learning-journey.md`
- `docs/product-evolution/10-phase-5-learning-content.md`
- `docs/product-evolution/18-advanced-curriculum-and-ai-agents.md`
- `docs/product-evolution/07-agent-execution-plan.md`
- `docs/product-evolution/09-agent-orchestration-validation-protocol.md`
- `prompts/agents/orchestrator.md`
- `prompts/agents/product-owner.md`
- `prompts/agents/ai-pedagogy.md`
- `prompts/agents/evaluation-rubric.md`
- `prompts/agents/llm-integration-architect.md`
- `prompts/agents/tech-architect.md`
- `prompts/agents/claude-executor.md`
- `prompts/agents/qa-tester.md`
- `prompts/agents/codex-reviewer.md`
- `database/seeds/0003_journey_content.sql`

## Objetivo da rodada

Atualizar o curriculo avancado para que as fases finais ensinem, de forma
gradual:

1. Operacao de fluxos reais com IA.
2. Uso de IA em ferramentas de trabalho.
3. Introducao guiada a terminal, VS Code e assistentes de codigo.
4. Pensamento de agentes e multiagentes.
5. Boss Final com tres niveis de entrega: conceitual demonstravel, operacional
   sem codigo e tecnico.

## Agentes a orquestrar

Use a seguinte sequencia:

1. Product Owner
   - Confirma promessa de produto e limites de escopo.
   - Decide se terminal/VS Code entram como trilha tecnica ou obrigatoria.

2. AI Pedagogy Agent
   - Garante progressao segura para iniciantes.
   - Define como evitar resposta pronta e preservar autonomia.

3. Evaluation Rubric Agent
   - Reescreve criterios de aceite das fases avancadas.
   - Define evidencias esperadas por missao.

4. Tech Architect
   - Avalia impacto em schema, seeds, telas e testes.
   - Protege XP, auth, review e fluxo de submissao.

5. Claude Executor
   - Implementa somente alteracoes de conteudo/docs/seeds aprovadas.
   - Nao implementa chamadas LLM nesta rodada.

6. QA Tester
   - Valida consistencia do conteudo, seeds e fluxos afetados.
   - Roda testes automatizados disponiveis.

7. Codex Reviewer
   - Revisa diffs, riscos e aderencia ao escopo.

## Escopo permitido

Pode alterar:

- documentos em `docs/product-evolution/`;
- prompts em `prompts/agents/` se necessario;
- seeds de conteudo em `database/seeds/` para refletir o novo curriculo;
- docs de QA/produto se ficarem desatualizados;
- testes de conteudo/progressao se o seed mudar.

Pode propor, mas nao implementar ainda:

- IA avaliadora;
- avatar tutor contextual;
- integracao LLM;
- multiagentes em runtime;
- execucao de codigo do aluno;
- sandbox remoto.

## Regras de produto

- Nao jogar terminal ou VS Code cedo demais.
- Fases 1 a 4 continuam acessiveis para iniciantes.
- Fase 5 deve ser "Operador de IA" com fluxos reais e ferramentas de trabalho.
- Fase 6 deve ser "Operador tecnico" ou trilha tecnica guiada.
- Fase 7 deve ser "Arquiteto de agentes".
- Boss Final deve aceitar tres niveis de entrega.
- O curso deve formar usuarios fluentes e abrir caminho para criadores de
  solucoes, sem prometer que todo aluno vira desenvolvedor.

## Criterios de aceite

- Existe uma proposta curricular clara para fases avancadas.
- Cada nova missao possui objetivo, instrucoes, entrega esperada e rubrica.
- Rubricas pedem evidencias verificaveis quando houver ferramenta, terminal ou
  VS Code.
- A avaliacao continua possivel por professor humano.
- O desenho futuro de IA avaliadora fica mais facil, mas nao e implementado.
- O avatar tutor tem implicacoes pedagogicas documentadas, mas nao e
  implementado.
- Testes automatizados relevantes passam, ou os bloqueios sao registrados.

## Entrega final esperada

Ao final, responda com:

- resumo das decisoes de produto;
- arquivos alterados;
- principais mudancas no curriculo;
- riscos remanescentes;
- comandos de validacao executados e resultados;
- recomendacao de proxima fase.
