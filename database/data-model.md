# Modelo de Dados do MVP

## Visao Geral

Este documento define o modelo de dados inicial do portal **IA para Vida Real** para o MVP.

O foco do modelo e sustentar:

- Cadastro e login.
- Perfis de aluno e professor.
- Cursos, modulos e missoes.
- Objetivo real do aluno.
- Envio de entregas.
- Feedback de professor.
- XP, niveis e historico de pontuacao.
- Estrutura futura para badges, sem uso operacional no MVP.

## Convencoes

- IDs usam tipo `UUID`.
- Datas usam `datetime`.
- Textos curtos usam `string`.
- Textos longos usam `text`.
- Valores controlados usam `enum`.
- Campos `created_at` e `updated_at` devem existir nas entidades principais.
- Soft delete pode ser adicionado no futuro, mas nao e obrigatorio no MVP.

## Entidades

## User

Representa o perfil de aplicacao associado a uma conta autenticada no Supabase Auth.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do usuario. |
| auth_user_id | UUID | Sim | Identificador do usuario no provedor de autenticacao. |
| name | string | Sim | Nome exibido no portal. |
| email | string | Sim | E-mail usado para login. |
| role | enum | Sim | Perfil principal: `student` ou `teacher`. |
| status | enum | Sim | Estado da conta: `active`, `inactive`. |
| last_login_at | datetime | Nao | Data do ultimo login. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Um `User` com role `student` possui um `StudentProfile`.
- Um `User` com role `teacher` possui um `TeacherProfile`.
- Um `User` aluno pode ter muitas `Submission`.

### Regras de Negocio

- `email` deve ser unico.
- `auth_user_id` deve ser unico.
- Todo usuario deve ter exatamente um `role` inicial.
- Usuarios inativos nao podem acessar areas internas.
- Senhas nao devem ser armazenadas na tabela `User`; autenticacao e responsabilidade do Supabase Auth.

### Exemplo

```json
{
  "id": "6a3f7d1b-83cb-4b7b-9d30-1f38f46f5c3a",
  "auth_user_id": "6a3f7d1b-83cb-4b7b-9d30-1f38f46f5c3a",
  "name": "Ana Souza",
  "email": "ana@example.com",
  "role": "student",
  "status": "active",
  "last_login_at": "2026-05-29T12:30:00Z",
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## StudentProfile

Representa dados especificos do aluno.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do perfil. |
| user_id | UUID | Sim | Referencia ao usuario. |
| declared_level | enum | Nao | Nivel declarado: `beginner`, `basic`, `intermediate`. |
| total_xp | integer | Sim | XP acumulado do aluno. |
| current_level_id | UUID | Nao | Nivel atual calculado pelo XP. |
| active_learning_goal_id | UUID | Nao | Objetivo real ativo do aluno. |
| onboarding_completed_at | datetime | Nao | Data de conclusao do onboarding. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a um `User`.
- Pode referenciar um `Level`.
- Pode referenciar um `LearningGoal` ativo.
- Possui muitos `LearningGoal`.
- Possui muitas `Submission`.
- Possui muitas `XPTransaction`.

### Regras de Negocio

- Cada usuario aluno deve ter apenas um `StudentProfile`.
- `total_xp` inicia em `0`.
- `current_level_id` deve ser recalculado quando o aluno recebe XP.
- O MVP deve considerar apenas um `LearningGoal` ativo por aluno.
- Apenas usuarios com role `student` podem ter `StudentProfile`.

### Exemplo

```json
{
  "id": "b5737dfa-5ef7-44d6-a730-2d38a3afdf58",
  "user_id": "6a3f7d1b-83cb-4b7b-9d30-1f38f46f5c3a",
  "declared_level": "beginner",
  "total_xp": 120,
  "current_level_id": "0ec1b29e-d01d-4e42-85ae-bb6472a3b2b2",
  "active_learning_goal_id": "4975eb7a-a5cf-4d2d-8d2f-f377f69d5224",
  "onboarding_completed_at": "2026-05-29T12:10:00Z",
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T13:00:00Z"
}
```

## LearningGoal

Representa um objetivo real declarado pelo aluno. Esta entidade sustenta a proposta de autonomia do produto sem exigir personalizacao automatica no MVP.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do objetivo. |
| student_profile_id | UUID | Sim | Aluno dono do objetivo. |
| title | string | Sim | Nome curto do objetivo. |
| description | text | Nao | Detalhe opcional do objetivo. |
| category | enum | Nao | Categoria: `study`, `career`, `business`, `creation`, `productivity`, `personal`, `other`. |
| status | enum | Sim | Estado: `active`, `paused`, `completed`, `archived`. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a um `StudentProfile`.
- Pode ser referenciado como objetivo ativo em `StudentProfile.active_learning_goal_id`.

### Regras de Negocio

- Todo aluno deve poder criar pelo menos um objetivo real.
- No MVP, apenas um objetivo deve estar ativo por aluno.
- O objetivo ativo aparece no dashboard do aluno e pode aparecer no detalhe da entrega para o professor.
- O objetivo nao gera missoes personalizadas automaticamente no MVP.
- `title` e obrigatorio e deve ser escrito em linguagem do aluno.

### Exemplo

```json
{
  "id": "4975eb7a-a5cf-4d2d-8d2f-f377f69d5224",
  "student_profile_id": "b5737dfa-5ef7-44d6-a730-2d38a3afdf58",
  "title": "Passar em uma prova de matematica",
  "description": "Quero usar IA para organizar revisao, praticar exercicios e corrigir erros.",
  "category": "study",
  "status": "active",
  "created_at": "2026-05-29T12:10:00Z",
  "updated_at": "2026-05-29T12:10:00Z"
}
```

## TeacherProfile

Representa dados especificos do professor.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do perfil. |
| user_id | UUID | Sim | Referencia ao usuario. |
| bio | text | Nao | Breve apresentacao do professor. |
| area | string | Nao | Area de atuacao. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a um `User`.
- Pode criar ou ser responsavel por muitos `Course`.
- Pode emitir muitos `Feedback`.

### Regras de Negocio

- Cada usuario professor deve ter apenas um `TeacherProfile`.
- Apenas usuarios com role `teacher` podem ter `TeacherProfile`.

### Exemplo

```json
{
  "id": "9db26c45-86fa-4700-ae0e-e24eb4e64eba",
  "user_id": "0831242f-58e7-4ec7-8075-364e2f8c9407",
  "bio": "Professora de tecnologia e inovacao.",
  "area": "Educacao Digital",
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Course

Representa uma jornada ou curso do MVP.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do curso. |
| title | string | Sim | Titulo do curso. |
| description | text | Sim | Descricao do curso. |
| status | enum | Sim | Estado: `draft`, `published`, `archived`. |
| teacher_profile_id | UUID | Nao | Professor responsavel. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Um `Course` possui muitos `Module`.
- Pode pertencer a um `TeacherProfile`.

### Regras de Negocio

- Apenas cursos `published` aparecem para alunos.
- Um curso deve ter pelo menos um modulo para ser publicado.

### Exemplo

```json
{
  "id": "b77fc39f-557c-4f50-9df0-5e19a6859fdc",
  "title": "Primeiros Passos com IA",
  "description": "Jornada inicial para aprender IA aplicada em tarefas simples.",
  "status": "published",
  "teacher_profile_id": "9db26c45-86fa-4700-ae0e-e24eb4e64eba",
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Module

Agrupa missoes dentro de um curso.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do modulo. |
| course_id | UUID | Sim | Curso ao qual pertence. |
| title | string | Sim | Titulo do modulo. |
| description | text | Nao | Descricao curta. |
| position | integer | Sim | Ordem do modulo no curso. |
| status | enum | Sim | Estado: `draft`, `published`, `archived`. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a um `Course`.
- Possui muitas `Mission`.

### Regras de Negocio

- `position` define a ordem de exibicao.
- Modulos `draft` nao aparecem para alunos.
- Um modulo publicado deve pertencer a um curso publicado para aparecer ao aluno.

### Exemplo

```json
{
  "id": "de58ee10-d6a7-4ed9-a1ae-f4eaad9b2144",
  "course_id": "b77fc39f-557c-4f50-9df0-5e19a6859fdc",
  "title": "Comecando com Prompts",
  "description": "Atividades para entender como pedir melhor para a IA.",
  "position": 1,
  "status": "published",
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Mission

Representa uma atividade pratica que o aluno deve concluir.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico da missao. |
| module_id | UUID | Sim | Modulo ao qual pertence. |
| title | string | Sim | Titulo da missao. |
| description | text | Sim | Contexto da missao. |
| learning_objective | text | Sim | Objetivo de aprendizagem. |
| instructions | text | Sim | Instrucoes para o aluno. |
| expected_submission | text | Sim | O que o aluno deve entregar. |
| xp_reward | integer | Sim | XP concedido na aprovacao. |
| position | integer | Sim | Ordem da missao no modulo. |
| status | enum | Sim | Estado: `draft`, `published`, `archived`. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a um `Module`.
- Possui muitas `Submission`.
- Pode gerar muitas `XPTransaction`.

### Regras de Negocio

- Apenas missoes `published` aparecem para alunos.
- `xp_reward` deve ser maior que zero.
- Uma missao aprovada concede XP apenas uma vez por aluno.
- Uma missao deve ter instrucoes suficientes para orientar a entrega textual.

### Exemplo

```json
{
  "id": "af8cc633-5716-4929-9493-ee1cf358c619",
  "module_id": "de58ee10-d6a7-4ed9-a1ae-f4eaad9b2144",
  "title": "Crie um prompt claro",
  "description": "Use IA para apoiar uma tarefa real de estudo ou trabalho.",
  "learning_objective": "Aprender a formular pedidos especificos para uma ferramenta de IA.",
  "instructions": "Escolha uma tarefa real e escreva um prompt com contexto, objetivo e formato esperado.",
  "expected_submission": "Envie o prompt criado e explique em uma frase por que ele esta claro.",
  "xp_reward": 50,
  "position": 1,
  "status": "published",
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Submission

Representa uma entrega textual de aluno para uma missao.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico da entrega. |
| student_profile_id | UUID | Sim | Aluno responsavel. |
| mission_id | UUID | Sim | Missao entregue. |
| content | text | Sim | Texto enviado pelo aluno. |
| status | enum | Sim | Estado: `pending`, `approved`, `rejected`. |
| attempt_number | integer | Sim | Numero da tentativa do aluno na missao. |
| submitted_at | datetime | Sim | Data de envio. |
| reviewed_at | datetime | Nao | Data de avaliacao. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a um `StudentProfile`.
- Pertence a uma `Mission`.
- Pode ter um `Feedback`.
- Pode gerar uma `XPTransaction` quando aprovada.

### Regras de Negocio

- Toda entrega nova inicia com status `pending`.
- Um aluno nao pode ter duas entregas pendentes para a mesma missao.
- Uma missao ja aprovada para um aluno nao pode receber nova entrega no MVP.
- `attempt_number` deve aumentar a cada reenvio.
- `content` e obrigatorio.

### Exemplo

```json
{
  "id": "c92aa413-5b7a-4b15-8366-674da7289bc0",
  "student_profile_id": "b5737dfa-5ef7-44d6-a730-2d38a3afdf58",
  "mission_id": "af8cc633-5716-4929-9493-ee1cf358c619",
  "content": "Prompt: aja como tutor de estudos e me ajude a criar um plano de revisao para matematica...",
  "status": "pending",
  "attempt_number": 1,
  "submitted_at": "2026-05-29T13:00:00Z",
  "reviewed_at": null,
  "created_at": "2026-05-29T13:00:00Z",
  "updated_at": "2026-05-29T13:00:00Z"
}
```

## Feedback

Representa a avaliacao feita pelo professor sobre uma entrega.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do feedback. |
| submission_id | UUID | Sim | Entrega avaliada. |
| teacher_profile_id | UUID | Sim | Professor responsavel. |
| decision | enum | Sim | Decisao: `approved`, `rejected`. |
| comment | text | Sim | Feedback textual. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pertence a uma `Submission`.
- Pertence a um `TeacherProfile`.

### Regras de Negocio

- Feedback e obrigatorio para aprovar ou reprovar.
- `decision` deve atualizar o status da `Submission`.
- Uma entrega deve ter no maximo um feedback final no MVP.
- Se `decision` for `approved`, o sistema deve gerar XP quando aplicavel.
- Se `decision` for `rejected`, o aluno pode reenviar a missao.

### Exemplo

```json
{
  "id": "5186475e-4874-4486-98a0-168d7dc38c6f",
  "submission_id": "c92aa413-5b7a-4b15-8366-674da7289bc0",
  "teacher_profile_id": "9db26c45-86fa-4700-ae0e-e24eb4e64eba",
  "decision": "approved",
  "comment": "Bom prompt. Ele tem contexto, objetivo e formato esperado. Na proxima missao, tente incluir criterios de qualidade.",
  "created_at": "2026-05-29T14:00:00Z",
  "updated_at": "2026-05-29T14:00:00Z"
}
```

## XPTransaction

Registra toda movimentacao de XP do aluno.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico da transacao. |
| student_profile_id | UUID | Sim | Aluno que recebeu XP. |
| mission_id | UUID | Nao | Missao relacionada ao XP. |
| submission_id | UUID | Nao | Entrega aprovada que originou XP. |
| amount | integer | Sim | Quantidade de XP concedida. |
| reason | enum | Sim | Motivo: `mission_approved`, `manual_adjustment`. |
| created_at | datetime | Sim | Data de criacao. |

### Relacionamentos

- Pertence a um `StudentProfile`.
- Pode pertencer a uma `Mission`.
- Pode pertencer a uma `Submission`.

### Regras de Negocio

- No MVP, XP e gerado principalmente por `mission_approved`.
- Para cada aluno e missao, deve existir no maximo uma transacao com reason `mission_approved`.
- `amount` deve ser maior que zero.
- Ao criar uma transacao, `StudentProfile.total_xp` deve ser atualizado.
- Apos atualizar XP total, o nivel do aluno deve ser recalculado.

### Exemplo

```json
{
  "id": "a5bda557-c8b4-4c46-a7b3-c4bb76489d96",
  "student_profile_id": "b5737dfa-5ef7-44d6-a730-2d38a3afdf58",
  "mission_id": "af8cc633-5716-4929-9493-ee1cf358c619",
  "submission_id": "c92aa413-5b7a-4b15-8366-674da7289bc0",
  "amount": 50,
  "reason": "mission_approved",
  "created_at": "2026-05-29T14:00:00Z"
}
```

## Level

Define faixas de nivel com base no XP total.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico do nivel. |
| number | integer | Sim | Numero do nivel. |
| title | string | Sim | Nome exibido do nivel. |
| min_xp | integer | Sim | XP minimo para atingir o nivel. |
| max_xp | integer | Nao | XP maximo do nivel. Nulo para ultimo nivel. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- Pode ser referenciado por muitos `StudentProfile`.

### Regras de Negocio

- Faixas de XP nao podem se sobrepor.
- `min_xp` deve ser menor ou igual a `max_xp`, quando `max_xp` existir.
- Deve haver um nivel inicial com `min_xp` igual a `0`.
- O ultimo nivel pode ter `max_xp` nulo.

### Exemplo

```json
{
  "id": "0ec1b29e-d01d-4e42-85ae-bb6472a3b2b2",
  "number": 2,
  "title": "Aprendiz de Prompts",
  "min_xp": 100,
  "max_xp": 249,
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Badge

Representa conquistas visuais ou simbolicas futuras. No MVP, badges nao devem aparecer na experiencia principal nem gerar regras operacionais.

### Campos

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico da badge. |
| code | string | Sim | Codigo unico da badge. |
| title | string | Sim | Nome da badge. |
| description | text | Sim | Descricao do criterio. |
| icon | string | Nao | Referencia visual futura. |
| trigger_type | enum | Sim | Gatilho: `course_completed`, `mission_count`, `manual`. |
| is_active | boolean | Sim | Indica se pode ser concedida. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

### Relacionamentos

- No MVP, `Badge` pode existir sem tabela de concessao.
- Em evolucao futura, uma tabela `StudentBadge` deve relacionar alunos e badges conquistadas.

### Regras de Negocio

- `code` deve ser unico.
- Badges inativas nao devem ser exibidas nem concedidas.
- Como badges estao fora do MVP operacional, nao devem bloquear fluxo de aluno, entrega ou XP.

### Exemplo

```json
{
  "id": "e2f80ef7-297b-4bb8-8eea-2fe37dbd9575",
  "code": "first-approved-mission",
  "title": "Primeira Missao Aprovada",
  "description": "Concedida ao aluno que tem sua primeira missao aprovada.",
  "icon": "sparkle",
  "trigger_type": "mission_count",
  "is_active": false,
  "created_at": "2026-05-29T12:00:00Z",
  "updated_at": "2026-05-29T12:00:00Z"
}
```

## Relacionamentos Principais

```text
User 1--1 StudentProfile
User 1--1 TeacherProfile
StudentProfile 1--N LearningGoal
StudentProfile 1--0..1 LearningGoal ativo
TeacherProfile 1--N Course
Course 1--N Module
Module 1--N Mission
StudentProfile 1--N Submission
Mission 1--N Submission
Submission 1--1 Feedback
TeacherProfile 1--N Feedback
StudentProfile 1--N XPTransaction
Mission 1--N XPTransaction
Submission 1--0..1 XPTransaction
Level 1--N StudentProfile
```

## Fluxos de Dados do MVP

### Envio de Entrega

1. Aluno possui um `LearningGoal` ativo.
2. Aluno abre uma `Mission`.
3. Aluno cria uma `Submission` com status `pending`.
4. A entrega aparece na fila de validacao do professor.

### Reprovacao

1. Professor cria `Feedback` com decision `rejected`.
2. Sistema atualiza `Submission.status` para `rejected`.
3. Sistema registra `reviewed_at`.
4. Aluno visualiza feedback e pode criar nova `Submission` para a mesma `Mission`.

### Aprovacao

1. Professor cria `Feedback` com decision `approved`.
2. Sistema atualiza `Submission.status` para `approved`.
3. Sistema registra `reviewed_at`.
4. Sistema cria `XPTransaction` se ainda nao existir XP da missao para o aluno.
5. Sistema soma XP em `StudentProfile.total_xp`.
6. Sistema recalcula `StudentProfile.current_level_id`.

## Evolucao — Fase 3: Fases da Jornada (migration 0005)

A Fase 3 introduz a camada narrativa da jornada gamificada, de forma ADITIVA
e sem alterar XP, review, submissoes ou auth.

### JourneyPhase (`journey_phases`)

Representa cada uma das fases narrativas (Despertar -> Boss Final). Nivel
numerico de XP (`levels`) e fase narrativa sao entidades distintas.

| Campo | Tipo | Obrigatorio | Descricao |
|---|---|---:|---|
| id | UUID | Sim | Identificador unico. |
| number | integer | Sim | Ordem da fase (unico, > 0). |
| slug | string | Sim | Identificador estavel (ex.: `despertar`, `boss-final`). |
| name | string | Sim | Nome exibido da fase. |
| tagline | string | Sim | Frase curta de proposito da fase. |
| created_at | datetime | Sim | Data de criacao. |
| updated_at | datetime | Sim | Data da ultima atualizacao. |

Regras:

- `number` e `slug` sao unicos.
- RLS habilitada sem policies (mesma estrategia defensiva das demais tabelas
  de conteudo; acesso de dominio via service role no servidor).
- Uma fase pode ter zero ou muitas `Mission` (fases sem missoes aparecem como
  "em breve" na jornada).

### Campos adicionados em `Mission`

| Campo | Tipo | Obrigatorio | Default | Descricao |
|---|---|---:|---|---|
| phase_id | UUID | Nao | null | Fase narrativa da missao (FK `journey_phases`, `on delete set null`). |
| difficulty | enum `mission_difficulty` | Sim | `'easy'` | `easy`, `medium`, `hard`. |
| estimated_minutes | integer | Sim | `15` | Tempo estimado (> 0). |
| acceptance_criteria | text | Nao | null | Criterio objetivo de aceite da entrega. |

Observacoes:

- Todos os campos sao opcionais ou tem default, preservando linhas e seeds
  existentes e a RPC `review_submission` (que so depende de `xp_reward`).
- A logica de agrupamento por fase e o estado de cada fase (`complete`,
  `active`, `locked`, `empty`) vivem em `src/lib/journey.ts` (funcao pura,
  com testes em `tests/journey.test.ts`).

## Evolucao — Fase 4: Identidade do Avatar (migration 0006)

Adicao ADITIVA para a identidade visual do aluno, sem afetar XP/review/auth.

### Campo adicionado em `StudentProfile`

| Campo | Tipo | Obrigatorio | Default | Descricao |
|---|---|---:|---|---|
| avatar_variant | enum `avatar_variant` | Sim | `'aurora'` | Variante cosmetica do avatar: `aurora`, `ember`, `verdant`, `nebula`. |

Observacoes:

- Apenas customizacao visual; a evolucao do avatar (anel de progresso, icone de
  fase, badge de nivel) e derivada de nivel/fase em tempo de render, sem
  persistencia adicional.
- Atualizada pela server action `updateAvatarVariantAction`
  (`src/server/avatar.ts`), que valida o input com zod e so escreve no perfil
  do proprio aluno via service role apos `requireStudentContext`.
- A celebracao de level up e client-side e autocontida (compara o nivel atual
  com o ultimo visto em `localStorage`); helper puro `shouldCelebrateLevelUp`
  em `src/lib/avatar.ts` com testes em `tests/avatar.test.ts`.

## Evolucao — Fase 6: Boss Final / Projeto Final (migrations 0007 e 0008)

Adicao ADITIVA: o capstone da jornada. Um produto com IA descrito pelo aluno em
5 etapas, com ciclo de submissao e avaliacao do professor. NAO concede XP nem
mexe em niveis — a recompensa e a aprovacao (diploma); `review_submission`,
`level_for_xp` e o sistema de XP nao sao tocados.

### Tabela `BossProject` (`boss_projects`)

| Campo | Tipo | Obrigatorio | Default | Descricao |
|---|---|---:|---|---|
| id | UUID | Sim | `gen_random_uuid()` | PK. |
| student_profile_id | UUID | Sim | — | FK `student_profiles` (`on delete cascade`), **unico** (1 projeto por aluno). |
| title | text | Nao | null | Nome do produto. |
| problem | text | Nao | null | Etapa 1: problema real. |
| solution | text | Nao | null | Etapa 2: solucao com IA. |
| architecture | text | Nao | null | Etapa 3: como funciona por dentro. |
| prototype | text | Nao | null | Etapa 4: o que ja existe/esboco. |
| validation | text | Nao | null | Etapa 5: validacao com pessoas. |
| status | enum `boss_project_status` | Sim | `'draft'` | `draft`, `submitted`, `approved`, `rejected`. |
| reviewer_teacher_profile_id | UUID | Nao | null | FK `teacher_profiles` (`on delete set null`). |
| feedback | text | Nao | null | Comentario da avaliacao. |
| submitted_at / reviewed_at | timestamptz | Nao | null | Marcos do ciclo. |

### Funcoes (SECURITY DEFINER, revogadas de anon/authenticated — migration 0008)

- `submit_boss_project(p_project_id, p_student_profile_id)`: valida posse e
  completude (titulo + 5 etapas) e transiciona `draft|rejected -> submitted`,
  limpando avaliacao anterior em caso de reenvio.
- `review_boss_project(p_project_id, p_teacher_profile_id, p_decision, p_comment)`:
  exige feedback, so avalia `submitted`, grava `approved|rejected` + feedback.

Observacoes:

- Ciclo: `draft -> submitted -> approved | rejected`; reprovado volta a edicao e
  pode ser reenviado (espelha o reenvio das submissoes de missao).
- Acesso so via service role na camada de servidor: leituras em
  `src/server/boss-data.ts`; actions em `src/server/boss-projects.ts`
  (`saveBossDraftAction`, `submitBossProjectAction`, `reviewBossProjectAction`),
  guardadas por `requireStudentContext`/`requireTeacherContext`.
- Helpers puros de completude em `src/components/game/boss-stages.ts`
  (`countFilledStages`, `isBossProjectComplete`) com testes em
  `tests/boss-final.test.ts`.
- RLS habilitada sem policies (lockdown), como nas demais tabelas.
