# 13 - Plano: Assets 3D reais (avatares de evolução)

> **Atualização (2026-06-02): Ready Player Me descontinuado (31/01/2026).**
> **Não seguimos com RPM** — sem integração, sem SDK e **sem URLs de placeholder do RPM**.
> O pipeline continua **plugável** (o plug point `modelUrl` aceita qualquer GLB). O avatar
> base passa a ser **GLB próprio/licenciado** de uma fonte estável a definir, ou
> **procedural/híbrido interno** até essa fonte ser escolhida. Onde o texto abaixo cita "RPM",
> leia "GLB próprio/licenciado de fonte estável".

Decisão do usuário (2026-06-01): evoluir para assets reais nos **avatares de evolução do
curso**, em modo **híbrido** — avatar **base** vindo de um **GLB próprio/licenciado** (fonte
estável a definir), mas a **evolução dos 7 estados vem primeiro por camadas procedurais** (aura,
anéis, partículas, cores, badges, props). O **hero da landing permanece procedural** por ora.

Esta rodada entrega **infraestrutura plugável + plano + previews**, **sem baixar nenhum asset
externo e sem placeholder público**. O produto continua funcional;
os assets reais (GLBs próprios/licenciados) são plugados depois.

> Restrição explícita: o GLB de canguru usado em teste isolado **não** entra no produto. (Confirmado:
> não há nenhum `.glb/.gltf/.hdr/.fbx` no repositório nesta data.)

## 1. Objetivo e não-objetivos

**Objetivo:** um sistema de avatar 3D evolutivo cujo *envelope* (carregamento, fallback, perf,
reduced-motion) é o mesmo já validado em 7B-spike/7B-final, com a evolução dos 7 estados
implementada por **camadas procedurais** e um **plug point** documentado para um modelo base
GLB/RPM no centro.

**Não-objetivos desta rodada:**
- Não instalar SDK/deps de Ready Player Me.
- Não baixar/commitar GLB/HDR nem usar avatar RPM público de teste.
- Não trocar 3D no hero da landing (segue procedural v1).
- Não integrar ainda na tela viva do cockpit/perfil — entrega via **preview**, com swap documentado.
- Não tocar auth, XP, `src/server/*`, review, Boss Final, banco.

## 2. Arquitetura (camadas)

```
EvolvingAvatar (API pública, client)
 ├─ dynamic(ssr:false) ──> AvatarCanvas (um <Canvas> R3F)
 │                           └─ ProceduralAvatar (scene-graph)
 │                                ├─ Núcleo:  modelUrl ? <AvatarModel url> : <ProceduralCore>
 │                                │            (AvatarModel = useGLTF + <Suspense>) ← PLUG POINT
 │                                └─ Camadas procedurais por estado:
 │                                     aura · anéis orbitais · partículas · cor · props (coroa)
 ├─ mount-on-visible (useInViewport)         → não baixa o chunk até aparecer
 ├─ SceneErrorBoundary (sem WebGL/erro)      → fallback
 ├─ fallback = <AvatarFigure> (2D SVG atual) → mesma dimensão, já no produto
 └─ forceFallback / prefers-reduced-motion   → estático
```

Reaproveita os utilitários já validados: `use-in-viewport.ts`, `scene-error-boundary.tsx`.
Nenhuma dependência nova (drei já expõe `useGLTF`).

### Plug point de assets (onde plugar depois)

`avatar-states.ts` mantém, por estado, `modelUrl: string | null`. Hoje **todos `null`** →
o núcleo é procedural. Para plugar um asset (GLB próprio/licenciado de fonte estável):
- **GLB local:** colocar o arquivo em `public/assets/3d/...` e `modelUrl = "/assets/3d/arquivo.glb"`.
- **GLB hospedado:** `modelUrl = "<url do GLB licenciado>"`.

`AvatarModel` (useGLTF) e `preloadAvatar()` (useGLTF.preload) já ficam prontos; ao definir
`modelUrl`, o núcleo procedural é substituído pelo modelo, **mantendo** as camadas procedurais
(aura/anéis/partículas) ao redor — é isso que dá o "híbrido".

## 3. Registry dos 7 estados

Fonte da taxonomia: `src/components/game/journey-phases.ts` (Despertar → Boss Final).
Cada estado define a evolução procedural (valores desenhados, não calculados, para controle):

| idx | Estado | accent | secundária | anéis | partículas | distort | coroa | modelUrl |
|----|--------|--------|------------|------|-----------|---------|-------|----------|
| 0 | Despertar    | ciano  | violeta | 0 | 14 | 0.20 | não | null |
| 1 | Explorador   | ciano  | verde   | 1 | 18 | 0.24 | não | null |
| 2 | Estrategista | violeta | ciano  | 1 | 22 | 0.26 | não | null |
| 3 | Criador      | violeta | ciano  | 2 | 26 | 0.28 | não | null |
| 4 | Operador     | ciano  | violeta | 2 | 30 | 0.30 | não | null |
| 5 | Arquiteto    | violeta | ciano  | 3 | 36 | 0.32 | não | null |
| 6 | Boss Final   | âmbar  | rosa    | 3 | 44 | 0.36 | sim | null |

Progressão legível: mais anéis/partículas/energia conforme avança; Boss Final muda a paleta
(âmbar/rosa) e ganha coroa. O `variant` de cor do aluno (`student_profiles.avatar_variant`,
já existente) pode modular a paleta sem alterar a regra de evolução.

## 4. Impacto de payload / performance

- **Sem asset (estado atual):** o payload é o mesmo three.js já medido — ~**182 kB gzip** em
  chunk **async**, carregado sob demanda (mount-on-visible). Nenhuma dep nova; First Load das
  rotas não muda além do glue (~+2–3 kB na rota que usar o componente).
- **Com asset GLB/RPM (futuro):** soma o tamanho do modelo, carregado **async** via `useGLTF`:
  - RPM half-body ≈ 1–3 MB; full-body maior. Mitigar com half-body, `meshopt`/DRACO e `preload`
    só do próximo estado provável.
  - **DRACO/meshopt:** se o GLB for comprimido, o drei busca o decoder (por padrão do CDN gstatic)
    — é um fetch externo em runtime; para evitar dependência de CDN, hospedar o decoder localmente.
- **Contextos WebGL:** o preview dos 7 estados usa uma **grade de 7 canvases lazy**
  (mount-on-visible), 1 contexto cada = 7 no total, bem abaixo do limite do browser (~16); a API
  single (`EvolvingAvatar`) usa 1 contexto. A regra é não renderizar **dezenas** simultâneas.
- **Mobile:** `dpr [1,1.5]`, geometria baixa, partículas limitadas; medir FPS em device real
  antes de ativar GLB pesado.

## 5. Riscos

| Risco | Mitigação |
|------|-----------|
| Peso do GLB/RPM cresce o async | half-body, compressão, preload seletivo, orçamento por estado documentado |
| Decoder DRACO via CDN externo | hospedar decoder local; ou usar GLB não comprimido |
| Limite de contextos WebGL no preview | 7 canvases lazy (mount-on-visible), << limite (~16); single = 1 contexto; evitar dezenas simultâneas |
| Perf mobile com modelo real | medir FPS; `frameloop` demand fora da viewport; LOD/fallback |
| Privacidade/licença dos GLBs | só plugar GLB com origem/licença explícita e clara |
| Fonte de avatar externa descontinuada (ex.: RPM em 31/01/2026) | não depender de plataforma externa; pipeline plugável aceita qualquer GLB próprio/licenciado |
| WebGL ausente / falha de chunk | ErrorBoundary → `AvatarFigure` (2D), conteúdo nunca some |
| Regressão na tela viva | esta rodada NÃO toca cockpit/perfil; integração é swap documentado |

## 6. Critérios de rollback

- **Liga/desliga por flag:** `EvolvingAvatar forceFallback` (ou um único ponto de configuração)
  reverte para o `AvatarFigure` 2D em qualquer tela — sem remover código.
- **Por estado:** `modelUrl = null` volta o estado ao núcleo procedural (rollback do asset sem
  mexer no resto).
- **Total:** não usar `EvolvingAvatar` (manter `AvatarFigure`) — o produto volta ao 7A. Como esta
  rodada entrega só infra + preview, o produto vivo permanece no estado atual até decisão.
- **Gatilho de rollback:** perda de legibilidade, CLS, FPS inaceitável em mobile real, peso async
  acima do orçamento acordado, ou falha de fallback.

## 7. Entregáveis desta rodada

1. Este plano.
2. Infra plugável: `avatar-states.ts`, `procedural-avatar.tsx`, `avatar-model.tsx`,
   `avatar-canvas.tsx`, `lazy-avatar.tsx` (`EvolvingAvatar`).
3. Preview `/preview/avatar-evolution` com os 7 estados (procedural) + fallback de mesma dimensão.
4. Validações (typecheck/lint/test/build) + screenshots desktop/mobile + pareceres + decisão.

## 8. Próximos passos (após esta rodada, decisão do usuário)

1. Fornecer **GLBs próprios/licenciados** de uma fonte estável → plugar `modelUrl`.
2. Decidir half-body vs full-body e compressão; hospedar decoder local se usar DRACO.
3. Medir FPS em device móvel real com o modelo.
4. Integrar `EvolvingAvatar` no cockpit/perfil (swap do `AvatarFigure`) sob o protocolo de validação.
5. Reavaliar o hero da landing (procedural → asset de marca) como fase separada.
