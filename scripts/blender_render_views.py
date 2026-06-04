"""Renderiza multiplas vistas de um GLB para validar orientacao/visual.

Uso (headless):
  blender -b --factory-startup --python scripts/blender_render_views.py
Env:
  GLB_PATH  caminho do .glb
  OUT_DIR   pasta de saida
  PREFIX    prefixo dos PNGs (default: nome do arquivo)

O launcher do Windows nao propaga stdout, entao o progresso/erro vai para
<OUT_DIR>/<PREFIX>-views.log.
"""

import math
import os
import pathlib
import traceback

import bpy
from mathutils import Vector

glb_path = pathlib.Path(os.environ["GLB_PATH"])
out_dir = pathlib.Path(os.environ["OUT_DIR"])
prefix = os.environ.get("PREFIX", glb_path.stem.replace(" ", "-"))
out_dir.mkdir(parents=True, exist_ok=True)
log_path = out_dir / f"{prefix}-views.log"
log_lines: list[str] = []


def main() -> None:
    bpy.ops.wm.read_factory_settings(use_empty=True)
    bpy.ops.import_scene.gltf(filepath=str(glb_path))
    log_lines.append("imported")

    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    all_corners = [
        obj.matrix_world @ Vector(corner)
        for obj in mesh_objects
        for corner in obj.bound_box
    ]
    mins = [min(v[i] for v in all_corners) for i in range(3)]
    maxs = [max(v[i] for v in all_corners) for i in range(3)]
    center = Vector([(maxs[i] + mins[i]) / 2 for i in range(3)])
    radius = max(maxs[i] - mins[i] for i in range(3))

    # Iluminacao neutra para leitura de cor/textura.
    world = bpy.data.worlds.new("World")
    world.use_nodes = True
    bg = world.node_tree.nodes["Background"]
    bg.inputs[0].default_value = (1.0, 1.0, 1.0, 1.0)
    bg.inputs[1].default_value = 1.0
    bpy.context.scene.world = world

    bpy.ops.object.light_add(type="SUN", location=(2, -3, 4))
    sun = bpy.context.object
    sun.data.energy = 3.0
    sun.rotation_euler = (math.radians(50), math.radians(10), math.radians(25))

    bpy.ops.object.camera_add()
    camera = bpy.context.object
    camera.data.lens = 50
    camera.data.sensor_width = 36
    bpy.context.scene.camera = camera

    scene = bpy.context.scene
    engine_used = None
    for engine in ("BLENDER_EEVEE_NEXT", "BLENDER_EEVEE", "BLENDER_WORKBENCH"):
        try:
            scene.render.engine = engine
            engine_used = engine
            break
        except TypeError:
            continue
    log_lines.append(f"engine={engine_used}")
    scene.render.resolution_x = 640
    scene.render.resolution_y = 640
    scene.view_settings.view_transform = "Standard"

    dist = radius * 2.4
    views = {
        "front": Vector((0, -dist, 0)),
        "side": Vector((dist, 0, 0)),
        "top": Vector((0, 0.0001, dist)),
        "threequarter": Vector((dist * 0.7, -dist * 0.7, dist * 0.45)),
    }

    for name, offset in views.items():
        camera.location = center + offset
        direction = center - camera.location
        camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
        scene.render.filepath = str(out_dir / f"{prefix}-{name}.png")
        bpy.ops.render.render(write_still=True)
        log_lines.append(f"RENDERED {scene.render.filepath}")


try:
    main()
    log_lines.append("OK")
except Exception:
    log_lines.append(traceback.format_exc())
    log_path.write_text("\n".join(log_lines), encoding="utf-8")
    raise
log_path.write_text("\n".join(log_lines), encoding="utf-8")
