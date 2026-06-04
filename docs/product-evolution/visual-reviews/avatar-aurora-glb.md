# Avatar Aurora — GLB real otimizado (relatório)

Data: 2026-06-02 · Pipeline: `scripts/blender_optimize_aurora.py` (Blender 5.1.2 headless)

## Arquivo final

| Item | Valor |
|---|---|
| Arquivo | `public/assets/3d/avatar-aurora.glb` |
| Peso | **770.224 bytes (~752 KB)** — mesh ~658 KB + 3 texturas WebP (~110 KB) |
| Triângulos | **14.999** (vértices de malha: 11.919; upload GPU c/ splits: 17.753, índices u16) |
| Materiais | 1 PBR opaco (`tripo_material_…`): baseColor 1024² + normal 1024² + metallicRoughness 512², todas WebP (`EXT_texture_webp`) |
| Bounding box (glTF) | X ±0,290 · Y ±0,500 · Z ±0,212 — **altura 1.0 normalizada no eixo Y**, centrado na origem, frente +Z |
| Animação/rig | nenhum (conforme escopo) |
| Validação | parse OK no `@gltf-transform/cli` (glTF 2.0); carregado via `useGLTF` no preview |

## Fonte e processo

- **Base escolhida: HD** (`stylized robot 3d model.glb`, 57,3 MB, 1,94M tris) — preserva
  texturas e identidade Aurora. O arquivo é um *turnaround com 3 robôs idênticos* em fileira;
  o script isola o robô central (já de frente para +Z), decima ~641k → 15k tris, reduz as
  texturas 4096² → 1024²/512² e normaliza escala/centro.
- **Smart Mesh não usado**: sem textura/material útil; a decimação do HD preservou bem a
  silhueta (formas chunky/arredondadas decimam com pouca perda), então não foi necessário
  rebake manual da paleta.
- Sem Draco/meshopt **de propósito**: o decoder viria de CDN externo (ver plano 13 §4) e
  752 KB já cumpre o orçamento.

## Wiring (rollback-safe)

- `avatar-states.ts`: `AURORA_MODEL_URL = "/assets/3d/avatar-aurora.glb"` plugado nos 7
  estados (modo híbrido: camadas procedurais por cima). **Rollback: voltar a `null`.**
- `avatar-model.tsx`: clona a cena por instância (`useGLTF` cacheia a mesma cena por URL;
  sem clone, múltiplos canvases roubam o modelo uns dos outros). Geometria/texturas seguem
  compartilhadas.
- `avatar-canvas.tsx`: key light branca condicional (`config.modelUrl`) — o núcleo
  procedural emissivo mantém o look original.
- `procedural-avatar.tsx`: escala do plug 1.1 → 1.9 (GLB normalizado em altura 1.0).
- Fallback 2D (`AvatarFigure`) intacto — validado com `?fallback=1`.

## Evidências

- `phase-avatar-aurora-glb-desktop.png` / `-mobile.png` — 7 estados híbridos (GLB + anéis/partículas/coroa).
- `phase-avatar-aurora-glb-fallback-desktop.png` — fallback 2D intacto.
- Reduced-motion validado (rotação congelada, rosto para a câmera).
- Capturável via `node scripts/shoot-avatar-aurora.mjs` (dev server na porta 3100).

## Decisão: **aprovado com ressalvas**

Critérios atendidos: GLB válido e carregável ✓ · < poucos MB ✓ (0,75 MB) · 15k tris ✓ ·
texturas otimizadas ✓ · visual reconhecível (corpo dark, acentos violeta, visor/core ciano) ✓ ·
fallback intacto ✓ · preview OK ✓ · typecheck/lint/25 testes ✓.

Ressalvas (nenhuma bloqueia o uso):
1. **Sem canal emissivo**: o "vidro emissivo ciano" do brief vem só do baseColor + luzes;
   próximo passo opcional é marcar olhos/core como material emissivo no Blender.
2. **WebP obrigatório** (`extensionsRequired`): universal nos browsers atuais (Safari 14+,
   2020); se surgir alvo legado, reexportar com PNG/JPEG (+~0,5 MB).
3. Leves costuras de decimação visíveis em close extremo — irrelevantes nos tamanhos de
   uso (150–184 px).
4. O mesmo GLB Aurora é o núcleo das 4 identidades por ora (o `modelUrl` é por estado);
   variantes Brasa/Verdejante/Nebulosa ganham assets próprios em fase futura.
