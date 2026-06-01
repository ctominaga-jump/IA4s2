# Fase 5 — Conteudo da Jornada Educacional + Rubrica do Professor

Data: 2026-05-31
Fonte de dados: `database/seeds/0003_journey_content.sql` (aplicado no projeto `gvivzcajymwhljvjrjoq`).

A jornada vai do primeiro contato com IA ao desenho de solucoes proprias.
Sao 6 fases de aprendizagem (Despertar -> Arquiteto de IA) com 3 missoes cada
(18 no total), todas com objetivo, instrucoes, entrega esperada e **criterio de
aprovacao** (rubrica). A fase 7 (Boss Final) e o projeto final — Fase 6 do roadmap.

## Visao por fase

| # | Fase | Objetivo de aprendizagem da fase | Missoes | XP |
|---|------|----------------------------------|---------|----|
| 1 | Despertar | Reconhecer IA no cotidiano, perder o medo e formular o primeiro pedido claro | 3 | 130 |
| 2 | Explorador | Usar IA para tarefas reais e validar criticamente as respostas | 3 | 200 |
| 3 | Estrategista | Estruturar prompts (contexto, criterios, restricoes) e iterar | 3 | 255 |
| 4 | Criador | Co-criar materiais e entregar um mini-projeto com etapas | 3 | 320 |
| 5 | Operador | Mapear, automatizar e documentar um fluxo apoiado por IA | 3 | 330 |
| 6 | Arquiteto de IA | Desenhar agente, especificar solucao e planejar um produto | 3 | 430 |

Total: **18 missoes · 1665 XP**. Os niveis (`levels`) nao foram alterados:
o aluno cruza o Nivel 5 ("Autonomia com IA", 800 XP) ao concluir a fase Criador,
deixando Operador e Arquiteto como conteudo de maestria.

## Progressao de XP e dificuldade

- XP cresce com a profundidade: `easy` 40-60, `medium` 70-100, `hard` 120-150.
- Cada missao tem `estimated_minutes` (10 a 60) coerente com a dificuldade.
- Nenhuma regra de XP/level/review foi tocada — XP continua concedido uma unica
  vez por missao, apenas na aprovacao, via `review_submission` (service role).

## Rubrica por missao (criterio de aprovacao)

O professor ve este criterio na tela da entrega (campo "Criterio de aprovacao").
A linguagem da rubrica e objetiva para reduzir variacao entre avaliadores.

### Fase 1 · Despertar
1. **Descubra a IA no seu dia** — 3 exemplos concretos e plausiveis, cada um com o papel da IA explicado pelo aluno.
2. **Sua primeira conversa com IA** — 3 perguntas reais, resumo do retorno e uma reflexao pessoal.
3. **Crie um prompt claro** — prompt com contexto, objetivo e formato; justificativa de clareza.

### Fase 2 · Explorador
4. **Resolva uma tarefa real com IA** — tarefa, prompt e resultado, com o que foi aproveitado.
5. **Revise e melhore um texto com IA** — original + revisado e justificativa de uma sugestao recusada.
6. **Cheque uma resposta da IA** — verificacao em fonte externa identificavel e conclusao justificada.

### Fase 3 · Estrategista
7. **Planeje um objetivo em passos** — plano de 3 a 5 passos com ao menos um ajuste do aluno.
8. **Prompt com criterios de qualidade** — criterios e restricao explicitos; comparacao objetiva com prompt simples.
9. **Itere ate o resultado certo** — 3 iteracoes com pedidos especificos e evolucao clara.

### Fase 4 · Criador
10. **Use IA para aprender algo novo** — explicacao recebida + explicacao propria demonstrando entendimento.
11. **Crie um material com IA** — material pronto para uso, distinguindo IA das edicoes proprias.
12. **Monte um mini-projeto guiado** — objetivo claro, 3 etapas com IA e entregavel concreto.

### Fase 5 · Operador
13. **Mapeie uma tarefa repetitiva** — processo real em passos e oportunidades realistas de IA.
14. **Crie um fluxo assistido por IA** — prompt reutilizavel + fluxo (entrada/IA/revisao/saida) testado em 2 casos.
15. **Documente seu fluxo para reuso** — manual executavel por terceiros (passos, cuidados, exemplo).

### Fase 6 · Arquiteto de IA
16. **Desenhe um agente de IA** — objetivo, recursos, passos e limites coerentes.
17. **Especifique uma solucao com IA** — publico, funcao, uso, entradas/saidas e criterio de sucesso mensuravel.
18. **Plano do seu produto com IA** — plano coerente do problema a validacao (trampolim para o Boss Final).

## Honestidade do produto

- As missoes de Operador e Arquiteto sao acessiveis a iniciantes: as entregas
  sao descricoes, planos e especificacoes em texto. O produto **nao executa
  codigo nem automatiza por conta propria** — nada e prometido alem do que existe.
- O ciclo continua: aluno envia -> professor avalia com a rubrica -> feedback -> XP.

## Briefing para o professor

- Use o "Criterio de aprovacao" como checklist objetivo: aprove quando todos os
  itens do criterio estiverem presentes; reprove com feedback acionavel indicando
  o item faltante.
- A entrega e textual; valorize evidencia de pensamento proprio (reflexao,
  ajustes, decisoes) acima de respostas copiadas da IA.
- O XP e automatico na aprovacao; nao ha nota — apenas aprovado/reprovado + comentario.
