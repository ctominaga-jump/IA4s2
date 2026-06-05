# 16 - Relatório final: fase Evolution Kits dos avatares 3D

Data: 2026-06-05 · Orquestração completa (PO → Art Director → Kit Artist →
GLB Engineer → Tech Architect → Executor → Integration/UX/Visual/QA/Codex
Reviewers → rodada de correção → re-review)

## Recomendação final: **APROVADO COM RESSALVAS**

- Avatar Integration Reviewer: `Aprovado com ressalvas` (ressalva pré-existente
  de peso dos GLBs base não-Aurora).
- UX Gamification + Visual Reviewer: 1ª rodada `aprovado com ressalvas` com 3
  correções obrigatórias → correções aplicadas → re-review **`aprovado`**
  (3/3 resolvidas, sem regressões).
- Codex Reviewer: `aceite` (zero P0/P1; 2 P2 teóricos documentados abaixo).
- QA automatizado: typecheck ✓ · lint ✓ · 38 testes ✓ · build ✓ (estado final).

## Decisões registradas

1. **Ferramenta: Node + `@gltf-transform/core` em vez de Blender.** O Blender
   não é invocável headless neste ambiente (ver seção "Por que o Blender não
   foi usado nesta rodada" — ele está instalado via Microsoft Store, mas sem
   alias de execução). O brief 14 aceita "fluxo reproduzível"; a geometria dos
   kits é 100% paramétrica e o gerador é determinístico e auditável. Decisão
   confirmada pelo usuário. Polish futuro no Blender segue possível (kits são
   GLBs independentes).
2. **Formato: um GLB de kit por avatar/fase** (24 arquivos), não GLB único com
   coleções. Critérios: lazy por fase (só baixa o kit da fase atual), rollback
   por variante/fase com `null` no registry, manutenção simples (regenerar 1
   kit não toca os outros), payload mínimo por estado.
3. **Espaço de autoria = espaço do GLB base** (Y-up, origem central, altura
   1.0). O kit entra no grupo spin/float com a mesma escala/rotação do modelo
   (×1.9) — encaixe por contrato, sem ajuste por kit.
4. **Harmonização das camadas procedurais**: anéis/partículas/cores procedurais
   continuam (AVATAR_STATES intocado); com kit ativo os anéis procedurais
   recuam (opacidade 0.4→0.26); a coroa procedural do Boss é suprimida quando o
   kit Boss Final está ativo (o kit entrega halo + coroa) e **reaparece** se o
   kit for removido (rollback).
5. **Matriz 4×7 em um único `<Canvas>`** (28 células como scene-graph): 28
   canvases estourariam o limite de contextos WebGL (~16). Total da página:
   4 + 7 + 1 = 12 contextos.
6. **Badges dos kits Estrategista deslocados lateralmente** (x 0.19, y 0.36)
   após a 1ª revisão UX: centrados em x=0 ficavam 100% ocultos atrás do torso
   na vista frontal.

## Por que o Blender não foi usado nesta rodada

Investigação objetiva (2026-06-05, Windows 11, sem instalar nada nem alterar
PATH):

| Checagem | Resultado |
|---|---|
| `where.exe blender` | não encontrado (exit 1) |
| `blender --version` | comando não reconhecido |
| `C:\Program Files\Blender Foundation\` (e x86, LOCALAPPDATA, `C:\Blender`) | não existem |
| Registro de desinstalação (HKLM/HKCU) | nenhuma entrada "Blender" |
| `Get-AppxPackage -Name "*Blender*"` | **BlenderFoundation.Blender 5.1.2.0 INSTALADO** (pacote Microsoft Store/MSIX) |
| Alias de execução `%LOCALAPPDATA%\Microsoft\WindowsApps\blender.exe` | **não existe** (desabilitado) |
| Execução por caminho completo (`C:\Program Files\WindowsApps\BlenderFoundation.Blender_5.1.2.0_x64__ppwjx1n5r4v9t\Blender\blender.exe --version`) | **Acesso negado** (ACL do WindowsApps) |

Conclusão: o Blender 5.1.2 está na máquina como app da Store — a mesma versão
citada no relatório da Aurora ("Blender 5.1.2 headless", 2026-06-02) — mas
**não é invocável de forma headless/automatizada nesta sessão**: o alias de
execução do app está desabilitado e o diretório do pacote tem ACL restritiva.
Isso explica também por que os relatórios de Brasa/Verdejante/Nebulosa já
registravam "Blender não acessível no PATH deste ambiente".

**Decisão**: kits gerados por **Node + `@gltf-transform/core`** (devDependency
já existente, mesmo pipeline do `glb-isolate-center.mjs`). Aceitável para esta
fase porque: (a) o brief 14 pede "Blender por script **ou fluxo reproduzível**"
— e um gerador paramétrico determinístico é mais reproduzível e auditável que
modelagem manual; (b) a geometria dos kits (anéis, placas, halos, badges,
frames de arestas) é inteiramente paramétrica; (c) o contrato técnico (peso,
tris, bounds, materiais) é verificado por `inspect-kits.mjs` em CI-style
(exit 1 se violar); (d) o resultado visual foi aprovado pela revisão UX após
rodada de correção.

**Consequência**: o Blender permanece **opcional, não bloqueante**, para
polish futuro (bevels, materiais avançados) — basta regenerar os mesmos
arquivos `avatar-*-kit-*.glb`; o registry não muda. Para reabilitar o Blender
headless nesta máquina: Configurações do Windows → Apps → Aliases de execução
de aplicativo → ativar `blender.exe` (ação do usuário; nenhuma reinstalação
necessária). Nenhum script de runtime/build do produto depende de Blender
(verificado por grep: menções em `src/` são apenas comentários).

## Comandos

```powershell
node scripts/generate-evolution-kits.mjs   # gera os 24 kits em public/assets/3d
node scripts/inspect-kits.mjs              # audita contra o contrato (exit 1 se violar)
npx next dev -p 3100                       # dev server para evidências
node scripts/shoot-evolution-kits.mjs      # 8 screenshots em docs/.../visual-reviews
npm run typecheck && npm run lint && npm run test && npm run build
```

## Arquivos gerados/alterados

**Assets (24 novos, GLBs base intocados — verificado por git status):**
`public/assets/3d/avatar-{aurora,brasa,verdejante,nebulosa}-kit-{explorador,estrategista,criador,operador,arquiteto,boss-final}.glb`

**Código:**
- `src/components/three/avatar/avatar-states.ts` — `AVATAR_KITS`,
  `avatarKitForPhase`, `kitUrl` em `AvatarRenderConfig`.
- `src/components/three/avatar/procedural-avatar.tsx` — kit no grupo spin
  (Suspense + `SceneErrorBoundary fallback={null}` aninhado), supressão da
  coroa procedural, anéis procedurais recuados com kit.
- `src/components/three/avatar/avatar-matrix-canvas.tsx` (novo) — matriz 4×7.
- `src/components/three/avatar/lazy-avatar-matrix.tsx` (novo) — envelope lazy
  (mount-on-visible + dynamic ssr:false + ErrorBoundary + fallback 2D).
- `src/app/preview/avatar-evolution/page.tsx` — seção matriz, rótulo de kit por
  card, copy e notas de rollback; matriz com scroll horizontal no mobile.
- `tests/avatar-states.test.ts` — 6 testes novos (cardinalidade, convenção de
  nomes, unicidade entre variantes/anti-recolor, clamp, variante desconhecida,
  existência física dos GLBs).

**Scripts:** `generate-evolution-kits.mjs`, `inspect-kits.mjs`,
`shoot-evolution-kits.mjs` (novos).

**Docs:** `15-evolution-kits-design-spec.md` (spec do Art Director), este
relatório, 8 screenshots `phase-evolution-kits-*.png`.

## Pesos e triângulos (auditoria `inspect-kits.mjs`, pós-correção)

24/24 kits dentro do contrato (≤150 KB, ≤8k tris, envelope XZ≤0.7/Y≤±0.75, sem
texturas/animações/câmeras/skins/extensões com decoder). **Total: 0,73 MB.**

| Kit | KB | tris* |
|---|---|---|
| aurora explorador / estrategista / criador / operador / arquiteto / boss | 23,0 / 8,5 / 13,5 / 40,9 / 34,2 / 57,8 | 944 / 120 / 912 / 1960 / 1992 / 2900 |
| brasa idem | 21,4 / 7,8 / 11,6 / 21,9 / 18,7 / 49,1 | 932 / 84 / 616 / 960 / 756 / 2768 |
| verdejante idem | 30,0 / 26,6 / 14,2 / 28,6 / 31,1 / 48,7 | 2016 / 1400 / 912 / 2196 / 1808 / 3332 |
| nebulosa idem | 24,0 / 55,2 / 15,3 / 45,8 / 70,7 / 48,8 | 1328 / 2772 / 980 / 2644 / 3356 / 2996 |

\* tris por instância renderizada (gerador); o inspetor reporta tris de meshes
únicos (instâncias compartilham geometria — número GPU igual ou menor).

## Rodada de correção (1ª revisão UX → re-review)

1. Explorador→Estrategista ilegível → placas de ombro +40-50% de massa nas 4
   variantes; badges ampliados e deslocados para espreitar ao lado da cabeça.
   **Resolvida.**
2. Anéis procedurais dominando → opacidade 0.4→0.26 com kit; módulos do
   Operador ampliados. **Resolvida.**
3. Anel Explorador da Aurora cortando o torso → inclinado 0.3 rad (órbita
   elíptica); nós do Verdejante 0.02→0.028. **Resolvida.**

## Evidências

- `phase-evolution-kits-desktop.png` / `-mobile.png` — página completa.
- `-ember/-verdant/-nebula-desktop.png` — strips de evolução por variante.
- `-fallback-desktop.png` — rollback 2D total (`?fallback=1`), inclusive matriz.
- `-reduced-motion-desktop.png` — rotação/flutuação/partículas congeladas
  (garantido por código: `animate=false` + `frameloop="demand"`).
- `-kit-error-desktop.png` — kits da Aurora bloqueados via Playwright route
  abort: **só o kit some**, avatar segue 3D (base + camadas), página viva.
  Degradação em 3 níveis: kit→nada · canvas→card 2D · página→conteúdo textual.

## Riscos e ressalvas

1. **(Pré-existente) GLBs base não-Aurora pesados para produção mobile**:
   Brasa ~1,5 MB/37k tris, Verdejante ~1,9 MB/47k, Nebulosa ~1,6 MB/39k —
   "otimização intermediária". Kits NÃO agravam (0,73 MB pelos 24; ~8-71 KB por
   estado carregado). Nova passada (Blender ou decimação Node) antes de plugar
   em cockpit/perfil.
2. **Matriz = 1 canvas**: erro de WebGL na matriz derruba a matriz inteira para
   a grade 2D (não célula a célula). Tradeoff aceito pelo limite de contextos.
3. **P2 (Codex)**: kit usa `model?.scale ?? 1.9` — se uma variante voltar a
   `model: null`, o kit usa 1.9 sobre o núcleo procedural (leve descasamento
   possível; só preview). `mirrored()` do gerador não inverte `quat` (nenhuma
   parte espelhada usa quat hoje).
4. **Dev-only**: HMR do Next pode entrar em estado quebrado após regenerar
   GLBs + editar componentes em sequência (TypeError transitório) — reiniciar o
   dev server resolve; produção não é afetada (build limpo).
5. Melhorias não-bloqueantes sugeridas pelo UX para fase futura: pose frontal
   do Verdejante no GLB base; segundo anel da Nebulosa Estrategista levemente
   mais discreto; revalidar badges em cards reais de 150 px ao integrar.

## Próximos passos

1. Otimizar GLBs base de Brasa/Verdejante/Nebulosa (15k-30k tris) — pendência
   herdada.
2. Integrar `EvolvingAvatar` (agora com kits) em cockpit/perfil sob protocolo
   de validação visual, reaproveitando o rollback por variante/fase.
3. Polish opcional dos kits no Blender (bevels/materiais) regenerando os
   mesmos arquivos — o registry não muda.
4. Medir FPS em device móvel real com base + kit + camadas.
