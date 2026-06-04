# Avatar Brasa - GLB otimizado (relatorio)

Data: 2026-06-02

## Arquivo final

| Item | Valor |
|---|---|
| Fonte | `C:\Users\Christopher\Downloads\Brasa.glb` |
| Fonte - peso | 57.174.624 bytes (~54,5 MB) |
| Saida | `public/assets/3d/avatar-brasa.glb` |
| Saida - peso | 4.226.780 bytes (~4,03 MB) |
| Reducao | ~92,6% menor que o GLB original |
| Gerador original | Tripo |
| Otimizador usado nesta rodada | `@gltf-transform/cli optimize` |
| Compressao geometry runtime | nenhuma (`--compress false`) |
| Texturas | WebP 1024x1024 (`EXT_texture_webp`) |
| Animacao/rig | nenhum |

## Inspecao tecnica

Antes:

- 1.872.654 triangulos.
- 1.028.837 vertices enviados para GPU.
- Texturas JPEG 2048x2048.
- Sem animacoes.

Depois:

- ~109.524 triangulos.
- ~86.117 vertices enviados para GPU.
- Texturas WebP 1024x1024.
- Sem DRACO/meshopt, para evitar decoder externo no runtime.

## Observacao importante

Esta versao ja e muito menor em download, mas ainda nao chega ao mesmo orcamento
da Aurora otimizada (~15k triangulos / ~752 KB). O gargalo restante e malha, nao
textura.

O Blender nao estava acessivel no PATH deste ambiente durante esta rodada, entao
nao foi possivel aplicar o mesmo `Decimate` usado na Aurora. Foi adicionado o
script generico `scripts/blender_optimize_avatar.py` para repetir o pipeline da
Aurora em qualquer avatar quando o Blender estiver disponivel.

Com Blender, o comando esperado para a Brasa e:

```powershell
$env:GLB_PATH="C:\Users\Christopher\Downloads\Brasa.glb"
$env:OUT_PATH="public\assets\3d\avatar-brasa.glb"
$env:REPORT_PATH="docs\product-evolution\visual-reviews\avatar-brasa-glb-report.json"
$env:TARGET_TRIS="15000"
$env:TEX_SIZE="1024"
$env:TEX_SIZE_RM="512"
blender -b --factory-startup --python scripts\blender_optimize_avatar.py
```

## Decisao

Versao `avatar-brasa.glb` aprovada como **otimizacao intermediaria sem decoder
externo**. Para producao mobile mais rigorosa, ainda recomenda-se uma segunda
passada no Blender para mirar ~15k-30k triangulos, seguida de screenshot desktop
e mobile no preview de avatar.

## Adendo (2026-06-04): isolamento do robo central + normalizacao

Na integracao por variante descobriu-se que o GLB intermediario era o
**turnaround Tripo com 3 robos identicos em fileira** (mesmo formato do source
da Aurora), fundidos num unico mesh pelo `gltf-transform optimize`. Nova
passada com `scripts/glb-isolate-center.mjs` (Node + `@gltf-transform/core`):
isola o robo central por recorte de triangulos no eixo Z, recentra na origem e
normaliza altura 1.0 no eixo Y (convencao da Aurora).

| Item | Valor |
|---|---|
| Saida | `public/assets/3d/avatar-brasa.glb` |
| Peso | 1.554.744 bytes (~1,48 MB) |
| Triangulos | 37.506 (upload GPU: 29.623 vertices) |
| Bounding box | X ±0,294 - Y ±0,500 - Z ±0,189 (altura 1.0, centrado, frente +Z) |

Comando: `node scripts/glb-isolate-center.mjs <fonte-intermediaria> public\assets\3d\avatar-brasa.glb`

Ressalva mantida: ~37,5k triangulos ainda acima do alvo de producao mobile
(15k-30k); nova passada no Blender segue recomendada.
