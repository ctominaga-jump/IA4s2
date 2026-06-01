# 01 - Current State Audit

## Resumo executivo

A aplicacao atual e um MVP funcional de ensino pratico com apoio de IA. Ela ja possui autenticacao, perfis de aluno/professor, onboarding com objetivo real, missoes publicadas, entregas textuais, feedback humano, XP, niveis e painel do professor. A base de produto esta bem alinhada com "aprender fazendo", mas a experiencia ainda parece um portal educacional enxuto, nao uma experiencia premium de evolucao em IA.

O maior ativo reaproveitavel e o fluxo completo aluno -> entrega -> validacao -> XP. A maior lacuna e a camada de experiencia: narrativa, identidade visual, mapa de jornada, avatar, badges operacionais, skill tree, boss final, motion e 3D.

## Stack atual

- Framework: Next.js 15.1.4 com App Router, React 19 e TypeScript.
- UI: Tailwind CSS 3.4, componentes locais no estilo shadcn/ui, `lucide-react`, `class-variance-authority`, `tailwind-merge` e `tailwindcss-animate`.
- Backend: Server Components e Server Actions em Next.js.
- Banco/API: Supabase Auth, Supabase Postgres e Supabase JS, com `@supabase/ssr` e service role no servidor.
- Validacao: `zod` em formularios e server actions.
- Deploy previsto: Vercel, conforme `README.md`.
- Ausentes hoje: Framer Motion, Three.js, React Three Fiber, Drei, sistema de assets 3D, editor/admin de conteudo, testes automatizados visiveis no repo.

## Estrutura de pastas

- `src/app/page.tsx`: landing page publica.
- `src/app/(auth)/`: login, cadastro e actions de autenticacao.
- `src/app/onboarding/`: coleta do objetivo real do aluno.
- `src/app/aluno/`: dashboard, jornada, detalhe de missao e perfil/progresso.
- `src/app/professor/`: dashboard, fila de validacao e detalhe de entrega.
- `src/components/`: AppShell, cards, badges, progresso, empty states e primitives de UI.
- `src/server/`: consultas e server actions de dominio.
- `src/lib/`: tipos, Supabase clients, guards de sessao, utilitarios e constantes de dominio.
- `database/migrations/`: schema SQL, RLS, funcoes e hardening.
- `database/seeds/0001_seed.sql`: conteudo inicial com niveis, curso, modulo e cinco missoes.
- `docs/`, `product/` e `prompts/agents/`: documentacao de produto, planejamento e prompts de agentes.

## Rotas e telas existentes

- `/`: landing simples com proposta "Aprenda fazendo", CTA para cadastro/login e quatro cards explicativos.
- `/cadastro` e `/login`: autenticacao via Supabase.
- `/onboarding`: formulario para objetivo real, categoria e nivel declarado.
- `/aluno`: dashboard com objetivo, proxima acao, contadores de missoes, progresso e feedback recente.
- `/aluno/missoes`: lista linear da jornada com status e XP por missao.
- `/aluno/missoes/[missionId]`: detalhe da missao, objetivo, instrucoes, entrega textual, feedback e status.
- `/aluno/perfil`: dados do usuario, objetivo, missoes aprovadas/em andamento e progresso de nivel.
- `/professor`: dashboard com metricas de entregas e recentes.
- `/professor/fila`: fila filtravel por status.
- `/professor/entregas/[submissionId]`: detalhe da entrega, contexto da missao, historico e formulario de avaliacao.

## Componentes principais

- `src/components/app-shell.tsx`: layout autenticado compartilhado por aluno e professor.
- `src/components/level-progress.tsx`: exibicao de XP, nivel atual e progresso para o proximo nivel.
- `src/components/goal-card.tsx`: objetivo real do aluno.
- `src/components/status-badge.tsx`: status de missao e entrega.
- `src/components/empty-state.tsx`: estados vazios.
- `src/components/ui/*`: primitives de botao, card, input, textarea, alert, badge e label.

## Modelo de dados e dominio

O modelo atual cobre:

- `users`, `student_profiles`, `teacher_profiles`;
- `learning_goals`;
- `courses`, `modules`, `missions`;
- `submissions`, `feedback`;
- `xp_transactions`, `levels`;
- `badges`, apenas como estrutura futura.

Pontos fortes do dominio:

- XP e nivel sao persistidos no banco.
- A aprovacao usa RPC atomica `review_submission`, evitando duplicidade de XP.
- RLS esta habilitado e o acesso de dominio passa por service role apos validacao de perfil no servidor.
- O seed inicial permite testar o ciclo completo sem admin.

## Experiencia atual

A experiencia atual comunica praticidade, clareza e acompanhamento humano. O aluno sabe qual e a proxima acao, ve progresso, recebe feedback e acumula XP.

Ela ainda nao comunica uma "academia futurista de agentes" ou "RPG de evolucao". A jornada aparece como lista linear; o dashboard e um painel funcional; a landing e institucional; o perfil nao tem avatar; badges nao aparecem; nao ha mapa, skill tree, diario de bordo, boss final ou celebracoes de progresso.

## Pontos fortes

- Fluxo MVP completo e coerente.
- Separacao limpa entre aluno e professor.
- Server-side-first, com pouca superficie de dados no browser.
- Regras criticas de XP e feedback bem protegidas no servidor/banco.
- Conteudo inicial idempotente em `database/seeds/0001_seed.sql`.
- Documentacao de produto ja existente em `docs/` e `product/`.

## Pontos fracos

- Visual ainda generico de dashboard SaaS/curso.
- Gamificacao limitada a XP, niveis e status.
- Conteudo atual tem apenas um modulo e cinco missoes, distante das sete fases da nova visao.
- `Badge` existe no modelo, mas nao tem concessao, UI ou regras.
- Nao ha avatar, inventario, skill tree, mapa de jornada ou diario.
- Nao ha Framer Motion/Three.js nem estrategia de assets.
- Nao ha painel administrativo para criar cursos, modulos, missoes, fases ou boss final.
- Alguns textos exibidos/arquivos mostram problemas de encoding em acentos, ex.: README e strings com `â€”`.

## Divida tecnica e riscos

- O conteudo publicado e resolvido como uma lista unica em `src/server/content.ts`; uma experiencia com fases e boss final exigira hierarquia mais rica.
- `getStudentMissionData` agrega estado em memoria; funciona no MVP, mas pode precisar de queries/RPCs especificas com volume maior.
- O uso de service role e seguro pelo guard atual, mas aumenta responsabilidade de manter toda autorizacao no servidor.
- O AppShell atual e compartilhado por aluno/professor; uma transformacao visual profunda pode exigir layout de aluno mais imersivo sem afetar professor.
- A estrutura de badges esta incompleta para gamificacao operacional.
- Sem testes automatizados, mudancas em XP, submissao e validacao exigem cautela extra.

## Oportunidades de reaproveitamento

- Reusar `missions.xp_reward`, `submissions`, `feedback` e `xp_transactions` como base do loop de jogo.
- Reusar `levels` como ponto de partida para classes/titulos da jornada.
- Reusar `learning_goals` como "contrato de jornada" do aluno.
- Evoluir `Badge` para conquistas reais com tabela de concessao.
- Reaproveitar `AppShell` como base para professor e criar um shell separado premium para aluno.
- Reaproveitar `src/app/aluno/missoes/[missionId]/page.tsx` como base da tela de missao, adicionando narrativa, checklist e criterio de aceite.
- Reaproveitar a fila do professor como "central de validacao de missoes".

## Lacunas frente a nova visao

- Falta reposicionamento de marca: de "portal de autonomia pratica" para "jornada premium de evolucao em IA".
- Falta narrativa por fases: Despertar, Explorador, Estrategista, Criador, Operador, Arquiteto de IA e Boss Final.
- Falta mapa visual da jornada e progressao bloqueada/desbloqueada.
- Falta avatar evolutivo e identidade do aluno.
- Falta skill tree com habilidades praticas de IA.
- Falta sistema operacional de badges/conquistas.
- Falta diario de bordo para reflexao e portfolio.
- Falta boss final/TCC com estrutura de problema, solucao, arquitetura, prototipo e validacao.
- Falta direcao visual premium, motion e 3D.

