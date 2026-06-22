-- ============================================================
-- IA para Vida Real — Seed 0004: currículo avançado (fases 5-8)
--
-- Rodada de currículo avançado (docs/product-evolution/19). Expande a
-- jornada de 7 para 8 fases e de 18 para 24 missoes:
--   Fase 5 'Operador de IA'        — fluxos reais + ferramentas (4 missoes)
--   Fase 6 'Operador Técnico'      — NOVA: terminal/editor guiado (4 missoes)
--   Fase 7 'Arquiteto de Agentes'  — antiga fase 6, renumerada (4 missoes)
--   Fase 8 'Boss Final'            — antiga fase 7, renumerada (sem missoes)
--
-- Apenas DADOS (UPDATE/INSERT em journey_phases, modules, missions, courses).
-- Nao toca XP/review/level/auth/schema. Idempotente: updates keyed por id;
-- inserts com ON CONFLICT (id) DO UPDATE.
--
-- ESTE ARQUIVO E A AUTORIDADE DA NUMERACAO DE FASES.
-- Ordem canonica da cadeia de seeds: 0001 -> 0002 -> 0003 -> 0004.
-- A renumeracao do BLOCO A deve manter a ordem: liberar number 8 antes do 7,
-- e inserir a nova fase 6 somente depois (UNIQUE(number) em journey_phases).
-- Nao re-executar 0002/0003 isoladamente apos 0004; re-execute a cadeia
-- completa em ordem, ou apenas este arquivo.
-- ============================================================

-- ------------------------------------------------------------
-- BLOCO A — Fases: renumeracao segura (de cima para baixo)
-- ------------------------------------------------------------
-- A1. Boss Final: 7 -> 8 (number 8 esta livre)
update public.journey_phases set
  number = 8,
  tagline = 'Integre tudo em um produto com IA, no nível conceitual, operacional ou técnico.'
where id = '00000000-0000-0000-0000-0000000f0007';

-- A2. Arquiteto: 6 -> 7 (number 7 liberado em A1); slug permanece 'arquiteto'
update public.journey_phases set
  number = 7,
  name = 'Arquiteto de Agentes',
  tagline = 'Desenhe agentes como sistemas: objetivo, ferramentas, limites e validação.'
where id = '00000000-0000-0000-0000-0000000f0006';

-- A3. Operador de IA: number 5 mantido; sai a mencao a terminal/editor
update public.journey_phases set
  name = 'Operador de IA',
  tagline = 'Coloque a IA nos seus fluxos reais de trabalho: você decide, revisa e reutiliza.'
where id = '00000000-0000-0000-0000-0000000f0005';

-- A4. NOVA fase 6 'Operador Técnico' (number 6 liberado em A2)
insert into public.journey_phases (id, number, slug, name, tagline) values
  ('00000000-0000-0000-0000-0000000f0008', 6, 'operador-tecnico',
   'Operador Técnico', 'Pilote a IA em ambiente técnico guiado, sem precisar virar programador.')
on conflict (id) do update
  set number = excluded.number,
      slug = excluded.slug,
      name = excluded.name,
      tagline = excluded.tagline;

-- ------------------------------------------------------------
-- BLOCO B — Curso e módulos
-- ------------------------------------------------------------
update public.courses set
  description =
    'Do primeiro contato com IA até desenhar suas próprias soluções. '
    'Você avança por fases práticas — do Despertar a operação de fluxos '
    'reais, ao ambiente técnico guiado e a arquitetura de agentes — '
    'envia entregas reais e evolui com feedback de um mentor até o Boss Final.'
where id = '00000000-0000-0000-0000-0000000c0001';

-- Módulo da fase 5: novo nome, sem terminal/editor
update public.modules set
  title = 'Fase 5 · Operador de IA',
  description = 'Use IA dentro de fluxos reais: mapeie, crie prompts reutilizaveis, execute em ferramentas de trabalho e documente.',
  position = 5
where id = '00000000-0000-0000-0000-0000000d0005';

-- Módulo da antiga fase 6 vira fase 7
update public.modules set
  title = 'Fase 7 · Arquiteto de Agentes',
  description = 'Desenhe agentes, cadeias de etapas, papéis e o plano do seu produto com IA.',
  position = 7
where id = '00000000-0000-0000-0000-0000000d0006';

-- NOVO módulo da fase 6 'Operador Técnico'
insert into public.modules (id, course_id, title, description, position, status) values
  ('00000000-0000-0000-0000-0000000d0007', '00000000-0000-0000-0000-0000000c0001',
   'Fase 6 · Operador Técnico',
   'Pilote IA em ambiente técnico guiado: vocabulário, leitura de erros, alteração mínima e navegação assistida.',
   6, 'published')
on conflict (id) do update
  set course_id = excluded.course_id,
      title = excluded.title,
      description = excluded.description,
      position = excluded.position,
      status = excluded.status;

-- ------------------------------------------------------------
-- BLOCO C — Missoes avançadas (fases 5, 6 e 7)
--
-- IDs preservados (alunos podem ter submissions associadas):
--   e0501, e0502, e0503 -> Fase 5 (textos atualizados)
--   e0601, e0602, e0603 -> Fase 7 (textos atualizados; phase/module mantidos)
-- IDs novos:
--   e0504 (fase 5, missao 3), e0604 (fase 7, missao 2)
--   e1601..e1604 (fase 6 nova; prefixo e16 = "fase 6, numeracao nova")
-- position global: fases 1-4 mantém 1..12 (seed 0003); avançadas usam 13..24.
-- Toda missao da fase 6 aceita evidência real OU simulada com a IA,
-- desde que declarada; a rubrica cobra o mesmo rigor de raciocinio.
-- ------------------------------------------------------------
insert into public.missions
  (id, module_id, phase_id, title, description, learning_objective, instructions,
   expected_submission, acceptance_criteria, difficulty, estimated_minutes, xp_reward, position, status)
values
  -- ===================== FASE 5 · OPERADOR DE IA =====================
  ('00000000-0000-0000-0000-0000000e0501',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Mapeie um fluxo real seu',
   'Toda operação com IA começa por enxergar como o trabalho acontece hoje. Olhe para uma rotina sua de verdade e desenhe o caminho que ela percorre.',
   'Descrever um fluxo real em passos e separar onde a IA ajuda de onde a decisão precisa continuar humana.',
   'Escolha um fluxo que você mesmo executa na sua rotina (trabalho ou estudo). Liste os passos na ordem em que acontecem, marque onde existe uma decisão humana e aponte em quais passos a IA poderia ajudar. Marque tambem ao menos um passo em que a IA NÃO deve decidir sozinha e explique por que.',
   'Envie o passo a passo do fluxo, as decisões humanas marcadas e a indicação dos pontos onde a IA ajuda e do ponto onde ela não deve decidir sozinha.',
   'O aluno descreve um fluxo próprio e realista em passos ordenados, identifica de forma plausivel onde a IA agrega e aponta ao menos um ponto onde a IA não deve decidir sozinha, com justificativa.',
   'medium', 40, 90, 13, 'published'),

  ('00000000-0000-0000-0000-0000000e0502',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Crie um prompt operacional reutilizável',
   'Um operador não reescreve o pedido toda vez: ele cria um modelo que reusa trocando poucos dados. Transforme seu fluxo em um prompt reaproveitavel.',
   'Construir um prompt-modelo com variáveis, critérios de qualidade e um checklist de revisão da saída.',
   'Para o fluxo que você mapeou, escreva um prompt-modelo com partes fixas e variáveis (campos que você troca a cada uso, ex.: [assunto], [público]). Inclua ao menos 2 critérios de qualidade e um checklist de revisão com 3 a 5 itens que você verifica na saída antes de usar.',
   'Envie o prompt-modelo com as variáveis marcadas, os critérios de qualidade e o checklist de revisão da saída.',
   'O prompt tem variáveis explicitas que permitem reuso, traz ao menos 2 critérios de qualidade e um checklist de revisão com itens verificaveis aplicados a saída.',
   'medium', 45, 100, 14, 'published'),

  ('00000000-0000-0000-0000-0000000e0504',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Execute o fluxo em uma ferramenta de trabalho',
   'Sair do chat e levar o fluxo para onde o trabalho vive de verdade: um documento, uma planilha, um e-mail, o Notion, o Canva ou o navegador. Hora de rodar com casos reais.',
   'Executar um fluxo apoiado por IA dentro de uma ferramenta de trabalho e revisar criticamente a saída antes de decidir.',
   'Rode seu fluxo em 2 casos reais diferentes dentro de uma ferramenta que você já usa (documento, planilha, e-mail, Notion, Canva ou navegador). Para cada caso, descreva a cadeia completa: entrada, prompt usado, saída que veio da IA, o que você revisou e a decisão final. Diga o que você aceitou e o que precisou corrigir e por que.',
   'Envie os 2 casos com a cadeia entrada, prompt, saída, revisão e decisão em cada um, mais o que você aceitou e o que corrigiu.',
   'Os 2 casos mostram a cadeia completa (entrada, prompt, saída, revisão, decisão) dentro de uma ferramenta nomeada, e o aluno indica de forma concreta ao menos uma correção ou recusa feita sobre a saída da IA.',
   'hard', 55, 130, 15, 'published'),

  ('00000000-0000-0000-0000-0000000e0503',
   '00000000-0000-0000-0000-0000000d0005', '00000000-0000-0000-0000-0000000f0005',
   'Documente o procedimento para outra pessoa',
   'Um bom operador deixa o fluxo pronto para outra pessoa (ou o futuro você) usar sem precisar perguntar nada. Escreva o manual.',
   'Documentar um procedimento apoiado por IA de forma clara, reutilizável e com pontos de atenção reais.',
   'Escreva um mini-manual do seu fluxo com: quando usar, o prompt, os passos na ordem, uma seção "onde revisar com atenção" e um exemplo. A seção de revisão deve vir da sua experiência real da missão anterior: aponte os pontos onde a saída costuma falhar ou precisar de correção. Peça a IA para revisar a clareza e ajuste o que fizer sentido.',
   'Envie o mini-manual final com quando usar, prompt, passos, a seção "onde revisar com atenção" e um exemplo.',
   'O manual permite que outra pessoa execute o fluxo sem ajuda e a seção "onde revisar com atenção" traz pontos concretos derivados da execução real, não avisos genéricos.',
   'medium', 40, 100, 16, 'published'),

  -- ===================== FASE 6 · OPERADOR TECNICO =====================
  ('00000000-0000-0000-0000-0000000e1601',
   '00000000-0000-0000-0000-0000000d0007', '00000000-0000-0000-0000-0000000f0008',
   'Entenda o ambiente',
   'Antes de mexer em qualquer coisa técnica, entenda as palavras. Terminal, pasta, arquivo, comando, erro e log deixam de assustar quando ganham um significado seu.',
   'Compreender os elementos básicos de um ambiente técnico explicando cada um com as próprias palavras e uma analogia pessoal.',
   'Para cada termo (terminal, pasta, arquivo, comando, erro, log), escreva com as suas palavras o que ele e é crie uma analogia ligada a sua própria vida (ex.: "pasta é como a gaveta onde guardo..."). Nada de instalar nada. Se algum termo não fizer sentido, peça a IA para explicar e depois reescreva do seu jeito, sem copiar.',
   'Envie os 6 termos, cada um com a sua explicação e a sua analogia pessoal.',
   'Os 6 termos sao explicados com as próprias palavras e cada um traz uma analogia pessoal coerente; explicações copiadas sem reformulação não atendem o critério.',
   'easy', 25, 55, 17, 'published'),

  ('00000000-0000-0000-0000-0000000e1602',
   '00000000-0000-0000-0000-0000000d0007', '00000000-0000-0000-0000-0000000f0008',
   'Leia um erro com a IA',
   'Erro não é fim de caminho, é informação. Aprenda a ler uma mensagem de erro e separar o que ela diz do que provavelmente causou e do que fazer a seguir.',
   'Distinguir mensagem de erro, causa provavel e próximo passo a partir de um erro real ou simulado.',
   'Pegue um erro real que você já viu OU peça a IA para simular um erro típico e mostra-lo. Cole a mensagem do erro. Depois, com as suas palavras, escreva três coisas: (1) o que a mensagem está dizendo, (2) qual a causa provavel e (3) qual seria o próximo passo. Se não tiver um erro real, peça a IA para simular o cenário e siga o mesmo raciocinio. Declare se o erro foi real ou simulado.',
   'Envie a mensagem de erro colada, sua leitura em três partes (mensagem, causa provavel, próximo passo) e a declaração real ou simulado.',
   'O aluno cola a mensagem de erro e separa, com as próprias palavras, mensagem, causa provavel e próximo passo de forma coerente, alem de declarar se o erro foi real ou simulado.',
   'medium', 35, 80, 18, 'published'),

  ('00000000-0000-0000-0000-0000000e1603',
   '00000000-0000-0000-0000-0000000d0007', '00000000-0000-0000-0000-0000000f0008',
   'Alteração mínima guiada em um arquivo',
   'A primeira mudança técnica deve ser pequena e revers?vel. Altere uma coisa simples e aprenda a confirmar que deu certo.',
   'Realizar uma alteração mínima e revers?vel em um arquivo e saber verificar o resultado.',
   'Faça uma mudança pequena e revers?vel em um arquivo de texto (ex.: trocar uma palavra, ajustar um título) no VS Code ou em qualquer editor. Cole o antes e o depois, explique por que essa mudança e como você sabe que deu certo. Se não tiver ambiente, peça a IA para simular o cenário mostrando o antes/depois e siga o mesmo raciocinio. Declare se foi real ou simulado.',
   'Envie o antes e o depois do trecho, a explicação do porque da mudança, como você confirmou que deu certo e a declaração real ou simulado.',
   'O aluno apresenta antes/depois concretos de uma alteração pequena e revers?vel, justifica a mudança e descreve uma forma plausivel de confirmar o resultado, declarando real ou simulado.',
   'medium', 40, 90, 19, 'published'),

  ('00000000-0000-0000-0000-0000000e1604',
   '00000000-0000-0000-0000-0000000d0007', '00000000-0000-0000-0000-0000000f0008',
   'Navegue um projeto e proponha uma mini-melhoria',
   'Saber se orientar dentro de um projeto e mais útil do que decorar comandos. Use a IA como guia de leitura e proponha uma melhoria pequena.',
   'Navegar um projeto com leitura orientada por IA e propor uma melhoria pequena com teste manual e reflexão.',
   'Escolha um projeto (um repositório, uma pasta de arquivos ou um cenário que a IA simule). Defina um objetivo de busca, peça pistas a IA e explique cada pista que você usou para se orientar. Depois proponha uma mini-melhoria pequena, descreva como testaria manualmente que ela funciona e reflita sobre um risco dessa mudança. Se não tiver um projeto real, peça a IA para simular o cenário. Declare se foi real ou simulado.',
   'Envie o objetivo de busca, as pistas usadas com a explicação de cada uma, a mini-melhoria proposta, o teste manual descrito, a reflexão de risco e a declaração real ou simulado.',
   'O aluno demonstra leitura orientada (pistas explicadas, não apenas copiadas), propõe uma melhoria pequena com teste manual descrito e uma reflexão de risco, declarando real ou simulado.',
   'medium', 45, 100, 20, 'published'),

  -- ===================== FASE 7 · ARQUITETO DE AGENTES =====================
  ('00000000-0000-0000-0000-0000000e0601',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Desenhe um agente simples',
   'Saia do prompt único: pense em um assistente com objetivo, ferramentas e passos. E pense tambem no que ele faz quando trava.',
   'Compreender os elementos de um agente de IA, incluindo limites, critério de sucesso e fallback.',
   'Imagine um agente que resolva um problema seu de ponta a ponta. Descreva: o objetivo dele, as entradas e ferramentas que usaria, os passos que seguiria, a saída esperada, o que ele NÃO deve fazer (limites), o critério de sucesso e o fallback (o que o agente faz quando não consegue cumprir a tarefa). Ancore o agente em um problema real seu.',
   'Envie o desenho do agente com objetivo, entradas/ferramentas, passos, saída, limites, critério de sucesso e fallback.',
   'O desenho cobre objetivo, entradas/ferramentas, passos, saída, limites e critério de sucesso, e define um fallback explicito para quando o agente não conseguir cumprir a tarefa.',
   'hard', 60, 140, 21, 'published'),

  ('00000000-0000-0000-0000-0000000e0604',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Transforme uma tarefa em cadeia de etapas',
   'Tarefas complexas viram boas soluções quando viram etapas encadeadas. Quebre uma tarefa sua em passos que se conectam.',
   'Decompor uma tarefa em etapas encadeadas, descrevendo o que entra e sai entre elas e onde o humano decide.',
   'Pegue uma tarefa sua que tenha mais de um passo (ex.: pesquisar, resumir, comparar, decidir, gerar saída final). Descreva as etapas na ordem é, entre cada uma, diga o que sai de uma e entra na próxima. Marque onde o humano decide e justifique por que a ordem das etapas é essa, e não outra.',
   'Envie a cadeia de etapas com o que entra e sai entre elas, os pontos de decisão humana e a justificativa da ordem.',
   'A cadeia tem etapas ordenadas com entradas e saídas conectadas entre elas, marca ao menos um ponto de decisão humana e justifica a ordem escolhida.',
   'medium', 45, 100, 22, 'published'),

  ('00000000-0000-0000-0000-0000000e0602',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Defina papéis de agentes',
   'Um sistema com varios agentes só funciona se cada um souber seu papel e quando passar a bola. Defina o time.',
   'Especificar 2 a 3 agentes com responsabilidades distintas, critério de transferência, resolução de conflito e decisão final.',
   'Para um problema seu, defina de 2 a 3 agentes com responsabilidades distintas (sem sobreposição). Para cada um, diga o que ele faz. Depois descreva: o critério de transferência (quando um agente passa o trabalho para o outro), como resolver um conflito quando eles discordarem e quem da a decisão final.',
   'Envie os 2 a 3 agentes com responsabilidades, o critério de transferência entre eles, a regra de resolução de conflito e quem da a decisão final.',
   'Os agentes tem responsabilidades distintas e não redundantes, com critério de transferência claro, uma regra de resolução de conflito e a definição de quem da a decisão final.',
   'hard', 55, 130, 23, 'published'),

  ('00000000-0000-0000-0000-0000000e0603',
   '00000000-0000-0000-0000-0000000d0006', '00000000-0000-0000-0000-0000000f0006',
   'Plano do seu produto com IA',
   'Conecte tudo: este e o trampolim para o seu Boss Final. Um plano de uma página que já vem com a sua própria régua de sucesso.',
   'Consolidar a jornada em um plano de produto com IA e definir uma mini-rubrica própria para julgar o sucesso.',
   'Reuna seus aprendizados em um plano de uma página com: problema, público, solução com IA, fluxo de uso, agentes envolvidos, dados necessários, riscos e plano de validação. Ao final, crie uma mini-rubrica própria de sucesso com três níveis: aprovado, revisar e inconclusivo, dizendo o que caracteriza cada um para o seu produto.',
   'Envie o plano de uma página com problema, público, solução, fluxo, agentes, dados, riscos e validação, mais a mini-rubrica de sucesso com os três níveis.',
   'O plano é coerente de ponta a ponta cobrindo os oito itens, e a mini-rubrica define de forma verificável o que torna o produto aprovado, revisar ou inconclusivo.',
   'hard', 60, 150, 24, 'published')
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
