# 09 - Agent Orchestration Validation Protocol

## Objetivo

Definir como os agentes devem trabalhar do inicio ao fim de cada etapa, incluindo validacao da ideia, validacao visual por screenshots, QA funcional e revisao tecnica.

Este protocolo responde a uma lacuna encontrada apos a Fase 2: a implementacao passou em testes/build, mas a validacao visual dependia do usuario abrir a aplicacao e julgar se o layout estava coerente. A partir daqui, o proprio fluxo de agentes deve produzir evidencias visuais e uma decisao de UX.

## Problema identificado

Os agentes existentes estavam muito orientados a MVP funcional:

- protegiam XP, review, auth e escopo;
- exigiam testes e build;
- mas nao exigiam screenshots;
- nao tinham um revisor visual formal;
- nao bloqueavam aceite por incoerencia visual.

Exemplo observado no dashboard do aluno:

- a tela tem dados corretos e linguagem de cockpit;
- mas o shell claro contrasta com o bloco escuro de forma pouco integrada;
- o hero ocupa altura excessiva;
- os cards laterais parecem mais dashboard comum do que experiencia premium completa;
- o mapa compacto ainda parece uma fila de labels, nao uma jornada visual madura;
- portanto a etapa deveria ser classificada como `aprovada com ressalvas` ou `rejeitada para polimento visual`, dependendo do criterio da fase.

## Novo ciclo obrigatorio

1. Product Vision Agent

- Confirma a intencao da fase.
- Define o que a tela precisa comunicar.
- Aponta riscos de promessa exagerada.

2. Tech Architect Agent

- Define boundaries tecnicos.
- Protege banco, auth, XP, review e performance.
- Indica se a fase exige ou nao mudanca de modelo.

3. AI Pedagogy Agent, quando a fase envolver curriculo, avatar tutor ou IA
   avaliadora

- Define limites de ajuda.
- Protege autonomia do aluno.
- Evita que a IA entregue respostas prontas.
- Valida progressao gradual antes de terminal/VS Code.

4. Evaluation Rubric Agent, quando a fase envolver novas missoes ou avaliacao

- Define criterios objetivos.
- Define evidencias esperadas.
- Separa aprovado, revisar e inconclusivo.
- Garante que professor e IA possam usar a mesma rubrica.

5. LLM Integration Architect, quando a fase envolver chamada a modelo

- Define arquitetura server-side.
- Define schema de saida, fallback, logging e custo.
- Garante que IA nao controle XP, auth ou regras transacionais.

6. UX Gamification Agent

- Define experiencia, hierarquia, narrativa e criterios visuais.
- Especifica o que deve aparecer na primeira dobra.
- Define o que faria a tela ser rejeitada visualmente.

7. Claude Executor

- Implementa a fase.
- Mantem escopo.
- Roda validacoes automatizadas.

8. Visual Reviewer Agent

- Abre a tela implementada.
- Captura screenshots desktop e mobile.
- Analisa os prints contra a visao.
- Decide: aprovado, aprovado com ressalvas ou rejeitado.

9. QA Tester

- Valida fluxos, rotas, estados, responsividade e regressao funcional.

10. Codex Reviewer

- Revisa codigo, riscos, boundaries e se as validacoes de UX/QA existem.
- Nao aceita tarefa visual sem evidencia visual.

11. Orchestrator

- Consolida as decisoes.
- Se houver rejeicao, manda voltar para Executor/UX.
- Se aprovado com ressalvas, decide se segue ou cria uma subfase de polimento.

## Evidencias obrigatorias para tarefas visuais

- Screenshot desktop da rota alterada.
- Screenshot mobile da rota alterada.
- Lista de viewports usadas.
- Resultado de `npm run test`.
- Resultado de `npm run typecheck`.
- Resultado de `npm run lint`.
- Resultado de `npm run build`.
- Parecer UX Visual Review.
- Parecer QA.

## Criterios de rejeicao visual

Rejeitar ou pedir correcao quando:

- a tela nao parece alinhada a jornada gamificada premium;
- o layout parece apenas SaaS/dashboard generico;
- ha mistura incoerente entre shell e conteudo;
- a primeira dobra nao comunica a proposta em ate 5 segundos;
- ha cards grandes demais, muito vazio ou hierarquia confusa;
- o mapa/jornada nao parece progressao real;
- o avatar parece placeholder sem intencao;
- ha overflow, clipping ou CTA inacessivel em mobile;
- nao ha screenshot para validar.

## Aplicacao imediata nas proximas etapas

Antes de seguir para `/aluno/missoes`, recomenda-se uma subfase `2.1 - Visual Cohesion Pass`:

- integrar o shell do aluno ao estilo premium ou criar `StudentGameShell`;
- reduzir altura e peso do hero do cockpit;
- transformar mapa compacto em componente mais visual;
- melhorar avatar como elemento de identidade e nao apenas icone;
- capturar screenshots desktop/mobile;
- submeter ao Visual Reviewer antes de aceitar.

## Aplicacao para curriculo avancado

Antes de implementar IA avaliadora, avatar tutor ou multiagentes em runtime,
executar uma fase de desenho curricular usando:

- `docs/product-evolution/18-advanced-curriculum-and-ai-agents.md`;
- Product Owner;
- AI Pedagogy Agent;
- Evaluation Rubric Agent;
- Tech Architect;
- Claude Executor;
- QA Tester;
- Codex Reviewer.

Criterios de aceite desta fase:

- fases avancadas definidas com progressao gradual;
- terminal/VS Code aparecem apenas apos fluencia basica;
- rubricas das missoes avancadas incluem evidencias verificaveis;
- Boss Final aceita niveis conceitual, operacional sem codigo e tecnico;
- IA avaliadora e avatar tutor ficam documentados como fases futuras, sem
  implementacao prematura.
