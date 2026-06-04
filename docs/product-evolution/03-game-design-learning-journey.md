# 03 - Game Design Learning Journey

## Loop principal

Loop atual reaproveitavel:

1. Aluno recebe uma missao.
2. Executa uma tarefa real com IA.
3. Envia uma entrega textual.
4. Professor valida.
5. Se aprovado, aluno ganha XP e progride.
6. Se reprovado, recebe feedback e tenta novamente.

Loop proposto:

1. Aluno desbloqueia uma missao no mapa.
2. Ve contexto narrativo, habilidade treinada, recompensa e criterio de aceite.
3. Usa IA para produzir algo concreto.
4. Registra a entrega e, quando fizer sentido, uma reflexao no diario.
5. Recebe validacao.
6. Ganha XP, badge/skill quando aplicavel e evolui o avatar.
7. Desbloqueia a proxima missao ou checkpoint.

## Niveis

Os niveis atuais em `database/seeds/0001_seed.sql` sao:

- Nivel 1: Explorador.
- Nivel 2: Aprendiz de Prompts.
- Nivel 3: Praticante de IA.
- Nivel 4: Construtor.
- Nivel 5: Autonomia com IA.

Para a nova visao, recomenda-se alinhar niveis/fases assim:

- Fase 1: Despertar.
- Fase 2: Explorador.
- Fase 3: Estrategista.
- Fase 4: Criador.
- Fase 5: Operador.
- Fase 6: Arquiteto de IA.
- Fase 7: Boss Final / TCC.

Decisao sugerida: manter `levels` como progressao numerica de XP e criar uma entidade separada para fases da jornada. Nivel e fase nao precisam ser a mesma coisa.

## XP

O XP atual ja funciona por aprovacao de missao via `review_submission`. Ele deve ser mantido como moeda principal de progresso.

Regras sugeridas:

- XP base por missao aprovada.
- XP bonus por primeira tentativa aprovada, quando desejado.
- XP bonus por completar uma fase.
- XP nao deve substituir avaliacao qualitativa.
- XP deve continuar sendo concedido de forma atomica no banco.

## Missoes

Missoes atuais sao definidas em `missions` e exibidas em:

- `src/app/aluno/missoes/page.tsx`;
- `src/app/aluno/missoes/[missionId]/page.tsx`;
- `src/app/professor/entregas/[submissionId]/page.tsx`.

Campos atuais uteis:

- `title`;
- `description`;
- `learning_objective`;
- `instructions`;
- `expected_submission`;
- `xp_reward`;
- `position`;
- `status`.

Campos futuros recomendados:

- `phase_id`;
- `skill_id`;
- `difficulty`;
- `estimated_minutes`;
- `unlock_rule`;
- `mission_type`;
- `acceptance_criteria`;
- `recommended_tools`;
- `is_boss_mission`.

## Badges

O banco ja possui `badges`, mas sem concessao operacional. Para virar produto:

- Criar tabela `student_badges`.
- Definir regras de concessao.
- Exibir badges no perfil e em celebracoes.
- Evitar badges cosmeticas demais; cada uma deve marcar uma habilidade ou marco real.

Exemplos:

- Primeira Missao Aprovada.
- Prompt com Contexto.
- Validador Critico.
- Criador de Prototipo.
- Operador de Terminal.
- Arquiteto de Agentes.
- Boss Final Concluido.

## Avatar

O avatar deve representar evolucao, nao apenas foto de perfil.

Opcoes:

- Curto prazo: avatar 2D/ilustrado com estado visual por nivel.
- Medio prazo: avatar GLB proprio/licenciado embutido no dashboard (sem Ready Player Me — descontinuado em 31/01/2026).
- Longo prazo: itens cosmeticos desbloqueados por badges/fases.

Locais de exibicao:

- Cockpit do aluno em `/aluno`.
- Perfil em `/aluno/perfil`.
- Celebracao de level up.
- Landing, como preview da fantasia de produto.

## Skill tree

A skill tree deve organizar habilidades de IA, nao apenas aulas.

Ramos sugeridos:

- Fundamentos de IA.
- Prompt e contexto.
- Pesquisa e validacao.
- Criacao e prototipagem.
- Terminal e ferramentas.
- Agentes e arquitetura.
- Produto e validacao.

Cada skill pode ser desbloqueada por uma ou mais missoes aprovadas.

## Diario de bordo

O diario registra evolucao metacognitiva do aluno:

- O que tentei?
- Qual prompt usei?
- O que funcionou?
- O que eu validaria antes de confiar?
- O que vou melhorar na proxima tentativa?

Implementacao futura:

- Tabela `journal_entries`.
- Associacao opcional com `mission_id`, `submission_id` e `phase_id`.
- Exibicao no perfil e no boss final como material de portfolio.

## Sistema de progresso

O progresso deve combinar:

- Porcentagem de missoes aprovadas.
- XP total.
- Nivel atual.
- Fase atual.
- Skills desbloqueadas.
- Badges conquistadas.
- Status do Boss Final.

Hoje, `src/server/student-data.ts` calcula status de missoes e progresso por XP. A evolucao deve evitar colocar toda a logica no componente; preferir funcoes de dominio/queries dedicadas.

## Boss Final / TCC

O Boss Final e a criacao de um produto com IA.

Estrutura sugerida:

- Problema escolhido.
- Publico-alvo.
- Solucao proposta.
- Fluxo do produto.
- Arquitetura simples.
- Prototipo.
- Validacao com criterio.
- Apresentacao final.

O Boss Final deve ser uma fase especial com varias missoes ou uma missao composta.

## Jornada de aprendizagem por fase

Despertar:

- Ensina o que e IA e como ela aparece no dia a dia.
- Desafio exemplo: criar uma playlist inteligente ou plano simples com IA.

Explorador:

- Ensina conversa com IA, prompts basicos, pesquisa e validacao.
- Desafio exemplo: comparar duas respostas e escolher a melhor com justificativa.

Estrategista:

- Ensina contexto, objetivo, formato, restricoes e criterios.
- Desafio exemplo: transformar um prompt ruim em prompt forte e avaliar diferenca.

Criador:

- Ensina pequenos projetos, organizacao de ideias, fluxos e documentacao.
- Desafio exemplo: criar um mini prototipo ou plano de app com IA.

Operador:

- Ensina uso de IA no terminal, VS Code, Codex/Claude e ferramentas especializadas.
- Desafio exemplo: usar uma ferramenta assistida para gerar/documentar uma pequena funcionalidade.

Arquiteto de IA:

- Ensina agentes, orquestracao, front-end, back-end, API, banco e produto.
- Desafio exemplo: desenhar uma arquitetura de agentes para resolver um problema.

Boss Final:

- Integra tudo em um produto com IA.
- Desafio exemplo: apresentar problema, solucao, arquitetura, prototipo e validacao.

