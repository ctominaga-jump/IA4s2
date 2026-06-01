# Fase 3 — Jornada/Missoes como Mapa Gamificado — Relatorio de Orquestracao

Data: 2026-05-31
Rotas tocadas: `/aluno/missoes` (mapa de jornada), `/aluno/missoes/[missionId]` (atributos de quest).
Banco: projeto Supabase `gvivzcajymwhljvjrjoq` — migration `0005` + seed de fases aplicados.
Evidencias visuais: rota de preview sem auth `/preview/jornada`.

## Escopo declarado

- Evoluir missoes de lista linear para quests com fases, criterios e recompensas.
- Adicionar as 7 fases da jornada (Despertar -> Boss Final).
- Associar missoes a fases; exibir dificuldade, tempo estimado e criterio de aceite.
- Transformar `/aluno/missoes` em mapa/timeline acessivel.
- Atualizar seed com missoes por fase.

## Fora de escopo (nao alterado)

- XP, `review_submission`, `level_for_xp`, submissoes, feedback, auth.
- Conteudo textual das missoes existentes (apenas enriquecido com atributos).
- Cockpit da Fase 2.1 (inalterado).

## Agentes acionados

1. **Product Vision** — a jornada deve comunicar "uma trilha epica de 7 fases ate o Boss Final", com recompensa e criterio claros por missao, sem prometer conteudo inexistente (fases 5-7 aparecem honestamente como "em breve").
2. **Tech Architect** — autorizada mudanca de banco ADITIVA: nova tabela `journey_phases` + colunas opcionais/`default` em `missions`. Nada que afete a RPC de XP (depende so de `xp_reward`). RLS da nova tabela segue a estrategia existente (sem policies, service role). Logica de agrupamento extraida para funcao pura testavel.
3. **UX Gamification** — criterios: a tela deve parecer progressao real (trilho conectado, estados por fase), nao lista; cada missao mostra status, dificuldade, tempo e XP; Boss Final como clamax. Rejeitaria se voltasse a parecer lista de cards uniformes.
4. **Claude Executor** — implementou migration, seed, tipos, server, UI e testes (ver arquivos).
5. **Visual Reviewer** — analisou screenshots desktop/mobile (decisao abaixo).
6. **QA Tester** — validou regressao de XP/review/auth e dados (abaixo).
7. **Codex Reviewer** — verificou escopo aditivo, idempotencia das migrations, ausencia de regressao e presenca de testes + evidencia visual.

## Arquivos alterados / criados

- `database/migrations/0005_journey_phases.sql` — nova tabela + colunas de quest (aditivo, idempotente).
- `database/seeds/0002_journey_phases.sql` — 7 fases + associacao das 5 missoes.
- `src/lib/database.types.ts` — `JourneyPhaseRow`, `MissionDifficulty`, novas colunas em `MissionRow`, tabela `journey_phases`.
- `src/lib/domain.ts` — labels/variants de dificuldade.
- `src/lib/journey.ts` — `buildJourneyMap` (funcao pura de agrupamento/estado por fase).
- `tests/journey.test.ts` — 6 testes da nova logica.
- `src/server/content.ts` — `getJourneyPhases()`.
- `src/app/aluno/missoes/page.tsx` — monta VM e delega ao `JourneyBoard`.
- `src/components/game/journey-board.tsx` — mapa/timeline premium de fases.
- `src/app/aluno/missoes/[missionId]/page.tsx` — exibe dificuldade, tempo e criterio de aceite.
- `src/app/preview/jornada/page.tsx` — preview sem auth para screenshot.
- `scripts/shoot.mjs` — script de screenshots (cockpit + jornada).
- `database/data-model.md` — documentadas as novas entidades.

## Validacao automatica

- `npm run test` — 18/18 passam (4 arquivos; +6 testes de jornada).
- `npm run typecheck` — sem erros.
- `npm run lint` — sem warnings/erros.
- `npm run build` — sucesso; `/preview/jornada` gerada.

## Aplicacao no banco (Supabase real) e verificacao

- Migration `0005` aplicada via MCP (apply_migration) — `{"success":true}`.
- Seed aplicado via execute_sql.
- Verificado: 7 fases criadas; missoes associadas — Despertar(1), Explorador(2), Estrategista(1), Criador(1), Operador/Arquiteto/Boss(0); dificuldade/tempo corretos.
- Regressao: `review_submission` e `level_for_xp` presentes; `xp_reward` das missoes inalterado (50/60/70/80/100); nenhuma submissao/transacao afetada.
- Advisors de seguranca: apenas `rls_enabled_no_policy` (INFO) — padrao intencional do projeto, ja presente em todas as tabelas; `journey_phases` segue o mesmo padrao. Nenhuma nova vulnerabilidade.

## Evidencias visuais

- `phase-3-jornada-desktop.png` — 1440x900.
- `phase-3-jornada-mobile.png` — 390x844.

## Parecer Visual Reviewer

Decisao: **Aprovado**.

- `/aluno/missoes` agora e uma timeline vertical conectada com estacoes por fase: no de fase colorido por estado (concluida/ativa/bloqueada/em breve), trilho ligando as fases, e missoes como nos com status, dificuldade, tempo e XP.
- Boss Final aparece como estacao especial (coroa) e clamax da trilha.
- Le-se como progressao real, nao lista uniforme. Coerente com o shell escuro premium da Fase 2.1.
- Desktop e mobile sem overflow/clipping; mobile mantem a leitura da trilha.

Ressalvas (nao bloqueantes): fases 5-7 ainda sem conteudo (previsto Fase 5/6); gating e visual, sem unlock funcional ainda (sem regressao de acesso).

## Parecer QA

- XP/review/submissoes/auth intactos (verificado no banco real).
- Detalhe da missao exibe os novos atributos sem quebrar o fluxo de envio/reenvio.
- Migration idempotente (guards IF NOT EXISTS / DO blocks) e seed idempotente (ON CONFLICT) — re-execucao segura.

## Riscos remanescentes

- Validacao da rota autenticada `/aluno/missoes` real depende de uma conta de aluno no Supabase; foi validada via preview equivalente + verificacao direta dos dados no banco.
- `src/lib/database.types.ts` e mantido manualmente; mudancas futuras de schema exigem manter o arquivo em sincronia (ou gerar via `supabase gen types`).

## Decisao da fase

**Aprovado.** Base pronta para a Fase 4 (avatar e progressao) e Fase 5 (conteudo completo das fases).
