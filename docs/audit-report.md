# Audit Report

## Resumo Executivo

A documentacao do projeto **IA para Vida Real** descrevia corretamente a intencao geral do produto, mas misturava tres camadas: MVP, produto futuro e possibilidades de plataforma educacional. O principal risco encontrado era o MVP ser interpretado como um LMS tradicional, com turmas, certificados, portfolio publico, biblioteca de conteudos, rankings e administracao antes da validacao do fluxo central.

A fonte de verdade consolidada passa a ser `product/mvp-scope.md`. O MVP deve validar somente: cadastro/login, dashboard do aluno, objetivo real do aluno, lista de missoes, envio de entrega, XP, niveis, dashboard do professor, fila de validacao e aprovacao/reprovacao com feedback.

## Inconsistencias Encontradas

- `docs/mvp-vision.md` incluia badges, portfolio simples, turma, validador separado, rubricas e certificado como se fossem parte do MVP.
- `docs/05-jornada-do-aluno.md` trazia feedback automatico, badges, recomendacao de missoes, projeto aplicado, portfolio e certificacao dentro da jornada inicial.
- `docs/06-jornada-do-professor.md` tratava criacao de turma, convite, codigo, rubricas, anexos, relatorios e certificados como fluxo do professor.
- `docs/07-sistema-de-gamificacao.md` misturava XP e niveis do MVP com badges, streaks, rankings, recompensas, certificados e comunidade.
- `docs/08-modulos-principais.md` listava validador, administrador, turmas, biblioteca, portfolio, relatorios e administracao como modulos principais sem separar MVP de futuro.
- `product/10-roadmap-futuro.md` colocava painel de turma, portfolio e conquistas basicas na fase de MVP.
- `product/backlog.md` estava organizado por areas, mas nao na sequencia ideal de execucao solicitada.
- `database/data-model.md` continha `Badge` como entidade minima, mas sem deixar suficientemente forte que badges nao devem ser implementadas na experiencia do MVP.
- A proposta central de autonomia estava pouco refletida no modelo de dados. Faltava uma entidade para representar o objetivo real do aluno.

## Decisoes Recomendadas

- Manter `product/mvp-scope.md` como contrato principal do MVP.
- Adicionar `LearningGoal` ao modelo de dados para registrar o objetivo real do aluno.
- Nao criar `StudentProject` no MVP. Projetos aplicados pertencem a fases futuras.
- Manter `Badge` apenas como entidade de futura extensao documentada, sem uso operacional no MVP.
- Remover dependencias de turma, convite, certificado, portfolio publico e ranking dos fluxos de MVP.
- Reposicionar professor como avaliador humano simples, nao como gestor completo de turma.
- Tratar cursos e modulos como conteudo inicial fixo, nao como LMS completo.

## Riscos

- Escopo pode crescer se telas de professor forem confundidas com gestao de turma.
- `LearningGoal` pode induzir expectativa de personalizacao automatica se a UX nao for clara.
- Sem rubricas configuraveis, feedback pode variar muito entre professores.
- Sem certificados ou portfolio, parte do valor percebido pode depender fortemente da clareza do progresso.
- Consistencia de XP exige operacao atomica entre feedback, status da entrega e transacao de XP.

## Recomendacoes

- Implementar primeiro o fluxo completo mais simples: aluno envia, professor valida, aluno recebe feedback e XP.
- Usar missoes iniciais fixas e bem escritas.
- Manter gamificacao do MVP limitada a XP, niveis e progresso.
- Documentar explicitamente tudo que esta fora do MVP.
- Revisar qualquer nova funcionalidade contra os principios de produto antes de entrar no backlog.

