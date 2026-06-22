-- ============================================================
-- IA para Vida Real — Seed 0003: jornada educacional completa
--
-- Fase 5 do roadmap: conteúdo completo das fases Despertar -> Arquiteto.
-- Idempotente (UUIDs fixos + ON CONFLICT DO UPDATE). Apenas DADOS;
-- nenhuma mudança de schema. Nao toca XP/review/level/auth.
--
-- Estrutura:
--   1 curso publicado (atualizado para refletir a jornada completa)
--   6 módulos publicados, um por fase de aprendizagem (1..6)
--   18 missoes publicadas distribuidas nas fases 1..6
--     - reaproveita as 5 missoes do seed 0001 (e0001..e0005)
--     - adiciona 13 missoes novas
--   Cada missao tem objetivo, instrucoes, entrega esperada,
--   dificuldade, tempo estimado, XP e criterio de aceite (rubrica).
--
-- A fase 7 (Boss Final) permanece sem missoes: e a Fase 6 do roadmap.
-- ============================================================

-- ------------------------------------------------------------
-- Curso: reposicionado para a jornada completa
-- ------------------------------------------------------------
update public.courses set
  title = 'Jornada IA para Vida Real',
  description =
    'Do primeiro contato com IA até desenhar suas próprias soluções. '
    'Você avança por fases práticas, envia entregas reais e evolui com '
    'feedback de um mentor — do Despertar ao Arquiteto de IA.',
  status = 'published'
where id = '00000000-0000-0000-0000-0000000c0001';

-- ------------------------------------------------------------
-- Módulos: um por fase de aprendizagem (positions 1..6)
-- d0001 (existente) e repurposado como o módulo da fase Despertar.
-- ------------------------------------------------------------
insert into public.modules (id, course_id, title, description, position, status) values
  ('00000000-0000-0000-0000-0000000d0001', '00000000-0000-0000-0000-0000000c0001',
   'Fase 1 · Despertar', 'Descubra o que é IA, perca o medo e tenha suas primeiras conversas úteis.', 1, 'published'),
  ('00000000-0000-0000-0000-0000000d0002', '00000000-0000-0000-0000-0000000c0001',
   'Fase 2 · Explorador', 'Converse, pesquise e aprenda a validar o que a IA responde.', 2, 'published'),
  ('00000000-0000-0000-0000-0000000d0003', '00000000-0000-0000-0000-0000000c0001',
   'Fase 3 · Estrategista', 'Domine contexto, objetivo, formato e critérios nos seus prompts.', 3, 'published'),
  ('00000000-0000-0000-0000-0000000d0004', '00000000-0000-0000-0000-0000000c0001',
   'Fase 4 · Criador', 'Organize ideias e produza materiais e mini-projetos com apoio de IA.', 4, 'published'),
  ('00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000c0001',
   'Fase 5 · Operador', 'Use IA dentro de fluxos: planeje, automatize passos e documente.', 5, 'published'),
  ('00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000c0001',
   'Fase 6 · Arquiteto de IA', 'Desenhe agentes, especifique soluções e planeje um produto com IA.', 6, 'published')
on conflict (id) do update
  set course_id = excluded.course_id,
      title = excluded.title,
      description = excluded.description,
      position = excluded.position,
      status = excluded.status;

-- ------------------------------------------------------------
-- Missoes
-- Convencao de UUID: 00000000-0000-0000-0000-0000000e0PFF
--   PF = fase (1..6), F = ordem na fase. (e0001..e0005 mantidos do seed 0001)
-- position e global e crescente na ordem da jornada (1..18).
-- ------------------------------------------------------------
insert into public.missions
  (id, module_id, phase_id, title, description, learning_objective, instructions,
   expected_submission, acceptance_criteria, difficulty, estimated_minutes, xp_reward, position, status)
values
  -- ===================== FASE 1 · DESPERTAR =====================
  ('00000000-0000-0000-0000-0000000e0101',
   '00000000-0000-0000-0000-0000000d0001', '00000000-0000-0000-0000-0000000f0001',
   'Descubra a IA no seu dia',
   'Antes de usar, perceba onde a IA já aparece na sua rotina — no celular, no trabalho, nos estudos.',
   'Reconhecer aplicacoes reais de IA no cotidiano e desmistificar a tecnologia.',
   'Liste 3 situações do seu dia em que IA já está presente (ex.: recomendações, corretor, assistente de voz, mapas). Para cada uma, escreva uma frase explicando como você acha que ela ajuda.',
   'Envie as 3 situações com a explicação de cada uma.',
   'O aluno cita 3 exemplos concretos e plaus?veis e explica, com as próprias palavras, o papel da IA em cada um.',
   'easy', 10, 40, 1, 'published'),

  ('00000000-0000-0000-0000-0000000e0102',
   '00000000-0000-0000-0000-0000000d0001', '00000000-0000-0000-0000-0000000f0001',
   'Sua primeira conversa com IA',
   'Abra uma ferramenta de IA e tenha uma conversa de verdade, sem medo de errar.',
   'Ganhar confiança para iniciar e conduzir uma conversa com uma ferramenta de IA.',
   'Escolha uma ferramenta de IA gratuita, faça 3 perguntas sobre um assunto que você gosta e observe as respostas. Anote o que te surpreendeu.',
   'Envie as 3 perguntas que fez, um resumo das respostas e uma observação sua sobre a experiência.',
   'O aluno mostra 3 perguntas reais, resume o retorno e traz uma reflexão pessoal sobre o que percebeu.',
   'easy', 15, 40, 2, 'published'),

  -- e0001 (seed 0001) -> Despertar, fechamento da fase com prompt claro
  ('00000000-0000-0000-0000-0000000e0001',
   '00000000-0000-0000-0000-0000000d0001', '00000000-0000-0000-0000-0000000f0001',
   'Crie um prompt claro',
   'Use IA para apoiar uma tarefa real de estudo ou trabalho que você precisa resolver agora.',
   'Aprender a formular pedidos especificos para uma ferramenta de IA.',
   'Escolha uma tarefa real e escreva um prompt com três partes: contexto, objetivo e formato esperado da resposta.',
   'Envie o prompt criado e explique em uma frase por que ele está claro.',
   'O prompt deixa claros contexto, objetivo e formato esperado, e o aluno explica por que ele está claro.',
   'easy', 15, 50, 3, 'published'),

  -- ===================== FASE 2 · EXPLORADOR =====================
  -- e0002 (seed 0001)
  ('00000000-0000-0000-0000-0000000e0002',
   '00000000-0000-0000-0000-0000000d0002', '00000000-0000-0000-0000-0000000f0002',
   'Resolva uma tarefa real com IA',
   'Pegue uma necessidade concreta do seu dia e use IA para chegar a um resultado útil.',
   'Praticar o uso de IA para produzir um resultado aplicável.',
   'Descreva a tarefa, o prompt que você usou e o resultado que a IA gerou. Diga o que aproveitou.',
   'Envie a tarefa escolhida, o prompt e um resumo do resultado obtido.',
   'O aluno descreve a tarefa, o prompt usado e o resultado, indicando o que de fato aproveitou.',
   'easy', 20, 60, 4, 'published'),

  -- e0003 (seed 0001)
  ('00000000-0000-0000-0000-0000000e0003',
   '00000000-0000-0000-0000-0000000d0002', '00000000-0000-0000-0000-0000000f0002',
   'Revise e melhore um texto com IA',
   'Use IA como apoio para revisar um texto seu (e-mail, mensagem, resumo) sem perder a sua voz.',
   'Aprender a usar IA para revisar mantendo autonomia sobre o resultado.',
   'Cole o texto original, peça uma revisão a IA e decida o que aceitar. Explique uma mudança que você recusou e por que.',
   'Envie o texto original, a versao revisada e a sua decisão sobre uma sugestão.',
   'O aluno envia o texto original e o revisado e justifica uma sugestão da IA que decidiu recusar.',
   'medium', 20, 70, 5, 'published'),

  ('00000000-0000-0000-0000-0000000e0203',
   '00000000-0000-0000-0000-0000000d0002', '00000000-0000-0000-0000-0000000f0002',
   'Cheque uma resposta da IA',
   'A IA as vezes erra com confiança. Aprenda a desconfiar e verificar antes de usar.',
   'Desenvolver senso crítico para validar respostas e identificar informações incorretas.',
   'Faça uma pergunta factual a IA. Em seguida, confira a resposta em pelo menos uma fonte confiável (site oficial, livro, especialista). Registre se a IA acertou, errou ou exagerou.',
   'Envie a pergunta, a resposta da IA, a fonte usada para checar e a sua conclusão sobre a confiabilidade.',
   'O aluno verifica a resposta em uma fonte externa identificavel e conclui de forma justificada se a IA foi confiável.',
   'medium', 20, 70, 6, 'published'),

  -- ===================== FASE 3 · ESTRATEGISTA =====================
  -- e0004 (seed 0001)
  ('00000000-0000-0000-0000-0000000e0004',
   '00000000-0000-0000-0000-0000000d0003', '00000000-0000-0000-0000-0000000f0003',
   'Planeje um objetivo em passos',
   'Conecte seu objetivo real a um plano pratico, usando IA para quebrar o problema em etapas.',
   'Aprender a decompor um objetivo grande em passos executaveis com apoio de IA.',
   'Descreva seu objetivo real e peça a IA um plano em 3 a 5 passos. Ajuste o plano com as suas próprias palavras.',
   'Envie seu objetivo, o plano em passos e o ajuste que você fez manualmente.',
   'O plano tem de 3 a 5 passos e mostra ao menos um ajuste feito pelo aluno, com as próprias palavras.',
   'medium', 25, 80, 7, 'published'),

  ('00000000-0000-0000-0000-0000000e0302',
   '00000000-0000-0000-0000-0000000d0003', '00000000-0000-0000-0000-0000000f0003',
   'Prompt com critérios de qualidade',
   'Suba o nível dos seus prompts dizendo a IA o que torna uma boa resposta.',
   'Aprender a incluir critérios, restrições e exemplos para guiar a qualidade da resposta.',
   'Escolha uma tarefa e escreva um prompt que inclua: contexto, objetivo, formato, ao menos 2 critérios de qualidade (ex.: tom, tamanho, público) e uma restrição (o que evitar). Compare a resposta com a de um prompt simples sobre o mesmo tema.',
   'Envie o prompt detalhado, o prompt simples e uma comparação curta das duas respostas.',
   'O prompt detalhado contém critérios e restrição explícitos, e o aluno compara objetivamente o ganho de qualidade frente ao prompt simples.',
   'medium', 25, 85, 8, 'published'),

  ('00000000-0000-0000-0000-0000000e0303',
   '00000000-0000-0000-0000-0000000d0003', '00000000-0000-0000-0000-0000000f0003',
   'Itere até o resultado certo',
   'Raramente a primeira resposta e a melhor. Aprenda a refinar em rodadas.',
   'Praticar o refinamento iterativo: avaliar a resposta e pedir ajustes especificos.',
   'Parta de um prompt e faça pelo menos 3 rodadas de ajuste, melhorando a resposta a cada vez com pedidos especificos (ex.: "encurte", "use exemplos", "mude o tom"). Registre o que mudou em cada rodada.',
   'Envie o prompt inicial, as 3 rodadas de ajuste com o que pediu em cada uma e o resultado final.',
   'O aluno demonstra 3 iterações com pedidos especificos e mostra evolução clara entre a resposta inicial e a final.',
   'medium', 30, 90, 9, 'published'),

  -- ===================== FASE 4 · CRIADOR =====================
  -- e0005 (seed 0001)
  ('00000000-0000-0000-0000-0000000e0005',
   '00000000-0000-0000-0000-0000000d0004', '00000000-0000-0000-0000-0000000f0004',
   'Use IA para aprender algo novo',
   'Escolha um tema que você quer aprender e use IA como tutor para dar o primeiro passo.',
   'Aprender a usar IA como apoio de estudo ativo, sem depender de respostas prontas.',
   'Escolha um tema, peça a IA uma explicação simples e depois explique o tema com as suas palavras para mostrar que entendeu.',
   'Envie o tema, a explicação que recebeu e a sua própria explicação final.',
   'O aluno traz a explicação recebida e a sua própria explicação final, demonstrando entendimento real.',
   'medium', 30, 100, 10, 'published'),

  ('00000000-0000-0000-0000-0000000e0402',
   '00000000-0000-0000-0000-0000000d0004', '00000000-0000-0000-0000-0000000f0004',
   'Crie um material com IA',
   'Produza algo útil de ponta a ponta: um post, um roteiro, um resumo ou uma planilha de planejamento.',
   'Aprender a usar IA para co-criar um material aplicável, revisando e assumindo a autoria.',
   'Escolha um material para criar ligado ao seu objetivo. Use IA para um primeiro rascunho, depois edite e finalize com a sua decisão. Indique o que veio da IA e o que você mudou.',
   'Envie o material final, o rascunho da IA e um resumo das suas edições.',
   'O material final está pronto para uso, e o aluno distingue claramente a contribuição da IA das próprias edições.',
   'medium', 40, 100, 11, 'published'),

  ('00000000-0000-0000-0000-0000000e0403',
   '00000000-0000-0000-0000-0000000d0004', '00000000-0000-0000-0000-0000000f0004',
   'Monte um mini-projeto guiado',
   'Una o que aprendeu em um pequeno projeto com início, meio e fim.',
   'Integrar prompt, iteracao e criação para entregar um artefato com etapas definidas.',
   'Defina um mini-projeto (ex.: organizar um estudo de 1 semana, planejar um evento pequeno, montar um portfolio simples). Use IA em pelo menos 3 etapas (planejar, produzir, revisar) e descreva o resultado de cada etapa.',
   'Envie a descrição do projeto, as 3 etapas com o apoio da IA em cada uma e o resultado final entregue.',
   'O projeto tem objetivo claro e 3 etapas com uso de IA descrito, resultando em um entregável concreto.',
   'hard', 45, 120, 12, 'published'),

  -- ===================== FASE 5 · OPERADOR =====================
  ('00000000-0000-0000-0000-0000000e0501',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Mapeie uma tarefa repetitiva',
   'Toda automação começa por enxergar o trabalho repetitivo. Encontre o seu.',
   'Aprender a identificar e descrever um processo repetitivo passível de apoio por IA.',
   'Escolha uma tarefa que você repete (responder mensagens parecidas, organizar dados, montar relatorios). Descreva o passo a passo atual e aponte quais passos a IA poderia assumir ou acelerar.',
   'Envie o passo a passo da tarefa hoje e a indicação de quais passos a IA poderia apoiar e como.',
   'O aluno descreve um processo real em passos e identifica de forma realista onde a IA agrega, sem prometer o impossível.',
   'medium', 40, 100, 13, 'published'),

  ('00000000-0000-0000-0000-0000000e0502',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Crie um fluxo assistido por IA',
   'Transforme a tarefa repetitiva em um fluxo com a IA como assistente fixo.',
   'Projetar um fluxo de trabalho recorrente apoiado por IA, com prompt reutilizável.',
   'Para a tarefa que você mapeou, crie um prompt reutilizável (um "modelo" que você reusa trocando poucos dados) e descreva o fluxo: entrada, o que a IA faz, o que você revisa, saída. Teste com 2 exemplos diferentes.',
   'Envie o prompt reutilizável, a descrição do fluxo e os 2 exemplos testados com o resultado.',
   'O prompt e reutilizável e o fluxo tem entrada, papel da IA, revisão humana e saída; os 2 testes comprovam que funciona.',
   'hard', 50, 130, 14, 'published'),

  ('00000000-0000-0000-0000-0000000e0503',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Documente seu fluxo para reuso',
   'Um bom operador deixa o fluxo pronto para outra pessoa (ou o futuro você) usar.',
   'Aprender a documentar um processo apoiado por IA de forma clara e reutilizável.',
   'Escreva um mini-manual do seu fluxo: quando usar, o prompt, os passos, os cuidados (onde revisar com atenção) e um exemplo. Peça a IA para revisar a clareza do manual e ajuste.',
   'Envie o mini-manual final, incluindo quando usar, prompt, passos, cuidados e exemplo.',
   'O manual permite que outra pessoa execute o fluxo sem ajuda, com passos, cuidados e exemplo claros.',
   'medium', 40, 100, 15, 'published'),

  -- ===================== FASE 6 · ARQUITETO DE IA =====================
  ('00000000-0000-0000-0000-0000000e0601',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Desenhe um agente de IA',
   'Saia do prompt único: pense em um assistente com objetivo, ferramentas e passos.',
   'Compreender os elementos de um agente de IA: objetivo, capacidades, passos e limites.',
   'Imagine um agente que resolva um problema seu de ponta a ponta. Descreva: o objetivo dele, quais informações/ferramentas ele usaria, os passos que seguiria e o que ele NÃO deve fazer (limites).',
   'Envie o desenho do agente: objetivo, ferramentas/informações, passos e limites.',
   'O desenho cobre objetivo, recursos, sequência de passos e limites explícitos, formando um agente coerente e viável.',
   'hard', 60, 140, 16, 'published'),

  ('00000000-0000-0000-0000-0000000e0602',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Especifique uma solução com IA',
   'Antes de construir, especifique. Pense como quem vai entregar algo de verdade.',
   'Aprender a transformar uma ideia em uma especificação clara de solução com IA.',
   'Escolha um problema real e escreva uma especificação: quem tem o problema, o que a solução com IA faz, como a pessoa usa (passo a passo), o que entra e o que sai, e como saber se funcionou.',
   'Envie a especificação completa com público, função, uso, entradas/saídas e critério de sucesso.',
   'A especificação define público, função, fluxo de uso, entradas/saídas e um critério de sucesso mensurável.',
   'hard', 60, 140, 17, 'published'),

  ('00000000-0000-0000-0000-0000000e0603',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Plano do seu produto com IA',
   'Conecte tudo: este e o trampolim para o seu Boss Final.',
   'Consolidar a jornada em um plano de produto com IA, pronto para evoluir no projeto final.',
   'Reuna seus aprendizados em um plano de uma página: problema, público, solução com IA, etapas para construir um protótipo, riscos e como você validaria com pessoas reais.',
   'Envie o plano de uma página com problema, público, solução, etapas, riscos e plano de validação.',
   'O plano é coerente de ponta a ponta e mostra que o aluno consegue conduzir um produto com IA do problema a validação.',
   'hard', 60, 150, 18, 'published')
on conflict (id) do update
  set module_id = excluded.module_id,
      phase_id = excluded.phase_id,
      title = excluded.title,
      description = excluded.description,
      learning_objective = excluded.learning_objective,
      instructions = excluded.instructions,
      expected_submission = excluded.expected_submission,
      acceptance_criteria = excluded.acceptance_criteria,
      difficulty = excluded.difficulty,
      estimated_minutes = excluded.estimated_minutes,
      xp_reward = excluded.xp_reward,
      position = excluded.position,
      status = excluded.status;
