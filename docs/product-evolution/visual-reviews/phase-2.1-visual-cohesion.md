# Fase 2.1 — Visual Cohesion Pass — Relatorio de Orquestracao

Data: 2026-05-31
Rotas tocadas: `/aluno` (cockpit), shell de toda a area do aluno (`/aluno`, `/aluno/missoes`, `/aluno/perfil`).
Evidencias visuais: rota de preview sem auth `/preview/cockpit`.

## Escopo declarado

- Integrar visualmente a area do aluno (shell + cockpit + telas existentes).
- Criar `StudentGameShell` premium escuro.
- Reduzir peso/altura do cockpit.
- Mapa compacto -> mapa conectado por fases (progressao real).
- Avatar como identidade visual (sem 3D real ainda).
- Manter dados e regras existentes.

## Fora de escopo (nao alterado)

- Banco, migrations, RLS.
- XP, `review_submission`, submissoes, feedback.
- Autenticacao e guards de sessao.
- Conteudo/estrutura das telas de jornada e perfil (Fases 3 e 4).
- `AppShell` do professor (intacto) e landing publica.

## Agentes acionados

1. **Product Vision** — confirmou a intencao: o cockpit deve comunicar "estou em uma jornada gamificada de IA, com progresso visivel e proxima acao clara", sem prometer 3D/automacoes inexistentes. Risco de promessa exagerada mitigado: avatar e mapa sao representacoes 2D honestas do progresso real (XP/missoes), nao mockups de features futuras.
2. **Tech Architect** — boundaries: nenhuma mudanca de banco; o tema escuro foi aplicado via override de variaveis CSS escopadas (`.theme-game`), reaproveitando os componentes existentes; a logica de dados permaneceu em Server Components, com a UI extraida para um componente presentacional puro (`StudentCockpit`) alimentado por um view model. Auth/XP/review nao tocados.
3. **UX Gamification** — criterios: primeira dobra deve comunicar jornada em <5s; proxima acao (missao ativa) sempre visivel; mapa deve parecer trilha, nao fila de labels; avatar deve ser identidade, nao icone solto. Rejeitaria se o shell continuasse claro sobre conteudo escuro, hero alto demais ou mapa sem conexao visual.
4. **Claude Executor** — implementou a menor mudanca coerente (ver "Arquivos alterados").
5. **Visual Reviewer** — analisou screenshots desktop/mobile (ver decisao abaixo).
6. **QA Tester** — validou rota real e regressao (ver abaixo).
7. **Codex Reviewer** — verificou escopo, ausencia de regressao em XP/auth e presenca de evidencia visual.

## Arquivos alterados / criados

- `src/app/globals.css` — adicionado tema `.theme-game` (paleta premium escura via variaveis CSS).
- `src/components/game/student-game-shell.tsx` — novo shell escuro (canvas ambiente + header premium).
- `src/components/game/student-nav.tsx` — navegacao com estado ativo.
- `src/components/game/student-cockpit.tsx` — cockpit presentacional puro (hero compacto, avatar com anel de progresso, mapa conectado, quest ativa, status, mentor).
- `src/app/aluno/page.tsx` — passou a montar o view model e delegar ao `StudentCockpit`.
- `src/app/aluno/layout.tsx` — passou a usar `StudentGameShell`.
- `src/app/preview/cockpit/page.tsx` — rota de preview sem auth para validacao visual (bloqueada em producao).
- `scripts/shoot-cockpit.mjs` — script Playwright de captura de screenshots.
- `package.json` — `playwright` como devDependency (ferramenta de validacao visual).

## Validacao automatica

- `npm run test` — 12/12 passam (3 arquivos).
- `npm run typecheck` — sem erros.
- `npm run lint` — sem warnings/erros.
- `npm run build` — sucesso; `/preview/cockpit` gerada (static), demais rotas dinamicas inalteradas.

## Evidencias visuais

- `phase-2.1-cockpit-desktop.png` — 1440x900.
- `phase-2.1-cockpit-mobile.png` — 390x844.
- Verificacao funcional: `GET /aluno` -> 307 para `/login?redirectTo=/aluno` (guard de auth intacto); `GET /preview/cockpit` -> 200; sem erros no log do dev.

## Parecer Visual Reviewer

Decisao: **Aprovado com ressalvas (aceitaveis)**.

Resolvido frente as ressalvas anteriores:
- Shell agora e escuro premium e integrado ao conteudo (acabou o contraste shell-claro/conteudo-escuro).
- Hero teve altura/peso reduzidos: virou faixa compacta com metricas inline.
- Mapa virou trilha conectada com nos por estado (concluido/ativo/bloqueado) e Boss Final como climax — le-se como progressao real.
- Avatar ganhou anel de progresso, aura, icone de fase, badge de nivel e titulo de classe — identidade intencional.
- Composicao geral coerente: paineis, glow controlado e acentos consistentes.

Ressalvas remanescentes (nao bloqueantes, para fases futuras):
- Avatar ainda e 2D/icone — evolucao real prevista para Fase 4/7.
- No mobile, a faixa de 3 metricas do hero fica levemente densa; aceitavel, sem clipping.
- `/aluno/missoes` e `/aluno/perfil` herdaram o tema escuro (coerentes), mas seu **layout** so sera reestruturado nas Fases 3 e 4.

## Parecer QA

- Fluxo de auth preserado: area do aluno continua protegida (redirect para login).
- Sem regressao em XP/review/submissoes (nenhum desses caminhos foi tocado; testes de progressao e review seguem verdes).
- Responsividade desktop/mobile sem overflow/clipping/CTA inacessivel nas evidencias.
- Limitacao de ambiente: navegacao autenticada em `/aluno` nao pode ser exercida sem um usuario aluno valido no Supabase; a validacao visual foi feita via rota de preview equivalente (mesmos componentes). Documentado como dependencia de credenciais.

## Riscos remanescentes

- Validacao visual usa dados ficticios (preview); recomenda-se uma passada com conta real quando houver seed/credenciais de aluno.
- Tema escuro escopado depende de os novos conteudos das Fases 3/4 usarem as variaveis/componentes padrao para manter coerencia.

## Decisao da fase

**Aprovado com ressalvas aceitaveis.** Pode-se avancar para a Fase 3 (jornada/missoes como mapa gamificado), que naturalmente reestrutura `/aluno/missoes` sobre a base escura ja coerente.
