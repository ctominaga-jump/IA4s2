# 18 - Curriculo avancado e agentes de IA

> **Status (2026-06-07): rodada de design executada.** As decisoes finais,
> o conteudo aprovado das missoes, as rubricas (incluindo Boss Final por
> nivel) e a implementacao em seeds estao em
> `19-advanced-curriculum-content.md` e
> `database/seeds/0004_advanced_curriculum.sql`. Decisoes que refinaram esta
> proposta: 8 fases; 4 missoes por fase avancada (nao 5); fase 6 "Operador
> Tecnico" obrigatoria porem inclusiva, com fallback simulado em toda missao
> e compromisso de virar trilha opcional quando houver mecanismo; Boss Final
> com nivel declarado em texto, sem mudanca de schema. IA avaliadora e avatar
> tutor permanecem como fases futuras, nao implementadas.

## Objetivo

Definir a evolucao do conteudo avancado do **IA para Vida Real** antes de
implementar IA avaliadora, avatar tutor ou fluxos multiagentes.

Esta decisao vem antes das features de IA porque o comportamento da IA
avaliadora e do avatar depende diretamente das missoes, rubricas e evidencias
esperadas no final da jornada.

## Principio pedagogico

O curso nao deve jogar terminal, VS Code ou desenvolvimento cedo demais. A
jornada deve levar o aluno de fluencia geral em IA para operacao real com
ferramentas, e so depois para ambientes tecnicos e arquitetura de agentes.

Progressao desejada:

1. Conversar com IA.
2. Criar prompts claros.
3. Validar respostas.
4. Produzir materiais e mini-projetos.
5. Operar fluxos reais com IA.
6. Usar IA em ambientes tecnicos guiados.
7. Desenhar agentes e solucoes.
8. Entregar um Boss Final demonstravel.

## Fases 1 a 4

As fases iniciais permanecem essencialmente como estao:

- Despertar: reconhecer IA, perder medo e fazer os primeiros pedidos.
- Explorador: usar IA em tarefas reais e validar criticamente respostas.
- Estrategista: dominar contexto, objetivo, formato, criterios e iteracao.
- Criador: co-criar materiais, aprender com IA e montar mini-projetos.

Estas fases nao devem exigir terminal, VS Code, APIs ou automacao tecnica.

## Fase 5 - Operador de IA

Objetivo:

- Tirar o aluno do chat solto e coloca-lo em fluxos reais de trabalho.
- Ensinar IA como parte de um processo com entrada, decisao humana, saida,
  revisao e reuso.

Missoes recomendadas:

1. **Mapeie um fluxo real**
   - Entrega: tarefa repetitiva, entradas, passos, decisoes humanas, saidas e
     riscos.
   - Criterio: o processo e realista, sequencial e mostra onde IA ajuda sem
     prometer automacao impossivel.

2. **Crie um prompt operacional reutilizavel**
   - Entrega: prompt-modelo com variaveis, criterios, exemplos e checklist de
     revisao.
   - Criterio: o prompt pode ser reutilizado em casos parecidos trocando dados.

3. **Execute o fluxo com evidencia**
   - Entrega: dois testes com entrada, prompt, saida, revisao humana e decisao.
   - Criterio: os testes demonstram que o fluxo funciona e que o aluno revisou
     criticamente a saida.

4. **Use IA em uma ferramenta de trabalho**
   - Entrega: evidencia de uso em documento, planilha, navegador, Notion,
     Canva, e-mail ou automacao leve.
   - Criterio: o aluno mostra o artefato produzido e explica o papel da IA.

5. **Documente um procedimento assistido por IA**
   - Entrega: mini manual executavel por outra pessoa.
   - Criterio: o manual contem quando usar, passos, prompt, cuidados, exemplo e
     criterio de revisao.

Terminal e VS Code podem aparecer como opcao avancada nesta fase, mas nao como
obrigacao.

## Fase 6 - Operador tecnico

Objetivo:

- Introduzir terminal, VS Code e assistentes de codigo de forma guiada.
- Ensinar o aluno a pedir ajuda, interpretar erros e alterar artefatos simples
  com IA sem exigir que ele vire desenvolvedor.

Modelo recomendado:

- Trilha tecnica desbloqueavel ou modo avancado.
- Deve ser apresentada como "pilotar IA em ambiente tecnico", nao como curso de
  programacao tradicional.

Missoes recomendadas:

1. **Entenda o ambiente**
   - Entrega: glossario aplicado sobre terminal, pasta, arquivo, comando, erro
     e log, com um exemplo simples.
   - Criterio: o aluno explica os conceitos com as proprias palavras e reconhece
     o que cada elemento faz.

2. **Use IA para explicar um erro**
   - Entrega: erro real ou simulado, prompt enviado a IA, explicacao recebida e
     resumo do aluno.
   - Criterio: o aluno diferencia mensagem de erro, causa provavel e proximo
     passo.

3. **Use IA no VS Code para alterar um arquivo simples**
   - Entrega: antes/depois, prompt usado, arquivo alterado e explicacao da
     mudanca.
   - Criterio: a alteracao e pequena, verificavel e compreendida pelo aluno.

4. **Peca ajuda a IA para navegar um projeto**
   - Entrega: objetivo de busca, arquivos encontrados, pistas usadas e conclusao.
   - Criterio: o aluno demonstra leitura orientada do projeto, nao apenas copia
     uma resposta.

5. **Crie uma melhoria pequena com IA assistida**
   - Entrega: objetivo, diff ou evidencia visual, teste manual e reflexao.
   - Criterio: a melhoria e limitada, testada e explicada.

## Fase 7 - Arquiteto de agentes

Objetivo:

- Ensinar agentes como sistemas com objetivo, ferramentas, etapas, limites,
  avaliacao e fallback.
- Introduzir pensamento multiagente antes de qualquer implementacao complexa.

Missoes recomendadas:

1. **Desenhe um agente simples**
   - Entrega: objetivo, entradas, ferramentas, passos, saida, limites e criterio
     de sucesso.

2. **Transforme uma tarefa em cadeia de etapas**
   - Entrega: fluxo com etapas como pesquisar, resumir, comparar, decidir e
     gerar saida final.

3. **Defina papeis de agentes**
   - Entrega: agentes com responsabilidades distintas, criterios de
     transferencia, conflito e decisao final.

4. **Crie uma rubrica de avaliacao para IA**
   - Entrega: criterios objetivos, exemplos de aprovado, reprovado e
     inconclusivo.

5. **Planeje uma solucao com IA**
   - Entrega: publico, problema, fluxo, agentes, dados necessarios, riscos,
     validacao e prototipo.

## Boss Final - Produto com IA

O Boss Final deve aceitar tres niveis de entrega para manter inclusao sem perder
profundidade:

1. **Conceitual demonstravel**
   - Fluxo, telas desenhadas, prompts, rubrica, validacao e apresentacao.

2. **Operacional sem codigo**
   - Processo real usando ferramentas, documentos, planilhas, automacao leve ou
     agentes configurados.

3. **Tecnico**
   - Prototipo em app, site, script, integracao, API, agente via ferramenta
     tecnica ou uso de Codex/Claude Code.

O aluno deve poder concluir com excelencia em qualquer nivel, desde que a
entrega seja verificavel, honesta e bem validada.

## Impacto na IA avaliadora

A IA avaliadora deve ser projetada depois da revisao curricular.

Regras:

- A IA usa objetivo, instrucoes, entrega esperada e criterio de aceite da missao.
- A IA retorna decisao sugerida: `aprovado`, `revisar` ou `inconclusivo`.
- A IA sempre explica quais criterios foram atendidos e quais faltaram.
- A IA nao concede XP diretamente na primeira versao; ela apoia a validacao.
- Casos tecnicos devem pedir evidencia: antes/depois, log, arquivo, print,
  diff, link ou explicacao.
- Reflexao pessoal e autoria devem ser avaliadas com cuidado e podem exigir
  revisao humana.

## Impacto no avatar tutor

O avatar deve atuar como mentor contextual, nao como chatbot generico.

Contextos minimos:

- fase atual;
- missao atual;
- objetivo de aprendizagem;
- criterio de aceite;
- objetivo pessoal do aluno;
- historico recente de feedback;
- status da entrega.

Funcoes recomendadas:

- explicar a missao em linguagem simples;
- sugerir por onde comecar;
- transformar criterio de aceite em checklist;
- ajudar a revisar antes do envio;
- orientar reenvio apos feedback;
- apresentar tutorial inicial;
- indicar proxima melhor acao no cockpit.

O avatar nao deve entregar a resposta pronta quando isso prejudicar a
aprendizagem. Ele deve fazer perguntas, dar exemplos parciais e orientar o
raciocinio.

## Agentes de desenvolvimento necessarios

Além dos agentes atuais, a orquestracao deve incluir:

- **AI Pedagogy Agent**: garante que IA avaliadora e avatar ensinem sem substituir
  o pensamento do aluno.
- **Evaluation Rubric Agent**: transforma missoes em criterios avaliaveis por IA,
  com exemplos de aprovado, revisar e inconclusivo.
- **LLM Integration Architect**: define arquitetura de prompts, chamadas a modelo,
  logging, custos, fallback, seguranca e revisao humana.

## Ordem recomendada de implementacao

1. Atualizar documentos de produto e curriculo.
2. Atualizar seeds/rubricas das fases avancadas.
3. Ajustar telas de missao para exibir evidencias esperadas quando aplicavel.
4. Atualizar Boss Final para aceitar niveis de entrega.
5. Projetar avatar tutor contextual.
6. Projetar IA avaliadora assistida.
7. Implementar IA avaliadora apenas depois das rubricas revisadas.

## Fora de escopo imediato

- Executar codigo enviado pelo aluno dentro da plataforma.
- Sandbox remoto de terminal.
- Correcao automatica final sem revisao humana.
- Multiagentes autonomos tomando decisao de XP.
- Marketplace, comunidade, certificados ou ranking.
