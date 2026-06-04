# Fase: avatares 3D reais por variante — relatório de integração

Data: 2026-06-04 · Orquestração multi-agente (orchestrator, avatar-art-director,
glb-asset-engineer, tech-architect, claude-executor, avatar-integration-reviewer,
visual-reviewer, qa-tester, codex-reviewer)

## Decisão final: **APROVADO COM RESSALVAS**

Aurora, Brasa, Verdejante e Nebulosa aparecem com seus GLBs corretos; nenhuma
variante não-Aurora usa `avatar-aurora.glb`; evolução procedural intacta;
fallback 2D estável; preview validado em desktop e mobile; typecheck/lint/
testes/build verdes. Ressalvas documentadas abaixo.

## Escopo executado

1. Registry 3D agora resolve GLB por IDENTIDADE/variante (`AVATAR_MODELS` em
   `avatar-states.ts`): `aurora` → avatar-aurora.glb, `ember` → avatar-brasa.glb,
   `verdant` → avatar-verdejante.glb, `nebula` → avatar-nebulosa.glb.
2. Evolução por fase continua 100% procedural (`AVATAR_STATES`: anéis,
   partículas, cores, distorção, coroa). `AvatarStateConfig` perdeu `modelUrl`.
3. Preview `/preview/avatar-evolution` mostra as 4 identidades (seção própria,
   com arquivo e peso do GLB) + strip de 7 estados com seletor de variante
   (`?variant=`).
4. Fallback 2D (`AvatarFigure`) intacto, mesma dimensão, sem CLS; `?fallback=1`
   validado.
5. Rollback: entrada `null` em `AVATAR_MODELS` volta o núcleo procedural por
   variante (equivalente ao antigo `modelUrl=null`); `forceFallback` força o 2D.
6. **Não** integrado em cockpit/perfil (decisão de risco: GLBs intermediários).

## Descoberta crítica e correção de asset

Os GLBs intermediários de Brasa/Verdejante/Nebulosa eram **turnarounds Tripo
com 3 robôs em fileira** fundidos num único mesh pelo `gltf-transform optimize`
(o pipeline Blender da Aurora isolava o robô central; o pipeline intermediário
não). Detectado pela inspeção de bounding box (eixo longo Z ~0.98) e confirmado
visualmente no preview.

Correção: novo script `scripts/glb-isolate-center.mjs` (Node +
`@gltf-transform/core`, devDeps adicionadas) — recorta o terço central da
fileira por centroide de triângulo, recentra na origem e normaliza altura 1.0
no eixo Y (convenção da Aurora). Resultado:

| GLB | Antes | Depois | Tris | BBox |
|---|---|---|---|---|
| avatar-brasa.glb | 4,03 MB / 109,5k tris (3 robôs) | **1,48 MB / 37,5k tris** | -66% | X ±0,294 · Y ±0,500 · Z ±0,189 |
| avatar-verdejante.glb | 5,02 MB / 134,3k tris (3 robôs) | **1,89 MB / 47,2k tris** | -65% | X ±0,282 · Y ±0,500 · Z ±0,209 |
| avatar-nebulosa.glb | 4,25 MB / 116,2k tris (3 robôs) | **1,54 MB / 39,5k tris** | -64% | X ±0,273 · Y ±0,500 · Z ±0,210 |

Adendos registrados em `avatar-{brasa,verdejante,nebulosa}-glb.md`. Backup das
versões intermediárias em `%TEMP%\glb-backup-intermediate\`.

## Arquivos alterados/criados

- `src/components/three/avatar/avatar-states.ts` — `AVATAR_MODELS`
  (identidade → GLB com url/scale/rotation), `avatarModelForVariant`,
  `AvatarRenderConfig`; estados sem `modelUrl`.
- `src/components/three/avatar/avatar-model.tsx` — prop `rotation`.
- `src/components/three/avatar/procedural-avatar.tsx` — plug point via
  `config.model`.
- `src/components/three/avatar/avatar-canvas.tsx` — key light condicionada a
  `config.model`.
- `src/app/preview/avatar-evolution/page.tsx` — seção identidades + seletor de
  variante + ressalvas.
- `tests/avatar-states.test.ts` (novo) — 7 testes: mapeamento 1:1
  variante↔GLB, garantia anti-recolor (não-aurora nunca usa aurora.glb),
  invariância das camadas por fase, coroa exclusiva do Boss, clamp, fallback
  null.
- `scripts/glb-isolate-center.mjs` (novo) — pipeline de isolamento/normalização.
- `scripts/shoot-avatar-variants.mjs` (novo) — suíte de evidências visuais.
- `package.json` — devDeps `@gltf-transform/{core,functions,extensions}`.

## Validações automáticas

- `npm run typecheck` ✓ · `npm run lint` ✓ · `npm run test` ✓ (32 testes,
  7 arquivos) · `npm run build` ✓
- First Load JS de `/preview/avatar-evolution`: **117 kB** — Three.js em chunk
  lazy (`dynamic ssr:false`), GLBs são assets de runtime (nunca no bundle).
  Rotas vivas inalteradas; `EvolvingAvatar` só é consumido no preview (guardado
  por `notFound()` em produção).

## Evidências visuais (em `docs/product-evolution/visual-reviews/`)

- `phase-avatar-variants-desktop.png` / `-mobile.png` — 4 identidades + strip
  Aurora (1440px e 390px).
- `phase-avatar-variants-{ember,verdant,nebula}-desktop.png` — strip de 7
  estados por variante (camadas procedurais + coroa no Boss sobre cada GLB).
- `phase-avatar-variants-fallback-desktop.png` — fallback 2D íntegro, paletas
  por variante, mesma dimensão.
- `phase-avatar-variants-reduced-motion-desktop.png` — animação congelada, os 4
  modelos em repouso de frente para a câmera.
- `phase-avatar-variants-asset-error-desktop.png` — GLB da Brasa bloqueado:
  apenas o card afetado cai para o 2D via `SceneErrorBoundary`; página viva,
  demais cards 3D normais.

## Pareceres dos agentes

- **GLB Asset Engineer**: 4 GLBs válidos, WebP, sem DRACO/meshopt, sem
  animações; turnaround detectado e corrigido; pronto para preview.
- **Avatar Art Director**: *aprovado com ressalvas* — arquétipos respeitados,
  família coerente, silhuetas/geometrias distintas (não são recolors),
  legíveis em 150px; visores sem canal emissivo (mesma ressalva da Aurora).
- **Avatar Integration Reviewer**: *aprovado com ressalvas* — checklist
  completo OK; ressalva de equalização de escala foi reavaliada com capturas em
  reduced motion (alturas equalizadas; a percepção veio de capturas mid-spin) e
  ressalva de peso mantida.
- **Visual Reviewer**: *aprovado* — hierarquia clara, identidades distintas e
  premium, mobile legível sem clipping/overflow.
- **QA Tester**: *pronto* — preview navegável, estados validados (3D, fallback,
  reduced motion, erro de asset), validações automáticas verdes, sem toque em
  auth/XP/banco/review/submissões.
- **Codex Reviewer**: *aceite com ressalvas* — núcleo correto e testado; P2s
  do script aplicados (guard de índices, `getMin`/`getMax`, faixa de pesos no
  comentário); P1 de fronteira de commit registrado abaixo.

## Ressalvas e riscos remanescentes

1. **Produção mobile**: Brasa (37,5k), Verdejante (47,2k) e Nebulosa (39,5k
   tris) seguem acima do alvo 15k-30k. Válidos para preview/validação. Antes de
   plugar em cockpit/perfil: nova passada no Blender
   (`scripts/blender_optimize_avatar.py`) partindo dos sources em Downloads.
2. **Fronteira de commit (P1 do Codex)**: a working tree contém mudanças de
   outra frente (`src/app/page.tsx` HeroAgentCore, `src/app/professor/layout.tsx`
   TeacherGameShell, fase 7B) que **não** fazem parte desta fase — commitar
   separadamente.
3. Visores sem canal emissivo (brilho vem do baseColor + luzes); marcar
   materiais emissivos no Blender em rodada futura de polish.
4. `.next` compartilhado: não rodar `next build` com o dev server ativo
   (corrompe os assets do dev — observado e contornado nesta fase).
5. GLBs (~5,7 MB somados) entrarão no Git ao commitar `public/`; avaliar LFS no
   futuro se o volume de assets crescer.

## Rollbacks disponíveis

- Por variante: `AVATAR_MODELS[variante] = null` → núcleo procedural.
- Global de UX: `?fallback=1` / `forceFallback` → `AvatarFigure` 2D.
- Por asset: restaurar GLB intermediário do backup e reprocessar.
