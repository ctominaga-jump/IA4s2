"""Optimize a single avatar GLB with Blender.

This is the reusable version of the Aurora optimizer. It imports a GLB, optionally
isolates the middle cluster when a source contains a 3-character turnaround,
decimates the mesh, downsizes textures, normalizes height to 1.0, centers the
model, exports a GLB, and writes a JSON report.

Usage:
  blender -b --factory-startup --python scripts/blender_optimize_avatar.py

Env:
  GLB_PATH       input .glb
  OUT_PATH       output .glb
  REPORT_PATH    output report .json
  TARGET_TRIS    triangle target, default 15000
  TEX_SIZE       base/normal max side, default 1024
  TEX_SIZE_RM    roughness/metallic max side, default 512
  ISOLATE_MIDDLE set "1" to keep only the middle cluster on local Y
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
isolate_middle = os.environ.get("ISOLATE_MIDDLE", "0") == "1"

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


def join_meshes(mesh_objects):
    if len(mesh_objects) == 1:
        return mesh_objects[0]
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objects:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objects[0]
    bpy.ops.object.join()
    return bpy.context.view_layer.objects.active


def isolate_middle_cluster(obj) -> None:
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
        raise RuntimeError(f"expected 2 gaps between 3 clusters, found {len(gaps)}")
    cuts = sorted(y_min + (g[1] / (bins - 1)) * span for g in gaps[:2])
    log(f"middle-cluster cuts on local Y: {cuts[0]:.4f} / {cuts[1]:.4f}")

    bm = bmesh.new()
    bm.from_mesh(me)
    doomed = [v for v in bm.verts if not (cuts[0] < v.co.y < cuts[1])]
    bmesh.ops.delete(bm, geom=doomed, context="VERTS")
    bm.to_mesh(me)
    bm.free()


def main() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(glb_path))

    mesh_objects = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not mesh_objects:
        raise RuntimeError("no mesh objects found")

    obj = join_meshes(mesh_objects)
    bpy.context.view_layer.objects.active = obj
    obj.select_set(True)
    log(f"imported: {tri_count(obj)} tris")

    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)

    if isolate_middle:
        isolate_middle_cluster(obj)
        log(f"middle cluster isolated: {tri_count(obj)} tris")

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
    log(f"decimated (ratio {ratio:.4f}): {tri_count(obj)} tris")

    for img in list(bpy.data.images):
        if img.size[0] == 0 or not img.has_data:
            continue
        side = tex_size_rm if "_rm" in img.name.lower() else tex_size
        if img.size[0] > side or img.size[1] > side:
            old = tuple(img.size)
            img.scale(side, side)
            img.pack()
            log(f"texture {img.name}: {old} -> {tuple(img.size)}")

    mins, maxs = world_bbox([obj])
    center = [(mins[i] + maxs[i]) / 2 for i in range(3)]
    height = maxs[2] - mins[2]
    scale = 1.0 / height
    obj.data.transform(Matrix.Translation((-center[0], -center[1], -center[2])))
    obj.data.transform(Matrix.Scale(scale, 4))
    log(f"normalized: height {height:.4f} -> 1.0, centered at origin")

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
        log("export: AUTO")

    mins, maxs = world_bbox([obj])
    report = {
        "source": str(glb_path),
        "output": str(out_path),
        "output_bytes": out_path.stat().st_size,
        "blender_version": bpy.app.version_string,
        "vertices": len(obj.data.vertices),
        "triangles": tri_count(obj),
        "materials": [m.name for m in obj.data.materials if m],
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
