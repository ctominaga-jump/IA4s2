# MVP Scope

## Objetivo

Validar o fluxo essencial do portal **IA para Vida Real**: o aluno declara um objetivo real, acessa missoes praticas, envia entregas, recebe validacao humana, ganha XP e progride em niveis; o professor acompanha entregas, valida atividades e orienta melhoria com feedback.

O MVP deve provar que a experiencia central gera autonomia pratica: definir objetivo, executar uma missao, receber feedback, revisar e melhorar.

## Funcionalidades Incluidas

### Cadastro e Login

- Cadastro de usuario com nome, e-mail, senha e tipo de perfil.
- Login com e-mail e senha.
- Perfis iniciais: aluno e professor.
- Sessao autenticada.
- Logout.

### Onboarding e Objetivo Real

- O aluno informa um objetivo real de aprendizagem ou execucao.
- Exemplos: aprender ingles, criar um site, conseguir emprego, passar em uma prova, abrir um negocio.
- O objetivo e registrado para dar contexto a jornada.
- O MVP nao gera trilha personalizada automaticamente a partir do objetivo.

### Dashboard do Aluno

- Nome do aluno.
- Objetivo real ativo.
- XP acumulado.
- Nivel atual.
- Progresso geral nas missoes.
- Lista resumida de missoes pendentes, enviadas, aprovadas e reprovadas.
- Acesso rapido a missoes disponiveis.

### Lista de Missoes

- Exibicao de missoes disponiveis para o aluno.
- Cada missao contem titulo, descricao, objetivo, instrucoes, XP concedido e status.
- Status possiveis: nao iniciada, enviada, aprovada, reprovada.
- O aluno pode abrir detalhes de uma missao.

### Envio de Entrega

- O aluno envia uma resposta textual para uma missao.
- O sistema registra data e hora do envio.
- A entrega entra na fila de validacao do professor.
- O aluno visualiza status da entrega.
- Caso a entrega seja reprovada, o aluno pode enviar uma nova versao.

### XP e Niveis

- O aluno ganha XP quando uma entrega e aprovada.
- Cada missao possui uma quantidade fixa de XP.
- O nivel do aluno e calculado com base no XP total.
- O dashboard do aluno exibe XP total, nivel atual e progresso.

### Dashboard do Professor

- Total de entregas pendentes.
- Total de entregas aprovadas.
- Total de entregas reprovadas.
- Lista de entregas recentes.
- Acesso a fila de validacao.

### Fila de Validacao

- Lista de entregas enviadas por alunos.
- Cada item mostra aluno, missao, data de envio e status.
- O professor pode abrir a entrega para revisao.
- Entregas pendentes aparecem com prioridade sobre avaliadas.

### Aprovacao/Reprovacao com Feedback

- O professor pode aprovar uma entrega.
- O professor pode reprovar uma entrega.
- Toda avaliacao deve conter feedback textual.
- Ao aprovar, o sistema concede XP ao aluno.
- Ao reprovar, o sistema libera reenvio da entrega pelo aluno.
- O aluno consegue ver o resultado e o feedback recebido.

## Funcionalidades Fora do MVP

- Cadastro de validadores separados do professor.
- Perfil de administrador.
- Turmas, convites e codigos.
- Editor completo de trilhas, cursos ou missoes.
- Biblioteca publica de missoes.
- Rubricas configuraveis.
- Anexos em entregas.
- Comentarios em thread.
- Revisao entre pares.
- Rankings.
- Badges operacionais.
- Streaks.
- Certificados.
- Portfolio publico.
- Relatorios avancados.
- Recomendacao automatica de missoes.
- Personalizacao por IA.
- IA avaliadora.
- Integracoes externas.
- Pagamentos ou planos.
- Aplicativo mobile nativo.
- Multi tenant.
- Marketplace.
- Comunidade.
- Gamificacao avancada.

## Regras de Negocio

### Usuarios e Perfis

- Todo usuario deve possuir exatamente um perfil inicial: aluno ou professor.
- Apenas usuarios autenticados podem acessar dashboards, missoes e entregas.
- Alunos nao podem acessar a fila de validacao.
- Professores nao recebem XP nem nivel no MVP.

### Objetivos Reais

- Todo aluno deve poder registrar pelo menos um objetivo real.
- O MVP considera apenas um objetivo ativo por aluno.
- O objetivo orienta contexto e copy, mas nao personaliza automaticamente missoes.
- O aluno pode editar o texto do objetivo antes de enviar novas entregas.

### Missoes

- Missoes sao previamente cadastradas no sistema.
- Toda missao deve ter titulo, descricao, instrucoes e valor de XP.
- Uma missao pode ser enviada uma ou mais vezes pelo aluno quando houver reprovacao.
- Uma missao aprovada nao pode receber novo envio no MVP.

### Entregas

- Uma entrega pertence a um aluno e a uma missao.
- Toda nova entrega deve iniciar com status pendente.
- Status validos da entrega: pendente, aprovada, reprovada.
- Uma entrega pendente nao pode ser reenviada ate ser avaliada.
- O feedback do professor e obrigatorio tanto na aprovacao quanto na reprovacao.

### XP

- XP so e concedido quando uma entrega e aprovada.
- XP de uma mesma missao deve ser concedido apenas uma vez por aluno.
- Reenvios reprovados nao concedem XP.
- Alterar uma entrega aprovada para reprovada nao faz parte do MVP.

### Niveis

- O nivel e calculado automaticamente a partir do XP total.
- Regra inicial sugerida:
  - Nivel 1: 0 a 99 XP.
  - Nivel 2: 100 a 249 XP.
  - Nivel 3: 250 a 499 XP.
  - Nivel 4: 500 a 799 XP.
  - Nivel 5: 800 XP ou mais.
- O nivel deve ser atualizado sempre que o aluno receber XP.

### Validacao

- Apenas professores podem avaliar entregas.
- Uma entrega pendente pode ser aprovada ou reprovada.
- Toda avaliacao registra professor responsavel, data, decisao e feedback.
- Entregas aprovadas saem da fila de pendentes.
- Entregas reprovadas aparecem para o aluno com feedback e possibilidade de reenvio.

## Criterios de Aceite

### Cadastro/Login

- Um aluno consegue se cadastrar, fazer login, acessar seu dashboard e fazer logout.
- Um professor consegue se cadastrar, fazer login, acessar seu dashboard e fazer logout.
- Usuario nao autenticado nao consegue acessar areas internas.

### Onboarding e Objetivo Real

- O aluno registra um objetivo real em texto livre.
- O objetivo aparece no dashboard do aluno.
- O aluno pode editar o objetivo.
- O sistema nao exige personalizacao automatica de missoes.

### Dashboard do Aluno

- O aluno visualiza objetivo ativo, XP total, nivel atual e missoes por status.
- O dashboard reflete mudancas apos envio, aprovacao ou reprovacao.
- O aluno consegue acessar a lista de missoes a partir do dashboard.

### Lista de Missoes

- O aluno consegue ver missoes disponiveis.
- O aluno consegue abrir uma missao e entender o que precisa entregar.
- O status da missao muda para enviada quando uma entrega e criada.

### Envio de Entrega

- O aluno consegue enviar uma entrega textual.
- A entrega aparece como pendente para o aluno.
- A entrega aparece na fila de validacao do professor.
- O aluno consegue reenviar uma missao reprovada.
- O aluno nao consegue reenviar uma missao ja aprovada.

### XP e Niveis

- Ao aprovar uma entrega, o XP da missao e somado ao total do aluno.
- O nivel do aluno e recalculado apos ganho de XP.
- A mesma missao nao concede XP duplicado para o mesmo aluno.

### Dashboard do Professor

- O professor visualiza totais de entregas pendentes, aprovadas e reprovadas.
- O professor consegue acessar a fila de validacao.
- O dashboard atualiza os totais apos uma avaliacao.

### Fila de Validacao

- Entregas pendentes aparecem na fila.
- O professor consegue abrir uma entrega e ver dados do aluno, missao e resposta.
- Entregas avaliadas deixam de aparecer como pendentes.

### Aprovacao/Reprovacao com Feedback

- O professor consegue aprovar uma entrega informando feedback.
- O professor consegue reprovar uma entrega informando feedback.
- O aluno consegue visualizar decisao e feedback.
- Entrega aprovada concede XP.
- Entrega reprovada libera reenvio.

## Riscos

- XP e niveis podem parecer simples demais se as missoes nao forem significativas.
- Professores podem sentir falta de rubricas para avaliar com consistencia.
- Sem turmas, a operacao do piloto precisa definir manualmente quem avaliara as entregas.
- Se o tempo de feedback for alto, alunos podem abandonar a jornada.
- Missoes mal escritas podem prejudicar a percepcao de valor do produto.
- A ausencia de certificados, portfolio e badges pode reduzir a sensacao externa de conquista.
- O objetivo real pode criar expectativa de personalizacao automatica se a interface prometer demais.

## Dependencias

- Definicao inicial das missoes usadas no MVP.
- Definicao da regra de XP por missao.
- Definicao da tabela de niveis.
- Modelo de dados para usuarios, objetivos, missoes, entregas, avaliacoes e XP.
- Politica minima de autenticacao e seguranca de senha.
- Interface minima para aluno e professor.
- Conteudo pedagogico inicial com instrucoes claras.
- Criterios editoriais para feedback do professor.
- Ambiente de hospedagem ou execucao para teste piloto.

