# 06 - Implementation Roadmap

## Fase 0 - Auditoria e preparacao

Objetivo:

- Consolidar entendimento do MVP e preparar terreno tecnico.

Arquivos impactados:

- `docs/product-evolution/*`;
- possivelmente `README.md`, `docs/tech-stack.md`, `docs/qa-plan.md`.

Tarefas:

- Revisar documentos criados nesta pasta.
- Corrigir problemas de encoding em docs/textos se necessario.
- Definir escopo da primeira entrega visual.
- Adicionar testes minimos para XP, status de missao e review.

Criterios de aceite:

- Time entende o estado atual e os gaps.
- Roadmap aprovado.
- Riscos de core mapeados.

Riscos:

- Comecar UI premium sem criterios objetivos.

Prioridade:

- Alta.

## Fase 1 - Reposicionamento visual da landing

Objetivo:

- Transformar `/` em entrada cinematografica da jornada.

Arquivos impactados:

- `src/app/page.tsx`;
- `src/app/globals.css`;
- novos componentes em `src/components/marketing/*`;
- possiveis assets em `public/assets/images/`.

Tarefas:

- Reescrever hero e proposta de valor.
- Adicionar preview de jornada, avatar e boss final.
- Criar secoes das sete fases.
- Aplicar paleta premium.
- Adicionar motion leve se `framer-motion` for instalado.

Criterios de aceite:

- Primeira dobra comunica "jornada gamificada em IA".
- CTA principal e "Iniciar jornada".
- A pagina nao parece LMS tradicional.
- Funciona em mobile.

Riscos:

- Excesso de efeitos sem conteudo real.

Prioridade:

- Alta.

## Fase 2 - Dashboard gamificado

Objetivo:

- Transformar `/aluno` em cockpit de evolucao.

Arquivos impactados:

- `src/app/aluno/page.tsx`;
- `src/components/level-progress.tsx`;
- `src/components/goal-card.tsx`;
- novos componentes em `src/components/game/*`;
- `src/server/student-data.ts` ou novo `src/server/progression.ts`.

Tarefas:

- Criar painel de avatar/nivel.
- Destacar proxima missao como quest principal.
- Exibir progresso da fase/jornada.
- Reposicionar feedback recente como mentoria.
- Criar area de skills/badges mesmo que inicialmente parcial.

Criterios de aceite:

- Aluno entende claramente nivel, XP, proxima missao e objetivo.
- UI parece game dashboard premium.
- Regras atuais de progresso continuam funcionando.

Riscos:

- Acoplar visual novo ao formato atual de dados sem camada de adaptacao.

Prioridade:

- Alta.

## Fase 3 - Sistema de missoes e XP aprimorado

Objetivo:

- Evoluir missoes de lista simples para quests com fases, criterios e recompensas.

Arquivos impactados:

- `src/app/aluno/missoes/page.tsx`;
- `src/app/aluno/missoes/[missionId]/page.tsx`;
- `src/server/content.ts`;
- `src/server/student-data.ts`;
- migrations/seeds em `database/`.

Tarefas:

- Adicionar fases da jornada.
- Associar missoes a fases.
- Adicionar dificuldade, tempo estimado e criterios de aceite.
- Criar mapa/lista hibrida acessivel.
- Atualizar seed com missoes por fase.

Criterios de aceite:

- Jornada mostra as sete fases.
- Cada missao tem recompensa e criterio claro.
- Conteudo atual continua acessivel ou migrado.

Riscos:

- Mudanca de modelo quebrar missoes publicadas.

Prioridade:

- Alta.

## Fase 4 - Avatar e progressao

Objetivo:

- Criar identidade evolutiva do aluno.

Arquivos impactados:

- `src/app/aluno/perfil/page.tsx`;
- `src/app/aluno/page.tsx`;
- novos `src/components/game/avatar-*`;
- futuras migrations para avatar/cosmeticos se necessario.

Tarefas:

- Criar avatar 2D inicial ou plugar GLB proprio/licenciado em fase posterior (sem RPM — descontinuado 31/01/2026).
- Mapear estado visual por nivel/fase.
- Mostrar conquistas e progressao no perfil.
- Criar celebracao de level up.

Criterios de aceite:

- Perfil deixa de ser apenas dados e vira identidade de jornada.
- Avatar reflete nivel/progresso.
- Ha fallback sem 3D.

Riscos:

- Integracao 3D/avatar adicionar complexidade cedo demais.

Prioridade:

- Media.

## Fase 5 - Jornada educacional completa

Objetivo:

- Criar conteudo completo das fases Despertar a Arquiteto de IA.

Arquivos impactados:

- `database/seeds/0001_seed.sql` ou novos seeds;
- possiveis docs de conteudo;
- telas de missao e professor.

Tarefas:

- Especificar objetivos de aprendizagem por fase.
- Criar missoes praticas e entregas esperadas.
- Definir criterios de avaliacao para professor.
- Revisar XP por dificuldade.
- Criar diario de bordo se incluido nesta fase.

Criterios de aceite:

- Cada fase ensina IA de forma pratica.
- Professor tem contexto suficiente para avaliar.
- Aluno consegue seguir do zero ate arquitetura.

Riscos:

- Conteudo crescer sem taxonomia clara.

Prioridade:

- Alta.

## Fase 6 - Boss Final / TCC

Objetivo:

- Criar a experiencia de produto final com IA.

Arquivos impactados:

- nova rota `/aluno/boss-final`;
- migrations para `boss_projects`;
- componentes de projeto final;
- tela do professor para revisar etapas finais, se necessario.

Tarefas:

- Modelar projeto final.
- Criar etapas: problema, solucao, arquitetura, prototipo, validacao.
- Definir entregas e criterios.
- Criar pagina/hub de acompanhamento.
- Conectar diario e missoes anteriores ao portfolio final.

Criterios de aceite:

- Aluno consegue iniciar, preencher e submeter o projeto final.
- Professor consegue validar.
- Produto final e apresentavel.

Riscos:

- Boss Final virar formulario longo sem sensacao de climax.

Prioridade:

- Alta, apos fases de base.

## Fase 7 - Polimento visual, animacoes e 3D

Objetivo:

- Elevar percepcao premium com motion, 3D e microinteracoes.

Arquivos impactados:

- `src/components/3d/*`;
- `src/components/motion/*`;
- landing, dashboard, jornada, perfil e boss final;
- `public/assets/3d/*`.

Tarefas:

- Instalar Framer Motion e bibliotecas 3D se ainda nao instaladas.
- Criar hero/cena 3D com fallback.
- Adicionar animacoes de XP, badge e unlock.
- Otimizar assets.
- Testar performance desktop/mobile.

Criterios de aceite:

- Motion melhora compreensao e recompensa.
- 3D nao bloqueia uso.
- Mobile continua rapido e legivel.

Riscos:

- Bundle pesado e experiencia instavel.

Prioridade:

- Media/Alta, mas depois do reposicionamento e dashboard.

