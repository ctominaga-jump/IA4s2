"""Gera o GLB otimizado do Agente Aurora a partir do modelo HD (Tripo).

O GLB HD contem um turnaround com 3 robos identicos enfileirados no eixo Y
(Blender). Este script:
  1. isola o robo do meio (ja de frente para -Y => +Z no glTF);
  2. decima a malha para ~TARGET_TRIS triangulos;
  3. reduz as texturas (basecolor/normal => TEX_SIZE, rm => TEX_SIZE_RM);
  4. centraliza na origem e normaliza a altura para 1.0 (eixo Y do glTF);
  5. exporta GLB com texturas WebP + relatorio JSON.

Uso (headless):
  blender -b --factory-startup --python scripts/blender_optimize_aurora.py
Env:
  GLB_PATH     entrada (HD .glb)
  OUT_PATH     saida (.glb final)
  REPORT_PATH  relatorio JSON
  TARGET_TRIS  alvo de triangulos (default 15000)
  TEX_SIZE     lado de basecolor/normal (default 1024)
  TEX_SIZE_RM  lado da textura roughness/metallic (default 512)

O launcher do Windows nao propaga stdout; progresso/erro vai para
<REPORT_PATH>.log.
"""

import json
import math
import os
import pathlib
import traceback
from array import array

import bmesh
import bpy
from mathutils import Matrix, Vector

glb_path = pathlib.Path(os.environ["GLB_PATH"])
out_path = pathlib.Path(os.environ["OUT_PATH"])
report_path = pathlib.Path(os.environ["REPORT_PATH"])
target_tris = int(os.environ.get("TARGET_TRIS", "15000"))
tex_size = int(os.environ.get("TEX_SIZE", "1024"))
tex_size_rm = int(os.environ.get("TEX_SIZE_RM", "512"))

log_path = pathlib.Path(str(report_path) + ".log")
log_lines: list[str] = []


def log(msg: str) -> None:
    log_lines.append(msg)


def tri_count(obj) -> int:
    return sum(max(1, len(p.vertices) - 2) for p in obj.data.polygons)


def world_bbox(objs):
    corners = [obj.matrix_world @ Vector(c) for obj in objs for c in obj.bound_box]
    mins = [min(v[i] for v in corners) for i in range(3)]
    maxs = [max(v[i] for v in corners) for i in range(3)]
    return mins, maxs


def main() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(glb_path))

    mesh_objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if len(mesh_objects) != 1:
        raise RuntimeError(f"esperado 1 mesh, achei {len(mesh_objects)}")
    obj = mesh_objects[0]
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    log(f"importado: {tri_count(obj)} tris")

    # Coordenadas locais == mundiais a partir daqui.
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    # --- 1. Isolar o robo do meio (3 clusters separados por gaps no eixo Y) ---
    me = obj.data
    coords = array("f", [0.0]) * (len(me.vertices) * 3)
    me.vertices.foreach_get("co", coords)
    ys = coords[1::3]
    y_min, y_max = min(ys), max(ys)
    bins = 400
    hist = [0] * bins
    span = (y_max - y_min) or 1.0
    for y in ys:
        i = int((y - y_min) / span * (bins - 1))
        hist[i] += 1

    # Runs de bins vazios => gaps entre os robos.
    gaps = []
    start = None
    for i, h in enumerate(hist):
        if h == 0 and start is None:
            start = i
        elif h != 0 and start is not None:
            gaps.append((i - start, (start + i) / 2))
            start = None
    gaps.sort(reverse=True)
    if len(gaps) < 2:
        raise RuntimeError(f"esperava 2 gaps entre 3 robos, achei {len(gaps)}")
    cuts = sorted(y_min + (g[1] / (bins - 1)) * span for g in gaps[:2])
    log(f"cortes em Y: {cuts[0]:.4f} / {cuts[1]:.4f}")

    bm = bmesh.new()
    bm.from_mesh(me)
    doomed = [v for v in bm.verts if not (cuts[0] < v.co.y < cuts[1])]
    bmesh.ops.delete(bm, geom=doomed, context="VERTS")
    bm.to_mesh(me)
    bm.free()
    log(f"robo isolado: {tri_count(obj)} tris")

    # --- 2. Decimar ---
    try:
        bpy.ops.mesh.customdata_custom_splitnormals_clear()
    except (RuntimeError, AttributeError):
        pass
    ratio = target_tris / max(1, tri_count(obj))
    if ratio < 1.0:
        mod = obj.modifiers.new("decimate", "DECIMATE")
        mod.ratio = ratio
        mod.use_collapse_triangulate = True
        bpy.ops.object.modifier_apply(modifier=mod.name)
    bpy.ops.object.shade_smooth()
    try:
        bpy.ops.object.shade_smooth_by_angle(angle=math.radians(35))
    except AttributeError:
        pass
    log(f"decimado (ratio {ratio:.4f}): {tri_count(obj)} tris")

    # --- 3. Reduzir texturas ---
    for img in list(bpy.data.images):
        if img.size[0] == 0 or not img.has_data:
            continue
        side = tex_size_rm if "_rm" in img.name.lower() else tex_size
        if img.size[0] > side or img.size[1] > side:
            old = tuple(img.size)
            img.scale(side, side)
            img.pack()
            log(f"textura {img.name}: {old} -> {tuple(img.size)}")

    # --- 4. Centralizar e normalizar altura (Blender Z => glTF Y) ---
    mins, maxs = world_bbox([obj])
    center = [(mins[i] + maxs[i]) / 2 for i in range(3)]
    height = maxs[2] - mins[2]
    scale = 1.0 / height
    me.transform(Matrix.Translation((-center[0], -center[1], -center[2])))
    me.transform(Matrix.Scale(scale, 4))
    log(f"normalizado: altura {height:.4f} -> 1.0, centro {['%.4f' % c for c in center]} -> origem")

    # --- 5. Exportar GLB (texturas WebP) ---
    out_path.parent.mkdir(parents=True, exist_ok=True)
    export_kwargs = dict(
        filepath=str(out_path),
        export_format="GLB",
        use_selection=False,
        export_yup=True,
        export_apply=True,
        export_animations=False,
        export_skins=False,
        export_morph=False,
        export_extras=False,
        export_cameras=False,
        export_lights=False,
    )
    try:
        bpy.ops.export_scene.gltf(
            **export_kwargs, export_image_format="WEBP", export_image_quality=80
        )
        log("export: WEBP q80")
    except TypeError:
        bpy.ops.export_scene.gltf(**export_kwargs)
        log("export: formato AUTO (WEBP indisponivel)")

    # --- Relatorio ---
    mins, maxs = world_bbox([obj])
    report = {
        "source": str(glb_path),
        "output": str(out_path),
        "output_bytes": out_path.stat().st_size,
        "blender_version": bpy.app.version_string,
        "vertices": len(me.vertices),
        "triangles": tri_count(obj),
        "materials": [m.name for m in me.materials if m],
        "images": [
            {"name": i.name, "size": list(i.size)}
            for i in bpy.data.images
            if i.has_data and i.size[0] > 0
        ],
        "bbox_blender": {"min": mins, "max": maxs},
        "log": log_lines,
    }
    report_path.write_text(json.dumps(report, indent=2), encoding="utf-8")


try:
    main()
    log("OK")
except Exception:
    log(traceback.format_exc())
    log_path.write_text("\n".join(log_lines), encoding="utf-8")
    raise
log_path.write_text("\n".join(log_lines), encoding="utf-8")
