# Especificacao de Telas do MVP

## 1. Login

### Objetivo

Permitir que alunos e professores acessem o portal com seguranca e sejam direcionados para a area correta conforme seu perfil.

### Componentes

- Logo ou nome do portal.
- Campo de e-mail.
- Campo de senha.
- Botao de entrar.
- Link para cadastro.
- Mensagem de erro.
- Indicador de carregamento durante autenticacao.

### Dados Exibidos

- Nome do portal: IA para Vida Real.
- Mensagens de validacao de campos.
- Mensagem de credenciais invalidas.

### Acoes Disponiveis

- Informar e-mail.
- Informar senha.
- Entrar.
- Ir para cadastro.

### Estados Vazios

- Campos vazios ao abrir a tela.
- Mensagem orientando preenchimento quando o usuario tenta entrar sem dados obrigatorios.

### Regras de UX

- A tela deve ser simples e direta.
- O botao de entrar deve ficar desabilitado ou retornar validacao clara quando houver campos obrigatorios vazios.
- Erros devem explicar o problema sem expor detalhes tecnicos.
- Apos login, aluno deve ir para dashboard do aluno e professor para dashboard do professor.

## 2. Onboarding do Aluno

### Objetivo

Apresentar rapidamente a dinamica do portal e registrar um objetivo real do aluno para orientar a primeira experiencia.

### Componentes

- Boas-vindas.
- Explicacao breve sobre missoes, entregas, feedback, XP e niveis.
- Campo de objetivo real.
- Campo opcional de descricao do objetivo.
- Selecao opcional de categoria do objetivo.
- Selecao de nivel inicial declarado.
- Botao de continuar.
- Indicador de progresso do onboarding.

### Dados Exibidos

- Nome do aluno.
- Exemplos de objetivos: aprender ingles, criar um site, conseguir emprego, passar em uma prova, abrir um negocio.
- Nivel inicial declarado: iniciante, basico, intermediario.

### Acoes Disponiveis

- Escrever objetivo real.
- Escolher categoria do objetivo, se disponivel.
- Informar nivel percebido.
- Concluir onboarding.

### Estados Vazios

- Objetivo vazio.
- Nenhum nivel selecionado.
- Primeira entrada de aluno sem configuracao inicial.

### Regras de UX

- O onboarding deve ser curto, com no maximo poucos passos.
- A linguagem deve reduzir ansiedade e deixar claro que nao e necessario saber IA para comecar.
- O aluno deve sair do onboarding com uma proxima acao clara.
- O objetivo real deve aparecer como contexto, mas o MVP nao deve prometer trilha personalizada automaticamente.

## 3. Dashboard do Aluno

### Objetivo

Dar ao aluno uma visao clara do seu progresso, proximas missoes e retorno das entregas avaliadas.

### Componentes

- Saudacao com nome do aluno.
- Destaque do objetivo real ativo.
- Card de XP total.
- Card de nivel atual.
- Barra de progresso geral.
- Resumo de missoes por status.
- Lista de proximas missoes.
- Lista de entregas recentes.
- Atalho para jornada.
- Atalho para perfil/gamificacao.

### Dados Exibidos

- Nome do aluno.
- Objetivo real ativo.
- XP total.
- Nivel atual.
- Quantidade de missoes nao iniciadas, enviadas, aprovadas e reprovadas.
- Ultimos feedbacks recebidos.
- Missoes recomendadas ou proximas missoes disponiveis.

### Acoes Disponiveis

- Abrir uma missao.
- Editar objetivo real.
- Ver jornada completa.
- Ver feedback recebido.
- Acessar perfil/gamificacao.
- Reenviar entrega reprovada.

### Estados Vazios

- Aluno sem missoes iniciadas.
- Aluno sem objetivo real.
- Aluno sem feedback recebido.
- Aluno sem XP.
- Nenhuma missao disponivel.

### Regras de UX

- A proxima acao deve ser sempre visivel.
- O objetivo real deve lembrar ao aluno que o produto serve para resolver algo concreto.
- Missoes reprovadas com feedback devem ter destaque suficiente para incentivar melhoria.
- XP e nivel devem ser motivadores, mas nao devem ocupar mais espaco que a jornada de aprendizagem.
- Estados vazios devem orientar o aluno para comecar uma missao.

## 4. Tela da Jornada

### Objetivo

Mostrar a sequencia de missoes do MVP e o progresso do aluno em cada etapa.

### Componentes

- Titulo da jornada.
- Descricao curta da jornada.
- Objetivo real ativo do aluno.
- Lista ou linha de progresso com missoes.
- Indicador de status por missao.
- Percentual ou barra de conclusao.
- Filtro simples por status, se necessario.

### Dados Exibidos

- Nome da jornada.
- Objetivo real ativo.
- Total de missoes.
- Missoes concluidas.
- Status de cada missao.
- XP de cada missao.
- Feedback pendente ou recebido quando houver.

### Acoes Disponiveis

- Abrir missao.
- Continuar de onde parou.
- Reenviar missao reprovada.
- Voltar para dashboard.

### Estados Vazios

- Jornada sem missoes cadastradas.
- Aluno sem progresso iniciado.

### Regras de UX

- A jornada deve parecer progressiva e facil de entender.
- Status devem ser distinguiveis visualmente.
- O aluno deve conseguir identificar rapidamente a proxima missao.
- Missoes aprovadas devem transmitir sensacao de conquista.

## 5. Tela de Missao

### Objetivo

Apresentar uma missao com contexto, instrucoes e criterio suficiente para o aluno produzir uma entrega.

### Componentes

- Titulo da missao.
- Descricao.
- Objetivo de aprendizagem.
- Lembrete do objetivo real do aluno, quando util.
- Instrucoes.
- Entrega esperada.
- Valor de XP.
- Status da missao.
- Area de feedback, quando existir.
- Botao para enviar entrega ou reenviar.

### Dados Exibidos

- Titulo.
- Descricao.
- Objetivo.
- Instrucoes.
- XP concedido na aprovacao.
- Status atual.
- Historico simples da ultima entrega.
- Feedback do professor, se houver.

### Acoes Disponiveis

- Iniciar envio.
- Reenviar, se a entrega foi reprovada.
- Voltar para jornada.
- Voltar para dashboard.

### Estados Vazios

- Missao ainda nao iniciada.
- Missao sem feedback.
- Missao sem entrega enviada.

### Regras de UX

- A instrucao deve ser clara o bastante para o aluno saber exatamente o que entregar.
- O botao principal deve mudar conforme o status: enviar, aguardando validacao, reenviar ou concluida.
- Quando a missao estiver aprovada, a tela deve evitar novo envio.
- Feedback de reprovacao deve aparecer perto da acao de reenvio.

## 6. Envio de Entrega

### Objetivo

Permitir que o aluno envie uma resposta textual para avaliacao do professor.

### Componentes

- Resumo da missao.
- Campo de texto para entrega.
- Orientacao sobre o que deve ser enviado.
- Botao de enviar.
- Botao de cancelar ou voltar.
- Confirmacao de envio.
- Mensagens de validacao.

### Dados Exibidos

- Titulo da missao.
- Entrega esperada.
- Status atual.
- Feedback anterior, em caso de reenvio.

### Acoes Disponiveis

- Escrever entrega.
- Enviar entrega.
- Cancelar envio.
- Voltar para missao.

### Estados Vazios

- Campo de entrega vazio.
- Reenvio sem nova resposta escrita.

### Regras de UX

- O envio deve exigir texto preenchido.
- Apos enviar, o aluno deve receber confirmacao clara de que a entrega esta aguardando validacao.
- Em reenvios, o feedback anterior deve ficar visivel para orientar melhoria.
- A tela deve evitar perda acidental do texto digitado.

## 7. Perfil/Gamificacao

### Objetivo

Mostrar ao aluno sua evolucao de forma motivadora e simples.

### Componentes

- Dados basicos do perfil.
- Objetivo real ativo.
- XP total.
- Nivel atual.
- Progresso ate o proximo nivel.
- Lista de missoes aprovadas.
- Lista de missoes pendentes ou reprovadas.

### Dados Exibidos

- Nome do aluno.
- E-mail.
- Objetivo real ativo.
- XP total.
- Nivel atual.
- XP necessario para proximo nivel.
- Quantidade de missoes aprovadas.
- Historico resumido de conquistas do MVP.

### Acoes Disponiveis

- Voltar para dashboard.
- Abrir missao aprovada.
- Abrir missao pendente ou reprovada.
- Editar objetivo real.
- Fazer logout.

### Estados Vazios

- Aluno sem XP.
- Aluno sem objetivo real.
- Aluno sem missoes aprovadas.
- Aluno no nivel inicial.

### Regras de UX

- A tela deve reforcar progresso sem parecer um relatorio frio.
- O nivel deve ser explicado de forma simples.
- Quando nao houver XP, a tela deve apontar para a primeira missao.
- Nao incluir badges, ranking ou certificados no MVP.

## 8. Dashboard do Professor

### Objetivo

Dar ao professor uma visao operacional das entregas e facilitar acesso rapido a validacao.

### Componentes

- Saudacao com nome do professor.
- Card de entregas pendentes.
- Card de entregas aprovadas.
- Card de entregas reprovadas.
- Lista de entregas recentes.
- Atalho para fila de validacao.

### Dados Exibidos

- Nome do professor.
- Total de entregas pendentes.
- Total de entregas aprovadas.
- Total de entregas reprovadas.
- Aluno, missao, status e data das entregas recentes.

### Acoes Disponiveis

- Abrir fila de validacao.
- Abrir detalhe de entrega.
- Filtrar entregas por status, se disponivel.
- Fazer logout.

### Estados Vazios

- Nenhuma entrega pendente.
- Nenhuma entrega avaliada.
- Nenhum aluno com envio.

### Regras de UX

- O professor deve entender rapidamente onde ha trabalho pendente.
- Entregas pendentes devem ter maior destaque.
- A tela deve ser objetiva e voltada para acao.
- Indicadores devem refletir atualizacoes apos cada avaliacao.

## 9. Fila de Validacao

### Objetivo

Organizar as entregas dos alunos para revisao do professor.

### Componentes

- Lista de entregas.
- Filtros por status.
- Ordenacao por data de envio.
- Busca simples por aluno ou missao, se necessario.
- Indicador de quantidade pendente.
- Link para detalhe da entrega.

### Dados Exibidos

- Nome do aluno.
- Titulo da missao.
- Data de envio.
- Status da entrega.
- Indicio de reenvio, quando aplicavel.

### Acoes Disponiveis

- Abrir detalhe da entrega.
- Filtrar por pendente, aprovada ou reprovada.
- Voltar para dashboard do professor.

### Estados Vazios

- Nenhuma entrega pendente.
- Nenhuma entrega no filtro selecionado.

### Regras de UX

- A fila deve priorizar entregas pendentes.
- A informacao essencial deve ser escaneavel.
- O professor deve conseguir ir da lista ao detalhe com um clique.
- Estados vazios devem confirmar que nao ha trabalho pendente.

## 10. Detalhe da Entrega

### Objetivo

Permitir que o professor revise uma entrega com contexto suficiente para aprovar ou reprovar com feedback.

### Componentes

- Dados do aluno.
- Objetivo real do aluno.
- Dados da missao.
- Resposta enviada.
- Historico simples de tentativas, se houver.
- Feedback anterior, se houver.
- Acoes de aprovar ou reprovar.
- Campo de feedback.

### Dados Exibidos

- Nome do aluno.
- Objetivo real ativo do aluno.
- Titulo da missao.
- Objetivo da missao.
- Instrucoes da missao.
- XP da missao.
- Texto enviado pelo aluno.
- Data de envio.
- Status atual.
- Tentativas anteriores, quando existirem.

### Acoes Disponiveis

- Escrever feedback.
- Aprovar entrega.
- Reprovar entrega.
- Voltar para fila.

### Estados Vazios

- Entrega sem texto, se ocorrer erro de envio.
- Nenhum feedback anterior.
- Nenhuma tentativa anterior.

### Regras de UX

- A resposta do aluno deve ser o elemento central da tela.
- O contexto da missao deve ficar visivel para evitar avaliacao fora do criterio.
- A aprovacao e reprovacao devem exigir feedback.
- A tela deve deixar claro quando a entrega ja foi avaliada.

## 11. Feedback do Professor

### Objetivo

Registrar a decisao do professor e comunicar ao aluno o resultado da avaliacao.

### Componentes

- Identificacao da entrega.
- Escolha de decisao: aprovar ou reprovar.
- Campo de feedback.
- Resumo do impacto da decisao.
- Botao de confirmar.
- Botao de cancelar.

### Dados Exibidos

- Nome do aluno.
- Titulo da missao.
- Status atual.
- XP que sera concedido em caso de aprovacao.
- Texto do feedback.

### Acoes Disponiveis

- Selecionar aprovacao.
- Selecionar reprovacao.
- Escrever feedback.
- Confirmar avaliacao.
- Cancelar e voltar ao detalhe.

### Estados Vazios

- Nenhuma decisao selecionada.
- Campo de feedback vazio.

### Regras de UX

- Feedback e obrigatorio para aprovar ou reprovar.
- Antes de confirmar, a tela deve deixar claro o efeito da decisao.
- Em aprovacao, informar que o aluno recebera XP.
- Em reprovacao, informar que o aluno podera reenviar.
- O texto do feedback deve incentivar melhoria e ser compreensivel para iniciantes.
