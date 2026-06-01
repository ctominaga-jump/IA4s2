# Plano de Execucao

## Fase 0: Refinamento Documental

### Objetivo

Consolidar escopo, limites, modelo de dados, backlog e agentes antes da implementacao.

### Entregaveis

- `docs/audit-report.md`
- `docs/mvp-boundaries.md`
- `docs/product-principles.md`
- `docs/future-vision.md`
- `product/backlog.md`
- `database/data-model.md`
- agentes em `prompts/agents/`

### Criterios de Aceite

- MVP tem fonte de verdade.
- Funcionalidades futuras estao separadas.
- Backlog segue ordem de execucao.
- Modelo inclui `LearningGoal`.

### Riscos

- Documentos voltarem a misturar MVP e futuro.

## Fase 1: Setup Tecnico

### Objetivo

Criar a base tecnica da aplicacao.

### Entregaveis

- Projeto Next.js configurado.
- Tailwind e componentes base.
- Estrutura de rotas.
- README tecnico.

### Criterios de Aceite

- Aplicacao roda localmente.
- Rotas base existem.
- Layout inicial funciona.

### Riscos

- Overengineering antes do fluxo principal.

## Fase 2: Implementacao do Nucleo

### Objetivo

Implementar banco, autenticacao, objetivos, missoes e entregas.

### Entregaveis

- Schema e seeds.
- Cadastro/login/logout.
- Onboarding com objetivo real.
- Lista e detalhe de missoes.
- Envio e reenvio de entregas.

### Criterios de Aceite

- Aluno cria conta, registra objetivo e envia entrega.
- Entrega pendente aparece para professor.
- Reenvio so ocorre apos reprovacao.

### Riscos

- Falhas de autorizacao.
- Modelo de objetivo ser confundido com personalizacao automatica.

## Fase 3: Gamificacao MVP

### Objetivo

Adicionar XP, niveis e progresso.

### Entregaveis

- Seeds de niveis.
- Calculo de nivel.
- `XPTransaction`.
- Indicadores de XP, nivel e progresso.

### Criterios de Aceite

- Aprovacao concede XP.
- XP nao duplica por missao.
- Nivel atualiza corretamente.

### Riscos

- Inconsistencia entre feedback, status e XP.

## Fase 4: Professor e Validacao

### Objetivo

Implementar dashboard do professor, fila e feedback.

### Entregaveis

- Dashboard do professor.
- Fila de validacao.
- Detalhe da entrega.
- Aprovacao/reprovacao com feedback.

### Criterios de Aceite

- Professor avalia entrega pendente.
- Feedback e obrigatorio.
- Aluno ve decisao e feedback.

### Riscos

- Professor precisar de funcionalidades futuras, como turma ou rubrica, antes do piloto.

## Fase 5: QA

### Objetivo

Validar o MVP ponta a ponta.

### Entregaveis

- Roteiro de QA.
- Relatorio de bugs.
- Correcoes bloqueantes.
- Evidencias de teste.

### Criterios de Aceite

- Fluxo feliz passa.
- Reprovacao e reenvio passam.
- Rotas por perfil passam.
- XP duplicado e bloqueado.

### Riscos

- Bugs de estado em reenvios.
- Bugs de permissao em actions.

## Fase 6: Deploy

### Objetivo

Publicar o MVP para piloto.

### Entregaveis

- Ambiente Vercel.
- Banco Supabase.
- Variaveis configuradas.
- Migracoes e seeds executados.
- URL de homologacao.

### Criterios de Aceite

- Build passa.
- Aplicacao publicada.
- Fluxo principal funciona em ambiente publicado.
- Logs minimos estao acessiveis.

### Riscos

- Variaveis incorretas.
- Diferenca entre ambiente local e publicado.

