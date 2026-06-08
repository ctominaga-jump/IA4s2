-- ============================================================
-- IA para Vida Real — Seed 0002: fases da jornada + quests
--
-- Idempotente (UUIDs fixos + ON CONFLICT DO UPDATE). Cria as 7 fases
-- narrativas e associa as missoes publicadas existentes (seed 0001) a
-- fase, dificuldade, tempo estimado e criterio de aceite.
--
-- As fases Operador, Arquiteto e Boss Final ficam sem missoes por ora
-- (conteudo completo previsto para a Fase 5/6); a jornada ja exibe as 7.
--
-- ATENCAO: o seed 0004_advanced_curriculum.sql e a AUTORIDADE da numeracao
-- de fases (renumera para 8 fases). Por isso o upsert abaixo usa
-- ON CONFLICT (id) e NAO atualiza `number` em re-execucao: re-rodar este
-- arquivo apos o 0004 nao desfaz a renumeracao nem viola UNIQUE(number).
-- Re-execute a cadeia completa em ordem (0001 -> 0004) ou apenas o 0004.
-- ============================================================

-- ------------------------------------------------------------
-- Fases da jornada
-- ------------------------------------------------------------
insert into public.journey_phases (id, number, slug, name, tagline) values
  ('00000000-0000-0000-0000-0000000f0001', 1, 'despertar',
   'Despertar', 'Descubra o que e IA e como ela ja aparece no seu dia a dia.'),
  ('00000000-0000-0000-0000-0000000f0002', 2, 'explorador',
   'Explorador', 'Converse com a IA, pesquise e comece a validar respostas.'),
  ('00000000-0000-0000-0000-0000000f0003', 3, 'estrategista',
   'Estrategista', 'Domine contexto, objetivo, formato e criterios nos prompts.'),
  ('00000000-0000-0000-0000-0000000f0004', 4, 'criador',
   'Criador', 'Organize ideias e crie pequenos projetos com apoio de IA.'),
  ('00000000-0000-0000-0000-0000000f0005', 5, 'operador',
   'Operador', 'Use IA em ferramentas: terminal, editor e fluxos assistidos.'),
  ('00000000-0000-0000-0000-0000000f0006', 6, 'arquiteto',
   'Arquiteto de IA', 'Desenhe agentes, arquitetura e produto de ponta a ponta.'),
  ('00000000-0000-0000-0000-0000000f0007', 7, 'boss-final',
   'Boss Final', 'Integre tudo em um produto com IA: do problema a validacao.')
on conflict (id) do update
  set slug = excluded.slug,
      name = excluded.name,
      tagline = excluded.tagline;

-- ------------------------------------------------------------
-- Associacao das missoes existentes as fases + atributos de quest
-- ------------------------------------------------------------
-- Missao 1: Crie um prompt claro -> Despertar
update public.missions set
  phase_id = '00000000-0000-0000-0000-0000000f0001',
  difficulty = 'easy',
  estimated_minutes = 15,
  acceptance_criteria = 'O prompt deixa claros contexto, objetivo e formato esperado, e voce explica por que ele esta claro.'
where id = '00000000-0000-0000-0000-0000000e0001';

-- Missao 2: Resolva uma tarefa real com IA -> Explorador
update public.missions set
  phase_id = '00000000-0000-0000-0000-0000000f0002',
  difficulty = 'easy',
  estimated_minutes = 20,
  acceptance_criteria = 'Voce descreve a tarefa, o prompt usado e o resultado, indicando o que de fato aproveitou.'
where id = '00000000-0000-0000-0000-0000000e0002';

-- Missao 3: Revise e melhore um texto com IA -> Explorador
update public.missions set
  phase_id = '00000000-0000-0000-0000-0000000f0002',
  difficulty = 'medium',
  estimated_minutes = 20,
  acceptance_criteria = 'Voce envia o texto original e o revisado e justifica uma sugestao da IA que decidiu recusar.'
where id = '00000000-0000-0000-0000-0000000e0003';

-- Missao 4: Planeje um objetivo em passos -> Estrategista
update public.missions set
  phase_id = '00000000-0000-0000-0000-0000000f0003',
  difficulty = 'medium',
  estimated_minutes = 25,
  acceptance_criteria = 'O plano tem de 3 a 5 passos e mostra ao menos um ajuste feito por voce, com suas palavras.'
where id = '00000000-0000-0000-0000-0000000e0004';

-- Missao 5: Use IA para aprender algo novo -> Criador
update public.missions set
  phase_id = '00000000-0000-0000-0000-0000000f0004',
  difficulty = 'medium',
  estimated_minutes = 30,
  acceptance_criteria = 'Voce traz a explicacao recebida e a sua propria explicacao final, demonstrando entendimento.'
where id = '00000000-0000-0000-0000-0000000e0005';
