# 07 - Agent Execution Plan

## Objetivo

Este plano organiza a transformacao para execucao futura com multiplos agentes, preservando o MVP atual e reduzindo risco de mudancas concorrentes.

## Ordem recomendada

1. Product Vision Agent.
2. Learning Experience Agent.
3. Gamification Agent.
4. Frontend Architecture Agent.
5. UX/UI Agent.
6. Motion Design Agent.
7. 3D Asset Agent.
8. Visual Reviewer Agent.
9. QA/Validation Agent.
10. Code Review Agent.

## Protocolo de validacao obrigatorio

Para qualquer etapa visual, o orquestrador deve exigir:

- app rodando localmente;
- navegacao real nas rotas alteradas;
- screenshot desktop;
- screenshot mobile;
- revisao UX/UI baseada nesses prints;
- validacao QA dos fluxos tocados;
- rodada de correcao quando a revisao visual rejeitar ou aprovar com ressalvas graves.

Uma fase visual nao deve ser considerada concluida apenas porque `npm run build` passou.

Decisoes possiveis:

- `aprovado`: atende escopo, testes e visual.
- `aprovado com ressalvas`: pode seguir, mas ha melhorias documentadas.
- `rejeitado`: precisa de correcao antes da proxima fase.

## Product Vision Agent

Responsabilidade:

- Refinar posicionamento, promessa, nomenclatura das fases e narrativa de produto.

Entradas:

- `docs/product-evolution/02-new-product-vision.md`;
- `product/01-visao-do-produto.md`;
- `product/03-proposta-de-valor.md`;
- `docs/future-vision.md`.

Saidas:

- Copy final da landing.
- Nomes finais de fases, niveis e boss final.
- Regras de tom de voz.

Arquivos que deve alterar/criar:

- `docs/product-evolution/02-new-product-vision.md`;
- possivelmente `product/*`;
- briefing de copy para `src/app/page.tsx`.

Criterios de validacao:

- Proposta diferencia claramente curso tradicional e jornada gamificada.
- Linguagem e consistente com publico iniciante.
- Nao promete automacoes ainda inexistentes.

## UX/UI Agent

Responsabilidade:

- Desenhar a experiencia premium nas telas principais.

Entradas:

- `docs/product-evolution/04-visual-direction.md`;
- telas atuais em `src/app/page.tsx`, `src/app/aluno/page.tsx`, `src/app/aluno/missoes/page.tsx`, `src/app/aluno/perfil/page.tsx`.

Saidas:

- Componentes de landing, cockpit, mapa, perfil e cards.
- Sistema visual em Tailwind.

Arquivos que deve alterar/criar:

- `src/app/page.tsx`;
- `src/app/globals.css`;
- `tailwind.config.ts`;
- `src/components/marketing/*`;
- `src/components/game/*`.

Criterios de validacao:

- Primeira dobra comunica produto premium gamificado.
- Fluxos existentes continuam acessiveis.
- Layout responsivo sem clipping/overlap.

## Motion Design Agent

Responsabilidade:

- Criar animacoes de progressao, entrada, unlock e celebracao.

Entradas:

- `docs/product-evolution/04-visual-direction.md`;
- componentes criados pelo UX/UI Agent.

Saidas:

- Motion primitives.
- Animacoes de cards, XP, level up e badges.

Arquivos que deve alterar/criar:

- `package.json` para `framer-motion`;
- `src/components/motion/*`;
- componentes em `src/components/game/*`.

Criterios de validacao:

- Respeita `prefers-reduced-motion`.
- Nao prejudica formularios.
- Bundle e renderizacao continuam aceitaveis.

## 3D Asset Agent

Responsabilidade:

- Planejar e integrar assets 3D leves e com fallback.

Entradas:

- `docs/product-evolution/04-visual-direction.md`;
- `docs/product-evolution/05-technical-architecture-plan.md`.

Saidas:

- Pipeline de assets.
- Cenas 3D isoladas.
- Fallbacks estaticos.

Arquivos que deve alterar/criar:

- `package.json` para `three`, `@react-three/fiber`, `@react-three/drei`;
- `src/components/3d/*`;
- `public/assets/3d/*`;
- `public/assets/images/*`.

Criterios de validacao:

- 3D carrega sob demanda.
- Existe fallback.
- Cena nao aparece em branco em desktop/mobile.
- Tamanho dos assets e documentado.

## Frontend Architecture Agent

Responsabilidade:

- Estruturar componentes, dados e rotas sem quebrar o core.

Entradas:

- `docs/product-evolution/05-technical-architecture-plan.md`;
- `src/server/student-data.ts`;
- `src/server/content.ts`;
- `src/lib/auth/session.ts`;
- rotas atuais.

Saidas:

- Estrutura de componentes e server modules.
- Adaptadores de dados para progresso/fases.
- Plano de migrations quando necessario.

Arquivos que deve alterar/criar:

- `src/server/progression.ts`;
- `src/server/gamification.ts`;
- `src/components/game/*`;
- migrations em `database/migrations/*`.

Criterios de validacao:

- Server Components continuam buscando dados principais.
- Client Components ficam restritos a interacao visual.
- Autorizacao por perfil continua no servidor.

## Gamification Agent

Responsabilidade:

- Definir regras operacionais de fases, badges, skills, XP e desbloqueios.

Entradas:

- `docs/product-evolution/03-game-design-learning-journey.md`;
- `database/data-model.md`;
- `database/seeds/0001_seed.sql`;
- `src/server/reviews.ts`.

Saidas:

- Modelo de gamificacao.
- Regras de concessao.
- Seeds de badges/skills/fases.

Arquivos que deve alterar/criar:

- migrations em `database/migrations/*`;
- seeds em `database/seeds/*`;
- `src/server/gamification.ts`;
- componentes `BadgeWall`, `SkillTree`, `JourneyMap`.

Criterios de validacao:

- XP nao duplica.
- Badges/skills sao concedidos por eventos verificaveis.
- Regras sao testaveis e documentadas.

## Learning Experience Agent

Responsabilidade:

- Transformar a jornada educacional em missoes praticas e avaliaveis.

Entradas:

- `docs/product-evolution/03-game-design-learning-journey.md`;
- `database/seeds/0001_seed.sql`;
- `docs/05-jornada-do-aluno.md`;
- `docs/07-sistema-de-gamificacao.md`.

Saidas:

- Conteudo das sete fases.
- Criterios de avaliacao.
- Briefings para professor.

Arquivos que deve alterar/criar:

- seeds de conteudo;
- docs de rubrica;
- telas de detalhe de missao se novos campos forem exibidos.

Criterios de validacao:

- Cada missao tem objetivo, instrucao, entrega e criterio.
- Jornada leva ao Boss Final.
- Linguagem e adequada para iniciantes.

## QA/Validation Agent

Responsabilidade:

- Validar regras, regressao, acessibilidade e performance.

Entradas:

- Roadmap;
- diffs de implementacao;
- `docs/qa-plan.md`;
- regras criticas do README.

Saidas:

- Plano de testes.
- Relatorio de bugs/riscos.
- Checklist de aceite por fase.

Arquivos que deve alterar/criar:

- testes automatizados, se a stack for definida;
- `docs/qa-plan.md`;
- relatorios em `docs/product-evolution/`.

Criterios de validacao:

- Cadastro/login/onboarding continuam funcionando.
- Aluno nao acessa professor e vice-versa.
- Envio/reenvio/validacao/XP continuam corretos.
- UI responsiva e acessivel.
- Performance aceitavel em mobile.

## Visual Reviewer Agent

Responsabilidade:

- Validar screenshots e navegacao real das telas alteradas.
- Avaliar coerencia visual com a experiencia gamificada premium.
- Bloquear aceite quando a tela parecer apenas um dashboard generico ou quando houver desalinhamento claro de layout.

Entradas:

- `prompts/agents/visual-reviewer.md`;
- screenshots desktop/mobile;
- `docs/product-evolution/02-new-product-vision.md`;
- `docs/product-evolution/04-visual-direction.md`;
- escopo da fase.

Saidas:

- Decisao: aprovado, aprovado com ressalvas ou rejeitado.
- Lista priorizada de problemas visuais.
- Correcoes obrigatorias.
- Melhorias futuras.

Arquivos que deve alterar ou criar:

- Relatorio em `docs/product-evolution/visual-reviews/`, se o orquestrador pedir persistencia.
- Nao deve alterar codigo diretamente, a menos que esteja atuando tambem como UX/UI Agent.

Criterios de validacao:

- Screenshot desktop e mobile existem.
- Primeira dobra comunica a intencao da fase.
- Layout e profissional, responsivo e coerente.
- O shell, cards, tipografia, espacamento e narrativa visual trabalham juntos.
