# Fase 4 — Avatar e Progressao — Relatorio de Orquestracao

Data: 2026-05-31
Rotas tocadas: `/aluno/perfil` (identidade), `/aluno` (avatar evolutivo + celebracao de level up), shell do aluno.
Banco: projeto `gvivzcajymwhljvjrjoq` — migration `0006_avatar` aplicada.
Evidencias visuais: `/preview/perfil`, `/preview/levelup`, `/preview/cockpit`.

## Escopo declarado

- Criar avatar evolutivo (2D) que reflete nivel/fase, com fallback estavel (sem 3D).
- Transformar `/aluno/perfil` em identidade de jornada.
- Persistir customizacao do avatar (variante de cor) no banco.
- Criar celebracao de level up.

## Fora de escopo (nao alterado)

- XP, `review_submission`, `level_for_xp`, submissoes, feedback, auth.
- Conteudo das fases/missoes (Fase 5).
- 3D real (Fase 7).

## Agentes acionados

1. **Product Vision** — o perfil deve dizer "este sou eu nesta jornada": avatar evolutivo, classe (titulo de nivel), fase e progresso. Avatar e honesto (2D, derivado do progresso real); a variante e so estetica e nao promete poderes.
2. **Tech Architect** — autorizada mudanca de banco ADITIVA: enum `avatar_variant` + coluna `student_profiles.avatar_variant` (default `'aurora'`, backfill automatico). A evolucao do avatar e derivada em render (sem persistencia extra). Server action valida com zod e escreve apenas no proprio perfil via service role apos guard. Nada toca XP/review.
3. **UX Gamification** — criterios: avatar deve parecer identidade intencional (anel de progresso, icone de fase, badge de nivel), nao icone solto; perfil deve liderar pela identidade; level up deve ser uma recompensa clara e dispensavel. Rejeitaria se o perfil voltasse a ser "lista de dados".
4. **Claude Executor** — implementou migration, tipos, server action, componentes e testes.
5. **Visual Reviewer** — analisou screenshots desktop/mobile (decisao abaixo).
6. **QA Tester** — validou regressao e persistencia (abaixo).
7. **Codex Reviewer** — verificou escopo aditivo, validacao de input, ausencia de regressao, testes e evidencia visual.

## Arquivos alterados / criados

- `database/migrations/0006_avatar.sql` — enum + coluna `avatar_variant`.
- `src/lib/database.types.ts` — `AvatarVariant` + campo em `StudentProfileRow`.
- `src/lib/domain.ts` — labels/options de variante.
- `src/lib/avatar.ts` — `AVATAR_VARIANTS`, `isAvatarVariant`, `shouldCelebrateLevelUp` (puros).
- `tests/avatar.test.ts` — 4 testes.
- `src/server/avatar.ts` — `updateAvatarVariantAction` (zod + guard + service role).
- `src/components/game/journey-phases.ts` — metadata das 7 fases (compartilhada cockpit/avatar).
- `src/components/game/avatar-figure.tsx` — avatar evolutivo (anel, aura, icone de fase, badge) por variante e tamanho.
- `src/components/game/avatar-picker.tsx` — seletor de variante (client, server action).
- `src/components/game/level-up-celebration.tsx` — celebracao client-side autocontida.
- `src/components/game/profile-view.tsx` — perfil como identidade (presentacional, com slots).
- `src/components/game/student-cockpit.tsx` — usa `AvatarFigure` + variante + celebracao.
- `src/app/aluno/page.tsx`, `src/app/aluno/perfil/page.tsx` — montam VM e delegam.
- `src/app/preview/{perfil,levelup}/page.tsx` — previews; `scripts/shoot.mjs` atualizado.
- `database/data-model.md` — documentado o campo.

## Validacao automatica

- `npm run test` — 22/22 passam (5 arquivos; +4 testes de avatar).
- `npm run typecheck` — sem erros.
- `npm run lint` — sem warnings/erros.
- `npm run build` — sucesso (previews tornadas `force-dynamic` para reduzir pressao de memoria do worker de geracao estatica neste ambiente).

## Aplicacao no banco (Supabase real) e verificacao

- Migration `0006` aplicada via MCP — `{"success":true}`.
- Verificado: enum `avatar_variant` = (aurora, ember, verdant, nebula); coluna com default `'aurora'::avatar_variant`; 0 perfis com valor nulo (backfill ok).
- Regressao: nenhuma alteracao em XP/review/submissoes; nada removido.

## Evidencias visuais

- `phase-4-perfil-desktop.png` / `phase-4-perfil-mobile.png` — 1440x900 / 390x844.
- `phase-4-levelup-desktop.png` / `phase-4-levelup-mobile.png`.
- `phase-2.1-cockpit-*` recapturados com `AvatarFigure`.

## Parecer Visual Reviewer

Decisao: **Aprovado**.

- Perfil agora lidera por identidade: avatar grande com anel de progresso, icone de fase e badge de nivel; nome, classe (titulo do nivel), fase, barra de XP e chips de estatistica.
- Seletor "Estilo do avatar" com 4 variantes (Aurora/Brasa/Verdejante/Nebulosa) claro e com selecao destacada.
- Celebracao de level up: modal premium com glow, "Nivel N", titulo da classe e CTA; dispensavel.
- Cockpit reflete a variante escolhida (verificado com `nebula`).
- Desktop e mobile sem overflow/clipping.

Ressalvas (nao bloqueantes): avatar e 2D por design (3D fica para Fase 7); variantes sao livres (sem unlock por conquista — desbloqueio cosmetico por badge fica para fase futura).

## Parecer QA

- XP/review/submissoes/auth intactos (migration so adiciona coluna; verificado no banco).
- Variante persiste por aluno; `updateAvatarVariantAction` valida input e usa o guard de aluno (nao permite editar outro perfil).
- Celebracao nao dispara no primeiro acesso (sem referencia anterior) e dispara uma unica vez ao subir de nivel; respeita `prefers-reduced-motion` (`motion-reduce:animate-none`).

## Riscos remanescentes

- Validacao autenticada real do perfil depende de conta de aluno no Supabase; validada via preview + verificacao do schema.
- Persistencia do "ultimo nivel visto" para a celebracao e por dispositivo (localStorage), nao por conta — aceitavel para uma celebracao.

## Decisao da fase

**Aprovado.** Pronto para a Fase 5 (jornada educacional completa — conteudo das fases) e, depois, Fase 6 (Boss Final) e Fase 7 (motion/3D).
