# Limites do MVP

## Objetivo

Este documento protege o MVP contra expansao indevida de escopo. A decisao padrao deve ser manter simplicidade ate que o fluxo central seja validado.

## Implementar Agora

- Cadastro e login.
- Perfis iniciais de aluno e professor.
- Onboarding simples do aluno.
- Registro de um objetivo real do aluno (`LearningGoal`).
- Dashboard do aluno.
- Lista de missoes publicadas.
- Tela de missao.
- Envio textual de entrega.
- Reenvio apos reprovacao.
- XP por entrega aprovada.
- Niveis calculados por XP.
- Progresso geral por missoes.
- Dashboard do professor.
- Fila de validacao.
- Detalhe da entrega.
- Aprovacao ou reprovacao com feedback textual obrigatorio.
- Seeds iniciais de curso, modulo, missoes e niveis.
- Deploy de homologacao ou piloto.

## Nao Implementar Agora

- App mobile nativo.
- Marketplace.
- Comunidade.
- Ranking.
- Streak.
- Certificados.
- Portfolio publico.
- IA avaliadora.
- Integracoes externas.
- Sistema de pagamento.
- Administrador.
- Multi tenant.
- Gamificacao avancada.
- Badges operacionais.
- Turmas com convite ou codigo.
- Biblioteca publica de missoes.
- Editor completo de cursos, modulos ou missoes.
- Rubricas configuraveis.
- Comentarios em thread.
- Anexos em entregas.
- Revisao entre pares.
- Relatorios avancados.
- Personalizacao automatica por IA.

## Regra de Decisao

Uma funcionalidade so entra no MVP se responder sim para todas as perguntas:

- Ela e necessaria para aluno enviar uma entrega?
- Ela e necessaria para professor validar com feedback?
- Ela e necessaria para XP, nivel ou progresso basico?
- Ela pode ser implementada sem criar gestao avancada, automacao complexa ou dependencia externa?

Se a resposta for nao, a funcionalidade deve ir para roadmap futuro.

