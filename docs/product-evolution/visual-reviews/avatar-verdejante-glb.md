# Avatar Verdejante - GLB otimizado (relatorio)

Data: 2026-06-03

## Arquivo final

| Item | Valor |
|---|---|
| Fonte | `C:\Users\Christopher\Downloads\Verdejante.glb` |
| Fonte - peso | 58.062.408 bytes (~55,4 MB) |
| Saida | `public/assets/3d/avatar-verdejante.glb` |
| Saida - peso | 5.262.408 bytes (~5,02 MB) |
| Reducao | ~90,9% menor que o GLB original |
| Gerador original | Tripo |
| Otimizador usado nesta rodada | `@gltf-transform/cli optimize` |
| Compressao geometry runtime | nenhuma (`--compress false`) |
| Texturas | WebP 1024x1024 (`EXT_texture_webp`) |
| Animacao/rig | nenhum |

## Inspecao tecnica

Antes:

- 1.908.888 triangulos.
- 1.073.873 vertices enviados para GPU.
- Texturas JPEG 1024x1024.
- Sem animacoes.

Depois:

- ~134.309 triangulos.
- ~107.740 vertices enviados para GPU.
- Texturas WebP 1024x1024.
- Sem DRACO/meshopt, para evitar decoder externo no runtime.

## Observacao importante

Assim como a Brasa, esta versao ja reduz muito o download, mas ainda nao chega
ao mesmo orcamento da Aurora otimizada (~15k triangulos / ~752 KB). O gargalo
restante e malha, nao textura.

Para mirar ~15k-30k triangulos, usar o script generico
`scripts/blender_optimize_avatar.py` quando o Blender estiver acessivel:

```powershell
$env:GLB_PATH="C:\Users\Christopher\Downloads\Verdejante.glb"
$env:OUT_PATH="public\assets\3d\avatar-verdejante.glb"
$env:REPORT_PATH="docs\product-evolution\visual-reviews\avatar-verdejante-glb-report.json"
$env:TARGET_TRIS="15000"
$env:TEX_SIZE="1024"
$env:TEX_SIZE_RM="512"
blender -b --factory-startup --python scripts\blender_optimize_avatar.py
```

## Decisao

Versao `avatar-verdejante.glb` aprovada como **otimizacao intermediaria sem
decoder externo**. Para producao mobile mais rigorosa, ainda recomenda-se uma
segunda passada no Blender e validacao visual no preview de avatar.

## Adendo (2026-06-04): isolamento do robo central + normalizacao

O GLB intermediario era o turnaround Tripo com 3 robos em fileira, fundidos num
unico mesh pelo `gltf-transform optimize`. Nova passada com
`scripts/glb-isolate-center.mjs` isola o robo central, recentra na origem e
normaliza altura 1.0 no eixo Y (convencao da Aurora).

| Item | Valor |
|---|---|
| Saida | `public/assets/3d/avatar-verdejante.glb` |
| Peso | 1.980.720 bytes (~1,89 MB) |
| Triangulos | 47.213 (upload GPU: 37.849 vertices) |
| Bounding box | X ±0,282 - Y ±0,500 - Z ±0,209 (altura 1.0, centrado, frente +Z) |

Comando: `node scripts/glb-isolate-center.mjs <fonte-intermediaria> public\assets\3d\avatar-verdejante.glb`

Ressalva mantida: ~47,2k triangulos ainda acima do alvo de producao mobile
(15k-30k); nova passada no Blender segue recomendada.
