-- ============================================================
-- IA para Vida Real — Seed inicial (idempotente)
-- Cria niveis, curso, modulo e missoes publicadas para permitir
-- testar o ciclo completo sem editor administrativo.
--
-- Re-executavel: usa UUIDs fixos + ON CONFLICT DO UPDATE.
-- ============================================================

-- ------------------------------------------------------------
-- Niveis (regra de docs/mvp-scope.md)
-- ------------------------------------------------------------
insert into public.levels (number, title, min_xp, max_xp) values
  (1, 'Explorador',          0,   99),
  (2, 'Aprendiz de Prompts', 100, 249),
  (3, 'Praticante de IA',    250, 499),
  (4, 'Construtor',          500, 799),
  (5, 'Autonomia com IA',    800, null)
on conflict (number) do update
  set title = excluded.title,
      min_xp = excluded.min_xp,
      max_xp = excluded.max_xp;

-- ------------------------------------------------------------
-- Curso publicado
-- ------------------------------------------------------------
insert into public.courses (id, title, description, status) values
  (
    '00000000-0000-0000-0000-0000000c0001',
    'Primeiros Passos com IA',
    'Jornada inicial para usar IA em tarefas reais de estudo, trabalho e vida. Voce vai praticar, enviar entregas e melhorar com feedback.',
    'published'
  )
on conflict (id) do update
  set title = excluded.title,
      description = excluded.description,
      status = excluded.status;

-- ------------------------------------------------------------
-- Modulo publicado
-- ------------------------------------------------------------
insert into public.modules (id, course_id, title, description, position, status) values
  (
    '00000000-0000-0000-0000-0000000d0001',
    '00000000-0000-0000-0000-0000000c0001',
    'Comecando com Prompts',
    'Atividades para entender como pedir melhor para a IA e aplicar em algo real.',
    1,
    'published'
  )
on conflict (id) do update
  set course_id = excluded.course_id,
      title = excluded.title,
      description = excluded.description,
      position = excluded.position,
      status = excluded.status;

-- ------------------------------------------------------------
-- Missoes publicadas
-- ------------------------------------------------------------
insert into public.missions
  (id, module_id, title, description, learning_objective, instructions, expected_submission, xp_reward, position, status)
values
  (
    '00000000-0000-0000-0000-0000000e0001',
    '00000000-0000-0000-0000-0000000d0001',
    'Crie um prompt claro',
    'Use IA para apoiar uma tarefa real de estudo ou trabalho que voce precisa resolver agora.',
    'Aprender a formular pedidos especificos para uma ferramenta de IA.',
    'Escolha uma tarefa real e escreva um prompt com tres partes: contexto, objetivo e formato esperado da resposta.',
    'Envie o prompt criado e explique em uma frase por que ele esta claro.',
    50, 1, 'published'
  ),
  (
    '00000000-0000-0000-0000-0000000e0002',
    '00000000-0000-0000-0000-0000000d0001',
    'Resolva uma tarefa real com IA',
    'Pegue uma necessidade concreta do seu dia e use IA para chegar a um resultado util.',
    'Praticar o uso de IA para produzir um resultado aplicavel.',
    'Descreva a tarefa, o prompt que voce usou e o resultado que a IA gerou. Diga o que aproveitou.',
    'Envie a tarefa escolhida, o prompt e um resumo do resultado obtido.',
    60, 2, 'published'
  ),
  (
    '00000000-0000-0000-0000-0000000e0003',
    '00000000-0000-0000-0000-0000000d0001',
    'Revise e melhore um texto com IA',
    'Use IA como apoio para revisar um texto seu (e-mail, mensagem, resumo) sem perder a sua voz.',
    'Aprender a usar IA para revisar mantendo autonomia sobre o resultado.',
    'Cole o texto original, peca uma revisao a IA e decida o que aceitar. Explique uma mudanca que voce recusou e por que.',
    'Envie o texto original, a versao revisada e a sua decisao sobre uma sugestao.',
    70, 3, 'published'
  ),
  (
    '00000000-0000-0000-0000-0000000e0004',
    '00000000-0000-0000-0000-0000000d0001',
    'Planeje um objetivo em passos',
    'Conecte seu objetivo real a um plano pratico, usando IA para quebrar o problema em etapas.',
    'Aprender a decompor um objetivo grande em passos executaveis com apoio de IA.',
    'Descreva seu objetivo real e peca a IA um plano em 3 a 5 passos. Ajuste o plano com as suas proprias palavras.',
    'Envie seu objetivo, o plano em passos e o ajuste que voce fez manualmente.',
    80, 4, 'published'
  ),
  (
    '00000000-0000-0000-0000-0000000e0005',
    '00000000-0000-0000-0000-0000000d0001',
    'Use IA para aprender algo novo',
    'Escolha um tema que voce quer aprender e use IA como tutor para dar o primeiro passo.',
    'Aprender a usar IA como apoio de estudo ativo, sem depender de respostas prontas.',
    'Escolha um tema, peca a IA uma explicacao simples e depois explique o tema com as suas palavras para mostrar que entendeu.',
    'Envie o tema, a explicacao que recebeu e a sua propria explicacao final.',
    100, 5, 'published'
  )
on conflict (id) do update
  set module_id = excluded.module_id,
      title = excluded.title,
      description = excluded.description,
      learning_objective = excluded.learning_objective,
      instructions = excluded.instructions,
      expected_submission = excluded.expected_submission,
      xp_reward = excluded.xp_reward,
      position = excluded.position,
      status = excluded.status;
