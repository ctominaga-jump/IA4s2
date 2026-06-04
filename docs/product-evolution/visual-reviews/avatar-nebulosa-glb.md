# Avatar Nebulosa - GLB otimizado (relatorio)

Data: 2026-06-03

## Arquivo final

| Item | Valor |
|---|---|
| Fonte | `C:\Users\Christopher\Downloads\Nebulosa.glb` |
| Fonte - peso | 57.777.448 bytes (~55,1 MB) |
| Saida | `public/assets/3d/avatar-nebulosa.glb` |
| Saida - peso | 4.460.504 bytes (~4,25 MB) |
| Reducao | ~92,3% menor que o GLB original |
| Gerador original | Tripo |
| Otimizador usado nesta rodada | `@gltf-transform/cli optimize` |
| Compressao geometry runtime | nenhuma (`--compress false`) |
| Texturas | WebP 1024x1024 (`EXT_texture_webp`) |
| Animacao/rig | nenhum |

## Inspecao tecnica

Antes:

- 1.925.230 triangulos.
- 1.063.587 vertices enviados para GPU.
- Texturas JPEG 1024x1024.
- Sem animacoes.

Depois:

- ~116.179 triangulos.
- ~91.113 vertices enviados para GPU.
- Texturas WebP 1024x1024.
- Sem DRACO/meshopt, para evitar decoder externo no runtime.

## Observacao importante

Esta versao segue o mesmo nivel de otimizacao intermediaria aplicado em Brasa e
Verdejante. Ela reduz muito o download, mas ainda nao chega ao mesmo orcamento
da Aurora otimizada (~15k triangulos / ~752 KB). O gargalo restante e malha, nao
textura.

Para mirar ~15k-30k triangulos, usar o script generico
`scripts/blender_optimize_avatar.py` quando o Blender estiver acessivel:

```powershell
$env:GLB_PATH="C:\Users\Christopher\Downloads\Nebulosa.glb"
$env:OUT_PATH="public\assets\3d\avatar-nebulosa.glb"
$env:REPORT_PATH="docs\product-evolution\visual-reviews\avatar-nebulosa-glb-report.json"
$env:TARGET_TRIS="15000"
$env:TEX_SIZE="1024"
$env:TEX_SIZE_RM="512"
blender -b --factory-startup --python scripts\blender_optimize_avatar.py
```

## Decisao

Versao `avatar-nebulosa.glb` aprovada como **otimizacao intermediaria sem decoder
externo**. Para producao mobile mais rigorosa, ainda recomenda-se uma segunda
passada no Blender e validacao visual no preview de avatar.

## Adendo (2026-06-04): isolamento do robo central + normalizacao

O GLB intermediario era o turnaround Tripo com 3 robos em fileira, fundidos num
unico mesh pelo `gltf-transform optimize`. Nova passada com
`scripts/glb-isolate-center.mjs` isola o robo central, recentra na origem e
normaliza altura 1.0 no eixo Y (convencao da Aurora).

| Item | Valor |
|---|---|
| Saida | `public/assets/3d/avatar-nebulosa.glb` |
| Peso | 1.616.584 bytes (~1,54 MB) |
| Triangulos | 39.520 (upload GPU: 30.988 vertices) |
| Bounding box | X ±0,273 - Y ±0,500 - Z ±0,210 (altura 1.0, centrado, frente +Z) |

Comando: `node scripts/glb-isolate-center.mjs <fonte-intermediaria> public\assets\3d\avatar-nebulosa.glb`

Ressalva mantida: ~39,5k triangulos ainda acima do alvo de producao mobile
(15k-30k); nova passada no Blender segue recomendada.
