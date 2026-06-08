# 19 - Curriculo avancado: conteudo aprovado e rubricas

Data: 2026-06-07
Fonte de dados: `database/seeds/0003_journey_content.sql` + `database/seeds/0004_advanced_curriculum.sql`.
Antecede: `18-advanced-curriculum-and-ai-agents.md` (proposta) e `10-phase-5-learning-content.md` (curriculo anterior, fases 5-6 superado por este documento).

Esta rodada idealizou e implementou o curriculo avancado (conteudo, seeds,
rubricas e docs). **Nao** implementa IA avaliadora, avatar tutor, integracao
LLM, multiagentes em runtime, execucao de codigo do aluno nem sandbox.

## Decisoes de produto (Product Owner)

1. **Terminal/VS Code**: a fase 6 "Operador Tecnico" e obrigatoria nesta rodada
   (nao existe mecanismo de trilha opcional), porem desenhada para
   nao-tecnicos: "pilotar IA em ambiente tecnico", IA como copiloto em cada
   passo, dificuldade easy/medium, e **fallback simulado** em toda missao
   ("se nao tiver ambiente, peca a IA para simular o cenario"). Compromisso
   registrado: evoluir para trilha tecnica opcional quando houver mecanismo.
2. **Estrutura**: 8 fases. 1-4 inalteradas; 5 Operador de IA; 6 Operador
   Tecnico (nova); 7 Arquiteto de Agentes; 8 Boss Final.
3. **Carga**: 4 missoes por fase avancada (5, 6 e 7); fases 1-4 mantem 3.
4. **Continuidade**: missoes existentes preservam IDs (`e0501-e0503` na fase 5;
   `e0601-e0603` na fase 7) para nao quebrar submissions/XP de alunos em
   producao. Nenhuma missao deletada.
5. **Boss Final com 3 niveis sem mudanca de schema**: o aluno declara o nivel
   no proprio texto do projeto; o professor aplica a rubrica do nivel
   declarado. Campo estruturado de nivel fica como melhoria futura.
6. **Promessa honesta**: a plataforma orienta, valida e registra progresso;
   nao executa codigo, nao automatiza por conta propria e nao avalia com IA
   nesta etapa. O curso forma usuarios fluentes e abre caminho para criadores
   de solucoes, sem prometer que todo aluno vira desenvolvedor.

## Visao por fase (estado final)

| # | Fase | Objetivo | Missoes | XP |
|---|------|----------|---------|----|
| 1 | Despertar | Reconhecer IA, perder o medo, primeiro pedido claro | 3 | 130 |
| 2 | Explorador | Usar IA em tarefas reais e validar respostas | 3 | 200 |
| 3 | Estrategista | Estruturar prompts e iterar | 3 | 255 |
| 4 | Criador | Co-criar materiais e mini-projeto | 3 | 320 |
| 5 | Operador de IA | Operar fluxos reais com IA em ferramentas de trabalho | 4 | 420 |
| 6 | Operador Tecnico | Pilotar IA em ambiente tecnico guiado | 4 | 325 |
| 7 | Arquiteto de Agentes | Desenhar agentes, cadeias, papeis e plano de produto | 4 | 520 |
| 8 | Boss Final | Produto com IA em 3 niveis de entrega | projeto | sem XP |

Total: **24 missoes · 2170 XP**. `levels` inalterados: o aluno cruza o
Nivel 5 ("Autonomia com IA", 800 XP) ao concluir a fase Criador; as fases
5-7 sao conteudo de maestria.

## Arco pedagogico (AI Pedagogy Agent)

- **F5 Operador de IA**: do chat solto para o processo — entrada, decisao
  humana, saida, revisao e reuso. O aluno aprende reutilizacao e
  responsabilidade humana sobre a saida.
- **F6 Operador Tecnico**: muda a superficie, nao a postura. Quatro degraus em
  ordem: vocabulario (zero risco) -> leitura de erro -> alteracao minima
  reversivel -> navegacao assistida + mini-melhoria. Evidencia real e simulada
  tem o mesmo valor; o que se avalia e o raciocinio, com declaracao honesta
  real/simulado (sem bonus para evidencia real, para nao induzir mentira).
- **F7 Arquiteto de Agentes**: de executor a projetista — objetivo,
  ferramentas, etapas, papeis, limites, criterio de sucesso e fallback.
- **F8 Boss Final**: sintese autonoma. Os 3 niveis sao "formas de provar a
  mesma maestria", nunca basico/intermediario/avancado.

### Regras anti-resposta-pronta (embutidas nas rubricas)

Cada missao avancada combina ao menos 2 destes mecanismos, para que colar uma
saida de IA nao baste para aprovacao:

1. Ancoragem no contexto pessoal do aluno.
2. Decisao justificada (o que aceitou/recusou e por que).
3. Recusa/edicao explicita de uma sugestao da IA.
4. Comparacao entre alternativas com conclusao.
5. Reformulacao com as proprias palavras (analogia pessoal).
6. Cadeia processual descrita (entrada -> prompt -> saida -> revisao -> decisao).
7. Reflexao sobre risco/erro.

A rubrica premia o julgamento, nao o produto.

## Missoes por fase (resumo; texto integral no seed 0004)

### Fase 5 · Operador de IA
13. **Mapeie um fluxo real seu** (`e0501`, medium, 90 XP) — fluxo proprio em
    passos, decisoes humanas e ao menos um ponto onde a IA nao decide sozinha.
14. **Crie um prompt operacional reutilizavel** (`e0502`, medium, 100 XP) —
    prompt-modelo com variaveis, criterios e checklist de revisao.
15. **Execute o fluxo em uma ferramenta de trabalho** (`e0504` NOVA, hard,
    130 XP) — 2 casos reais em ferramenta nomeada com a cadeia completa e ao
    menos uma correcao/recusa concreta.
16. **Documente o procedimento para outra pessoa** (`e0503`, medium, 100 XP) —
    mini-manual executavel por terceiros com secao "onde revisar com atencao"
    derivada da execucao real.

### Fase 6 · Operador Tecnico (toda missao aceita evidencia real OU simulada, declarada)
17. **Entenda o ambiente** (`e1601`, easy, 55 XP) — 6 termos explicados com as
    proprias palavras + analogia pessoal. Zero instalacao.
18. **Leia um erro com a IA** (`e1602`, medium, 80 XP) — mensagem colada +
    leitura em tres partes (mensagem, causa provavel, proximo passo).
19. **Alteracao minima guiada em um arquivo** (`e1603`, medium, 90 XP) —
    antes/depois colados, justificativa e forma de confirmar o resultado.
20. **Navegue um projeto e proponha uma mini-melhoria** (`e1604`, medium,
    100 XP) — pistas de busca explicadas, melhoria pequena, teste manual
    descrito e reflexao de risco.

### Fase 7 · Arquiteto de Agentes
21. **Desenhe um agente simples** (`e0601`, hard, 140 XP) — objetivo, entradas,
    ferramentas, passos, saida, limites, criterio de sucesso e **fallback**.
22. **Transforme uma tarefa em cadeia de etapas** (`e0604` NOVA, medium,
    100 XP) — etapas com entradas/saidas conectadas, ponto de decisao humana e
    justificativa da ordem.
23. **Defina papeis de agentes** (`e0602`, hard, 130 XP) — 2-3 agentes sem
    sobreposicao, criterio de transferencia, conflito e decisao final.
24. **Plano do seu produto com IA** (`e0603`, hard, 150 XP) — plano de 1 pagina
    + mini-rubrica propria (aprovado/revisar/inconclusivo). Trampolim do Boss.

## Boss Final: rubrica por nivel de entrega (Evaluation Rubric Agent)

O aluno declara o nivel no inicio do campo `problema`:
`"Nivel de entrega: conceitual demonstravel | operacional sem codigo | tecnico"`
mais uma frase sobre o porque da escolha. XP e status sao identicos entre
niveis. Os 3 niveis provam os mesmos 5 eixos:

### Eixo 1 — Problema real e publico definido
- Conceitual: problema + quem sofre, com exemplo concreto.
- Operacional: idem + observacao do problema na pratica (relato, dado).
- Tecnico: idem + caso que o prototipo realmente atende.

### Eixo 2 — Solucao especificada com fluxo de uso
- Conceitual: passo a passo de uso com telas/fluxo desenhados ou descritos.
- Operacional: evidencia do fluxo rodando na ferramenta (entrada, prompt,
  saida em ao menos um caso real).
- Tecnico: prototipo executando (comando+saida colados, antes/depois ou
  transcricao de uso).

### Eixo 3 — Validacao verificavel e honesta
- Conceitual: plano de validacao (quem, o que perguntaria, o que indicaria
  sucesso) declarando que ainda nao validou.
- Operacional: ao menos um teste real com pessoa/caso, com o que funcionou e
  o que falhou.
- Tecnico: evidencia de execucao testada + relato honesto de limites.

### Eixo 4 — Rubrica de sucesso propria (igual nos 3 niveis)
Criterios objetivos que permitam a um terceiro julgar o produto, incluindo o
que seria insuficiente.

### Eixo 5 — Reflexao critica sobre limites (igual nos 3 niveis)
Ao menos dois limites reais (onde a IA falha, onde precisa de humano, riscos)
e o proximo passo.

Briefing ao professor: avaliar pelos 5 eixos na regua do nivel declarado.
Um conceitual raso reprova tanto quanto um tecnico que roda mas nao resolve
problema real. Nao inflar o tecnico nem subestimar o conceitual.

## Exemplos de decisao (preparacao para IA avaliadora futura)

### Missao 15 — Execute o fluxo em uma ferramenta de trabalho
- **aprovado**: roda no Google Docs e no e-mail; cada caso com entrada,
  prompt, saida e decisao; recusa o tom da IA no e-mail e reescreve a
  abertura. Atende cadeia completa + correcao concreta.
- **revisar**: descreve os 2 casos e a ferramenta, mas so diz "aceitei a
  saida" sem nenhuma revisao/correcao. Falta evidencia de revisao critica.
- **inconclusivo**: fluxo generico ("uso IA no trabalho") sem ferramenta
  nomeada nem casos separados. Nao da para verificar a cadeia.

### Missao 19 — Alteracao minima guiada em um arquivo
- **aprovado**: antes/depois trocando um titulo, justificativa, confirmacao
  ("abri o arquivo e reli"), declaracao "real".
- **revisar**: descreve a mudanca em palavras, sem antes/depois e sem
  confirmacao.
- **inconclusivo**: trecho grande reescrito por inteiro, sem declaracao
  real/simulado e sem explicacao.

### Missao 21 — Desenhe um agente simples
- **aprovado**: agente de organizacao de e-mails completo, com limites ("nao
  apaga e-mails") e fallback ("se nao tiver certeza, marca para revisao
  humana").
- **revisar**: desenho completo, mas sem o fallback (item obrigatorio).
- **inconclusivo**: "um agente que ajuda no trabalho" sem objetivo, passos e
  limites separados.

## Riscos de avaliacao (limites para IA avaliadora futura)

- **Missao 17 (analogias pessoais)**: IA tende a aprovar reformulacao
  plausivel porem decorada; revisao humana por amostragem.
- **Rubricas proprias (missao 24 e eixo 4 do Boss)**: meta-avaliacao
  subjetiva; avaliadores podem divergir.
- **Reflexao critica (missao 24 e eixo 5 do Boss)**: risco de premiar texto
  bem escrito porem raso.
- **Declaracao real/simulado (fase 6)**: IA nao confirma a veracidade; o
  rigor do raciocinio e avaliavel, a honestidade depende de amostragem humana.
- **Validacao honesta (eixo 3 do Boss)**: distinguir validacao real de
  declarada exige checagem de consistencia; arriscado para decisao automatica.

## Implicacoes pedagogicas do avatar tutor (documentado; NAO implementado)

- Geral: pode explicar a missao, transformar criterio em checklist, sugerir
  por onde comecar e revisar antes do envio; **nunca** gera a entrega final
  nem preenche decisoes/justificativas do aluno.
- F5: ajuda a estruturar fluxo e prompt-modelo; nao escolhe a tarefa nem os
  pontos de revisao humana.
- F6: explica jargao, traduz erros, gera cenarios simulados; devolve a
  interpretacao como pergunta; desencoraja instalacoes arriscadas e nunca
  instrui comandos destrutivos; nao afirma que algo funcionou sem o aluno
  verificar.
- F7: exemplos parciais e perguntas socraticas; nao define limites, papeis
  nem regra de conflito pelo aluno.
- Boss: revisor/treinador dos 5 eixos, devolve lacunas como perguntas; nao
  escolhe o nivel nem escreve validacao/rubrica.
- Pedido de resposta pronta: responde com pergunta orientadora, exemplo
  parcial ou checklist.
- Entregas de reflexao/autoria e Boss Final: sinaliza "requer revisao humana".

## Implementacao tecnica desta rodada

- `database/seeds/0004_advanced_curriculum.sql` (novo): autoridade da
  numeracao de fases. Renumera com seguranca (Boss 7->8, Arquiteto 6->7,
  nova fase 6) respeitando `UNIQUE(number)`; novo modulo `d0007`; upsert das
  12 missoes avancadas (positions 13-24). Idempotente, keyed por id.
- `database/seeds/0002_journey_phases.sql` (editado): upsert por
  `ON CONFLICT (id)` sem atualizar `number` — re-execucao apos o 0004 nao
  corrompe nem viola unique.
- `tests/curriculum-seed.test.ts` (novo): invariantes estaticas — 24 missoes,
  positions 1..24 unicas, XP nas bandas (easy 40-60, medium 70-100, hard
  120-150), nenhuma missao deletada, 4 missoes por fase avancada, sem
  terminal/VS Code antes da fase 6, fase 6 so easy/medium com declaracao
  real/simulado, ordem segura de renumeracao.
- Aplicacao em producao (`gvivzcajymwhljvjrjoq`): executar apenas o
  `0004_advanced_curriculum.sql` (service role). Fresh DB: cadeia completa
  0001 -> 0004 em ordem.

## Coesao de interface com as 8 fases (rodada 2026-06-07 — RESOLVIDA)

A dessincronia entre a jornada real de 8 fases e a interface (que era
hardcoded para 7) foi resolvida em rodada de coesao dedicada:

- `currentPhaseIndex` no cockpit e no perfil deixou de ser proporcao de XP
  (`floor((aprovadas/total)*7)`) e passa a ser derivado da **jornada real**
  via novo helper `resolveCurrentPhaseIndex` em `src/lib/journey.ts`
  (`buildJourneyMap` sobre `journey_phases`). Isso elimina o risco de exibir
  o Boss Final antes da hora: a ultima fase so e apontada quando todas as
  fases com missoes estao concluidas.
- `PHASES[]` em `src/components/game/journey-phases.ts` passou a 8 itens
  (nomes curtos para os nos do mapa: "Operador IA" e "Op. Tecnico" com
  icones distintos — Workflow vs Terminal — e "Arquiteto" com Network).
- `AVATAR_STATES` e `KIT_PHASE_SLUGS` em
  `src/components/three/avatar/avatar-states.ts` passaram a 8 (coroa no
  indice 7/Boss). A fase 6 "Operador Tecnico" **reusa o kit GLB `operador`**
  como fallback consciente (sem GLB proprio nesta rodada); a diferenciacao
  vem das camadas procedurais (secondary verde, +1 anel, mais particulas).
- Literais de produto atualizados: "8 fases" (landing) e "Oito fases"
  (cockpit); landing com 8 cards (grid responsivo 1/2/4/8) e copy honesta
  (Operador de IA = fluxos; Operador Tecnico = ambiente guiado "sem virar
  programador"; Arquiteto de Agentes = "no papel").
- Testes: `tests/avatar-states.test.ts` atualizado para 8; novo
  `tests/journey-phases.test.ts` (contrato de 8 nomes + casos do helper,
  incluindo anti-boss-prematuro). Suite 52/52.

### Follow-ups remanescentes (nao bloqueantes)

- **Deploy atomico obrigatorio**: a UI de 8 fases e o seed
  `0004_advanced_curriculum.sql` devem ir juntos. Publicar a UI com o banco
  ainda em 7 fases desloca o nome/avatar das fases 6-7 (indice posicional
  derivado de `journey_phases.number` x `PHASES` local). Apos aplicar o seed,
  o estado fica correto.
- **GLB proprio da fase tecnica**: gerar
  `avatar-{variante}-kit-operador-tecnico.glb` (4 variantes) e trocar o slug
  do indice 5 em `KIT_PHASE_SLUGS` de `operador` para `operador-tecnico`.
- **Nomes curtos x longos**: cockpit usa nomes curtos ("Op. Tecnico"),
  jornada usa os longos do seed ("Operador Tecnico"). Decisao de produto
  aceita (nos compactos do mapa); evoluir se gerar atrito.

## Fora de escopo confirmado

- IA avaliadora (projetar depois, usando as rubricas e exemplos deste doc).
- Avatar tutor contextual (implicacoes documentadas acima).
- Integracao LLM, multiagentes em runtime, execucao de codigo, sandbox.
- Mudanca de schema (campo de nivel do Boss Final fica para rodada futura).
- Mecanismo de trilha tecnica opcional.
