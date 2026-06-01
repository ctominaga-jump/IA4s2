# Jornada do Professor

## Objetivo da Jornada

Permitir que o professor valide entregas de alunos com simplicidade, feedback claro e baixo custo operacional.

No MVP, o professor nao gerencia turmas, convites, certificados, rubricas configuraveis ou relatorios avancados.

## 1. Cadastro e Entrada

O professor cria uma conta, faz login e acessa o dashboard do professor.

Objetivos:

- entender rapidamente quantas entregas precisam de revisao;
- acessar a fila de validacao;
- revisar sem configuracao previa complexa.

## 2. Dashboard do Professor

O professor ve um resumo operacional.

Indicadores:

- entregas pendentes;
- entregas aprovadas;
- entregas reprovadas;
- entregas recentes.

## 3. Fila de Validacao

O professor acessa uma lista de entregas enviadas pelos alunos.

Cada item mostra:

- aluno;
- missao;
- data de envio;
- status;
- indicacao de tentativa, quando houver.

Prioridade:

Entregas pendentes aparecem primeiro.

## 4. Detalhe da Entrega

O professor abre uma entrega e ve:

- dados do aluno;
- objetivo real do aluno, quando disponivel;
- contexto da missao;
- instrucao da missao;
- resposta enviada;
- tentativas anteriores, se houver.

## 5. Feedback e Decisao

O professor escolhe:

- aprovar;
- reprovar.

Toda decisao exige feedback textual.

Efeitos:

- aprovacao concede XP ao aluno;
- reprovacao libera reenvio;
- decisao atualiza status da entrega.

## 6. Retorno ao Fluxo

Depois de avaliar, o professor retorna para a fila e continua a proxima entrega pendente.

## Momentos Criticos

- A fila deve deixar claro o que precisa de acao.
- O contexto da missao deve ficar visivel durante a avaliacao.
- O feedback deve ser rapido de escrever e util para o aluno.
- A aprovacao precisa conceder XP sem acao extra do professor.
- O professor nao deve precisar configurar turma, rubrica ou certificado para operar o MVP.

