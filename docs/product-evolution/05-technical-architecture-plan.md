# 05 - Technical Architecture Plan

## Principio de arquitetura

Preservar o core confiavel atual e evoluir a experiencia em camadas.

O fluxo de dominio existente, especialmente `review_submission`, XP e validacao por professor, deve continuar sendo a fonte de verdade. A transformacao visual/gamificada deve ser incremental e reversivel, evitando reescrever o produto inteiro.

## Arquitetura front-end proposta

Manter Next.js App Router com Server Components para dados e Client Components apenas onde houver interacao/motion/3D.

Separacao sugerida:

- `src/app/page.tsx`: landing premium publica.
- `src/app/aluno/*`: experiencia gamificada do aluno.
- `src/app/professor/*`: painel operacional do professor.
- `src/components/game/*`: componentes de gamificacao.
- `src/components/marketing/*`: componentes da landing.
- `src/components/3d/*`: cenas e wrappers 3D isolados.
- `src/components/motion/*`: primitives de animacao reutilizaveis.
- `src/server/progression.ts`: queries/agregacoes de progresso.
- `src/server/gamification.ts`: regras de badges/skills/fases.

## Componentes principais futuros

- `StudentCockpit`: dashboard gamificado do aluno.
- `JourneyMap`: mapa das fases e missoes.
- `MissionNode`: no visual de missao.
- `AvatarPanel`: avatar, nivel, XP e cosmeticos.
- `SkillTree`: arvore de habilidades.
- `BadgeWall`: conquistas.
- `QuestCard`: card premium de missao.
- `LevelUpDialog`: celebracao de level up.
- `BossFinalHub`: central do projeto final.
- `JournalPanel`: diario de bordo.

## Estrutura de rotas sugerida

Rotas atuais a manter:

- `/`;
- `/login`;
- `/cadastro`;
- `/onboarding`;
- `/aluno`;
- `/aluno/missoes`;
- `/aluno/missoes/[missionId]`;
- `/aluno/perfil`;
- `/professor`;
- `/professor/fila`;
- `/professor/entregas/[submissionId]`.

Rotas futuras:

- `/aluno/mapa`: mapa completo da jornada, se a lista atual ficar pesada.
- `/aluno/skills`: skill tree dedicada.
- `/aluno/badges`: mural de conquistas.
- `/aluno/diario`: diario de bordo.
- `/aluno/boss-final`: hub do TCC/produto.
- `/aluno/avatar`: customizacao/evolucao do avatar.

## Bibliotecas recomendadas

Adicionar quando a fase exigir:

- `framer-motion`: motion declarativo, transicoes e celebracoes.
- `three`, `@react-three/fiber`, `@react-three/drei`: cenas 3D.
- `react-intersection-observer` ou APIs nativas: disparar animacoes sob demanda.
- `zustand` somente se houver estado client complexo; evitar antes disso.
- `next/dynamic`: lazy loading de cenas pesadas.

Manter:

- Tailwind CSS;
- lucide-react;
- shadcn-style primitives;
- Supabase;
- zod.

## Onde usar Framer Motion

- Landing: hero, cards de fases e preview da jornada.
- Dashboard aluno: entrada dos paineis, progresso e proxima missao.
- Jornada: desbloqueio de nos, hover de missao, transicao de fase.
- Missao aprovada: modal/toast de XP.
- Badges: reveal de conquista.

Nao usar em:

- Fila do professor, salvo microinteracoes discretas.
- Formularios criticos onde motion possa atrapalhar foco/validacao.

## Onde usar Three.js / React Three Fiber

Uso recomendado:

- Hero publico com cena leve ou avatar.
- Avatar no dashboard.
- Visual do laboratorio/portal.
- Boss Final como experiencia especial.

Regras:

- Sempre ter fallback estatico.
- Carregar com `dynamic(() => import(...), { ssr: false })`.
- Lazy load abaixo da dobra.
- Compactar GLB.
- Evitar cenas como dependencia de navegacao.
- Monitorar bundle e FPS em mobile.

## Assets 3D

Pipeline sugerido:

1. Escolher asset GLB/GLTF.
2. Otimizar em Blender.
3. Comprimir com Draco/Meshopt quando apropriado.
4. Salvar em `public/assets/3d/`.
5. Criar componente isolado em `src/components/3d/`.
6. Criar fallback PNG/WebP em `public/assets/images/`.
7. Medir tamanho final.

## Evolucao do banco

Sem quebrar o MVP, adicionar gradualmente:

- `journey_phases`: fases narrativas.
- `skills`: habilidades da skill tree.
- `mission_skills`: relacao missao/skill.
- `student_skills`: skills desbloqueadas.
- `student_badges`: badges concedidas.
- `journal_entries`: diario.
- `boss_projects`: projeto final.
- `boss_project_steps`: etapas do boss final.
- Campos extras em `missions`: dificuldade, tempo estimado, criterio de aceite e fase.

## Performance

Cuidados:

- Manter dados principais em Server Components.
- Isolar Client Components interativos.
- Usar `next/dynamic` para 3D/motion pesado.
- Gerar imagens otimizadas.
- Evitar background canvas em todas as paginas.
- Usar suspense/loading states.
- Respeitar `prefers-reduced-motion`.
- Testar mobile cedo.

## Riscos e mitigacoes

- Risco: escopo visual consumir tempo antes do dominio.
  Mitigacao: fases com criterios de aceite e entregas pequenas.

- Risco: 3D degradar performance.
  Mitigacao: fallback estatico, lazy loading e assets leves.

- Risco: gamificacao virar cosmetica.
  Mitigacao: badges/skills ligadas a entregas reais e criterios de aprendizagem.

- Risco: reescrever dashboard quebrando fluxos.
  Mitigacao: preservar server actions e contratos de dados; trocar UI em volta.

- Risco: conteudo insuficiente para sete fases.
  Mitigacao: criar primeiro o modelo editorial e seeds incrementais.

- Risco: ausencia de testes.
  Mitigacao: adicionar testes para regras de XP, status e guards antes de mexer no core.

