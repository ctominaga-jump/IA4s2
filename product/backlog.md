# Backlog Tecnico do MVP

## Visao Geral

Backlog tecnico para execucao do MVP do portal **IA para Vida Real**.

Fonte de verdade: `product/mvp-scope.md`.

Prioridades:

- **P0:** essencial para validar o fluxo principal.
- **P1:** importante para experiencia e operacao do piloto.
- **P2:** melhoria desejavel, pode ficar para depois.

## 1. Setup

### Historia 1.1: Inicializar projeto

**Descricao:** Como time tecnico, quero criar a base da aplicacao para desenvolver o MVP com velocidade e padrao minimo.

**Criterios de aceite:**

- Projeto Next.js com TypeScript inicializado.
- Estrutura base de pastas criada.
- Aplicacao roda localmente.
- README tecnico explica instalacao e execucao.

**Dependencias:** Nenhuma.

**Prioridade:** P0

**Tarefas tecnicas:**

- Inicializar projeto.
- Configurar Tailwind e componentes base.
- Configurar lint/formatacao.
- Criar estrutura para rotas publicas, aluno e professor.

### Historia 1.2: Layout e navegacao base

**Descricao:** Como usuario autenticado, quero navegar por uma estrutura simples e coerente com meu perfil.

**Criterios de aceite:**

- Layout publico e autenticado existem.
- Rotas de aluno e professor estao separadas.
- Navegacao respeita perfil.
- Pagina fallback existe para rotas invalidas.

**Dependencias:** Historia 1.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar layout base.
- Criar menu por perfil.
- Criar paginas placeholder.
- Criar fallback de erro/nao encontrado.

## 2. Banco

### Historia 2.1: Criar schema inicial

**Descricao:** Como time tecnico, quero persistir usuarios, perfis, objetivos, conteudo, entregas, feedback e gamificacao MVP.

**Criterios de aceite:**

- Tabelas seguem `database/data-model.md`.
- `LearningGoal` existe e se relaciona com `StudentProfile`.
- Chaves primarias e estrangeiras existem.
- Constraints de status e unicidade principais existem.

**Dependencias:** Historia 1.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar migracoes de `User`, `StudentProfile`, `TeacherProfile`.
- Criar migracao de `LearningGoal`.
- Criar migracoes de `Course`, `Module`, `Mission`.
- Criar migracoes de `Submission`, `Feedback`.
- Criar migracoes de `XPTransaction`, `Level`, `Badge`.
- Criar indices para e-mail, status, aluno, missao e entrega.

### Historia 2.2: Criar seeds iniciais

**Descricao:** Como produto, quero conteudo inicial para testar o ciclo completo sem editor administrativo.

**Criterios de aceite:**

- Niveis iniciais sao criados.
- Curso inicial publicado existe.
- Modulo inicial publicado existe.
- Missoes iniciais publicadas existem.
- Seeds sao idempotentes.

**Dependencias:** Historia 2.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar seed de niveis.
- Criar seed de curso e modulo.
- Criar seed de missoes.
- Garantir execucao repetivel.

## 3. Auth

### Historia 3.1: Cadastro

**Descricao:** Como novo usuario, quero criar conta como aluno ou professor.

**Criterios de aceite:**

- Usuario informa nome, e-mail, senha e perfil.
- E-mail duplicado e bloqueado.
- Senha e gerenciada com seguranca pelo Supabase Auth.
- Perfil correspondente e criado.
- Erros sao amigaveis.

**Dependencias:** Historias 1.1 e 2.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar tela de cadastro.
- Validar campos obrigatorios.
- Integrar Supabase Auth.
- Criar perfil de aluno ou professor.

### Historia 3.2: Login e logout

**Descricao:** Como usuario cadastrado, quero entrar e sair do portal.

**Criterios de aceite:**

- Login funciona com e-mail e senha.
- Credenciais invalidas mostram erro.
- Logout encerra sessao.
- Aluno vai para dashboard do aluno.
- Professor vai para dashboard do professor.

**Dependencias:** Historia 3.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar tela de login.
- Implementar sessao.
- Implementar logout.
- Criar redirecionamento por role.

### Historia 3.3: Protecao de rotas

**Descricao:** Como produto, quero impedir acesso indevido entre perfis.

**Criterios de aceite:**

- Usuario nao autenticado nao acessa areas internas.
- Aluno nao acessa area do professor.
- Professor nao acessa area exclusiva do aluno.
- Actions sensiveis validam role no servidor.

**Dependencias:** Historia 3.2.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar middleware/guards.
- Validar role em rotas.
- Validar role em actions.

## 4. Missoes

### Historia 4.1: Lista de missoes

**Descricao:** Como aluno, quero ver missoes disponiveis e seus status.

**Criterios de aceite:**

- Lista exibe titulo, descricao, XP e status.
- Missoes aparecem ordenadas.
- Status considera entregas do aluno.
- Aluno abre detalhe da missao.

**Dependencias:** Historias 2.2 e 3.3.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar tela de jornada/lista.
- Consultar missoes publicadas.
- Calcular status por aluno.
- Criar componente de item de missao.

### Historia 4.2: Detalhe da missao

**Descricao:** Como aluno, quero entender a missao antes de enviar minha entrega.

**Criterios de aceite:**

- Tela exibe titulo, descricao, objetivo, instrucoes, entrega esperada e XP.
- Tela mostra status atual.
- Feedback anterior aparece quando houver reprovacao.
- Botao principal muda conforme status.

**Dependencias:** Historia 4.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar pagina de detalhe.
- Buscar ultima entrega do aluno.
- Renderizar acoes por status.

## 5. Entregas

### Historia 5.1: Enviar entrega

**Descricao:** Como aluno, quero enviar resposta textual para uma missao.

**Criterios de aceite:**

- Texto e obrigatorio.
- Entrega nasce como `pending`.
- Data de envio e registrada.
- Entrega aparece na fila do professor.
- Aluno nao cria nova entrega se houver pendente.

**Dependencias:** Historias 4.2 e 3.3.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar formulario de envio.
- Criar action de `Submission`.
- Validar pendencia existente.
- Redirecionar com confirmacao.

### Historia 5.2: Reenviar entrega reprovada

**Descricao:** Como aluno, quero melhorar uma entrega reprovada e reenviar.

**Criterios de aceite:**

- Feedback anterior fica visivel.
- Nova tentativa recebe `attempt_number` correto.
- Nova tentativa entra como `pending`.
- Missao aprovada nao permite reenvio.

**Dependencias:** Historias 5.1 e 6.2.

**Prioridade:** P0

**Tarefas tecnicas:**

- Validar elegibilidade de reenvio.
- Calcular tentativa.
- Bloquear reenvio de aprovada.

## 6. Validacao

### Historia 6.1: Fila de validacao

**Descricao:** Como professor, quero ver entregas enviadas para revisar.

**Criterios de aceite:**

- Fila mostra aluno, missao, data, tentativa e status.
- Pendentes aparecem primeiro.
- Filtro por status existe.
- Professor abre detalhe da entrega.

**Dependencias:** Historias 5.1 e 3.3.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar tela da fila.
- Consultar entregas ordenadas.
- Implementar filtro.
- Criar link para detalhe.

### Historia 6.2: Aprovar/reprovar com feedback

**Descricao:** Como professor, quero avaliar entrega com feedback obrigatorio.

**Criterios de aceite:**

- Professor visualiza aluno, objetivo real, missao e resposta.
- Feedback e obrigatorio.
- Aprovar atualiza status para `approved`.
- Reprovar atualiza status para `rejected`.
- Aluno visualiza decisao e feedback.

**Dependencias:** Historia 6.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar detalhe da entrega.
- Criar formulario de feedback.
- Criar action de avaliacao.
- Registrar `reviewed_at`.

## 7. XP e Niveis

### Historia 7.1: Calcular niveis

**Descricao:** Como produto, quero calcular nivel do aluno por XP total.

**Criterios de aceite:**

- Faixas de nivel estao cadastradas.
- Nivel 1 inicia em 0 XP.
- Faixas nao se sobrepoem.
- Funcao retorna nivel correto para XP total.

**Dependencias:** Historia 2.2.

**Prioridade:** P0

**Tarefas tecnicas:**

- Implementar utilitario de nivel.
- Validar faixas.
- Criar consulta de nivel atual.

### Historia 7.2: Conceder XP em aprovacao

**Descricao:** Como aluno, quero ganhar XP quando uma entrega for aprovada.

**Criterios de aceite:**

- XP corresponde ao `xp_reward` da missao.
- `XPTransaction` e criada.
- `total_xp` e atualizado.
- Nivel e recalculado.
- Mesma missao nao concede XP duplicado.

**Dependencias:** Historias 6.2 e 7.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar servico de XP.
- Criar constraint contra duplicidade.
- Integrar aprovacao e XP em transacao.

### Historia 7.3: Exibir progresso

**Descricao:** Como aluno, quero ver XP, nivel e progresso ate o proximo nivel.

**Criterios de aceite:**

- Dashboard exibe XP e nivel.
- Perfil/gamificacao exibe progresso ate proximo nivel.
- Ultimo nivel e tratado corretamente.

**Dependencias:** Historia 7.2.

**Prioridade:** P1

**Tarefas tecnicas:**

- Criar componente de XP.
- Criar componente de nivel.
- Criar indicador de progresso.

## 8. Dashboard Aluno

### Historia 8.1: Onboarding e objetivo real

**Descricao:** Como aluno, quero registrar um objetivo real para contextualizar minha jornada.

**Criterios de aceite:**

- Aluno informa titulo do objetivo.
- Categoria opcional pode ser salva.
- Objetivo fica ativo.
- Objetivo aparece no dashboard.
- Nao ha promessa de personalizacao automatica.

**Dependencias:** Historias 2.1 e 3.2.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar tela de onboarding.
- Criar action de `LearningGoal`.
- Atualizar `active_learning_goal_id`.
- Criar edicao simples do objetivo.

### Historia 8.2: Dashboard do aluno

**Descricao:** Como aluno, quero ver objetivo, missoes, feedback, XP e nivel.

**Criterios de aceite:**

- Dashboard exibe objetivo real ativo.
- Dashboard exibe XP e nivel.
- Dashboard exibe resumo por status de missao.
- Dashboard aponta proxima acao.
- Estados vazios orientam comecar.

**Dependencias:** Historias 4.1, 5.1, 7.3 e 8.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar pagina do dashboard.
- Criar consultas agregadas.
- Exibir ultimos feedbacks.
- Implementar estados vazios.

## 9. Dashboard Professor

### Historia 9.1: Dashboard do professor

**Descricao:** Como professor, quero ver resumo das entregas e acessar a fila.

**Criterios de aceite:**

- Dashboard exibe pendentes, aprovadas e reprovadas.
- Lista entregas recentes.
- Link para fila existe.
- Estado vazio e claro.

**Dependencias:** Historias 6.1 e 6.2.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar pagina do professor.
- Criar agregacoes de entregas.
- Criar lista de recentes.

## 10. QA

### Historia 10.1: Testar fluxo principal

**Descricao:** Como time, quero validar o ciclo completo antes do piloto.

**Criterios de aceite:**

- Aluno cadastra, registra objetivo, envia entrega.
- Professor aprova e XP e concedido.
- Professor reprova e aluno consegue reenviar.
- Rotas indevidas sao bloqueadas.

**Dependencias:** Historias 1 a 9.

**Prioridade:** P0

**Tarefas tecnicas:**

- Criar roteiro de QA manual.
- Testar fluxo feliz.
- Testar reprovacao e reenvio.
- Testar autorizacao.
- Testar duplicidade de XP.

### Historia 10.2: Corrigir bugs criticos

**Descricao:** Como time, quero eliminar falhas que impedem o piloto.

**Criterios de aceite:**

- Bugs P0 corrigidos.
- Fluxo principal executa ponta a ponta.
- Erros conhecidos documentados.

**Dependencias:** Historia 10.1.

**Prioridade:** P0

**Tarefas tecnicas:**

- Triar bugs.
- Corrigir falhas bloqueantes.
- Reexecutar roteiro.

## 11. Deploy

### Historia 11.1: Publicar homologacao

**Descricao:** Como time, quero disponibilizar o MVP em URL acessivel para piloto.

**Criterios de aceite:**

- Aplicacao publicada.
- Variaveis de ambiente configuradas.
- Banco conectado.
- Migracoes e seeds executados.
- Build de producao sem erro.

**Dependencias:** Historia 10.2.

**Prioridade:** P0

**Tarefas tecnicas:**

- Configurar Vercel.
- Configurar Supabase.
- Definir variaveis.
- Executar migracoes e seeds.
- Validar URL publicada.

### Historia 11.2: Observabilidade minima

**Descricao:** Como time, quero investigar erros do piloto.

**Criterios de aceite:**

- Logs de aplicacao estao acessiveis.
- Falhas de login, envio e validacao podem ser investigadas.
- Logs nao expoem senhas nem dados sensiveis.

**Dependencias:** Historia 11.1.

**Prioridade:** P1

**Tarefas tecnicas:**

- Configurar logs do ambiente.
- Registrar erros de fluxos criticos.
- Definir cuidado com dados sensiveis.
