# 11 - Phase 7A Motion Scope

Fase 7 dividida. **7A = Motion** (framer-motion). 3D fica para 7B e **não** é iniciado aqui.

## Product Owner (parecer)

- Intenção: dar acabamento premium/gamificado por **movimento**, sem mudar o que o
  produto faz. Motion reforça a leitura de "jornada/RPG de evolução", não adiciona
  funcionalidade.
- O que cada tela precisa comunicar continua igual; motion só dá ritmo, foco e
  recompensa percebida (entrada da landing, hover de missão, celebração de XP/level-up).
- Risco de promessa exagerada: nenhuma copy nova, nenhum recurso novo. Sem ranking,
  streak, certificados, comunidade. Sem alterar XP/regras.
- Aceite de produto: a animação ajuda a entender a próxima ação e a sensação de
  progresso; nunca atrapalha leitura ou formulário.

## Tech Architect (boundaries)

- Instalar somente `framer-motion`. **Não** instalar three / @react-three/*.
- Server Components permanecem server (landing `page.tsx`, cockpit, journey-board).
  Motion entra via **wrappers client isolados** em `src/components/motion/*`; o conteúdo
  (dados) continua renderizado no servidor e passa como `children`.
- Não tocar: `src/server/*`, `src/lib/auth/*`, `src/lib/progression.ts`,
  `src/server/reviews.ts`, banco, migrations, fluxo de submissão/review, Boss Final.
- `prefers-reduced-motion` é obrigatório: toda primitive consulta `useReducedMotion()`
  e degrada para opacidade simples ou estado final imediato.
- Conteúdo sempre presente no DOM (acessibilidade/SEO): animações só afetam
  opacity/transform, nunca removem conteúdo. Above-the-fold usa entrada on-mount;
  below-the-fold usa `whileInView` com `once`.
- Bundle: framer-motion é client-only e tree-shakeable; impacto restrito às telas do
  aluno e landing. Sem libs extras de confete/parallax.

## UX/Gamification (spec de motion)

| Local | Motion | Reduced-motion |
|---|---|---|
| Landing hero | entrada fade/slide on-mount; cockpit ilustrativo com float sutil | só fade |
| Landing 7 fases | stagger em viewport | fade simples |
| Landing pilares + CTA Boss | stagger/reveal em viewport | fade simples |
| Cockpit (seções) | reveal/stagger on-mount; barras de XP animam o preenchimento | sem transform; barra estática |
| Cards de missão (jornada) | hover/tap lift + stagger de entrada | sem lift; fade |
| XP/level-up | pop com spring + brilho; barra anima | aparece sem spring |
| Unlocks/badges | pop de entrada | fade |
| Transição leve de página (aluno) | fade curto ao navegar (`template.tsx`) | instantâneo |

Critérios de rejeição visual: animação que esconde conteúdo, "pula" layout (CLS),
atrapalha formulário, ou ignora reduced-motion.

## Evidências obrigatórias

screenshots desktop+mobile (landing `/`, cockpit `/preview/cockpit`, jornada
`/preview/jornada`, level-up `/preview/levelup`), typecheck, lint, test, build,
parecer Visual Reviewer, parecer QA, decisão do Orchestrator.
