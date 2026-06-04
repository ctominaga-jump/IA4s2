import math
import os
import pathlib
import traceback

import bpy
from mathutils import Vector


glb_path = pathlib.Path(os.environ["GLB_PATH"])
out_path = pathlib.Path(os.environ["OUT_PATH"])
log_path = pathlib.Path(os.environ.get("LOG_PATH", str(out_path) + ".log"))

try:
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete()
    bpy.ops.import_scene.gltf(filepath=str(glb_path))

    mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
    for obj in mesh_objects:
        obj.select_set(True)

    all_corners = []
    for obj in mesh_objects:
        for corner in obj.bound_box:
            all_corners.append(obj.matrix_world @ Vector(corner))

    mins = [min(v[i] for v in all_corners) for i in range(3)]
    maxs = [max(v[i] for v in all_corners) for i in range(3)]
    center = Vector([(maxs[i] + mins[i]) / 2 for i in range(3)])

    bpy.ops.object.light_add(type="AREA", location=(0, -3, 4))
    light = bpy.context.object
    light.name = "Key Light"
    light.data.energy = 450
    light.data.size = 4

    bpy.ops.object.camera_add(location=(0, -2.2, 0.15), rotation=(math.radians(82), 0, 0))
    camera = bpy.context.object
    bpy.context.scene.camera = camera

    direction = center - camera.location
    camera.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()
    camera.data.lens = 70
    camera.data.sensor_width = 32

    bpy.context.scene.render.engine = "BLENDER_EEVEE"
    bpy.context.scene.render.resolution_x = 900
    bpy.context.scene.render.resolution_y = 900
    bpy.context.scene.view_settings.view_transform = "Filmic"
    bpy.context.scene.view_settings.look = "Medium High Contrast"
    bpy.context.scene.world.color = (1, 1, 1)

    bpy.context.scene.render.filepath = str(out_path)
    bpy.ops.render.render(write_still=True)
    log_path.write_text(f"OK {out_path} exists={out_path.exists()}\n", encoding="utf-8")
except Exception:
    log_path.write_text(traceback.format_exc(), encoding="utf-8")
    raise
