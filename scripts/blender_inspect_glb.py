import json
import os
import pathlib

import bpy
from mathutils import Vector


glb_path = pathlib.Path(os.environ["GLB_PATH"])
out_path = pathlib.Path(os.environ["OUT_PATH"])

bpy.ops.object.select_all(action="SELECT")
bpy.ops.object.delete()
bpy.ops.import_scene.gltf(filepath=str(glb_path))

mesh_objects = [obj for obj in bpy.context.scene.objects if obj.type == "MESH"]
vertices = sum(len(obj.data.vertices) for obj in mesh_objects)
triangles = 0
for obj in mesh_objects:
    for poly in obj.data.polygons:
        triangles += max(1, len(poly.vertices) - 2)

all_corners = []
for obj in mesh_objects:
    for corner in obj.bound_box:
        all_corners.append(obj.matrix_world @ Vector(corner))

if all_corners:
    mins = [min(v[i] for v in all_corners) for i in range(3)]
    maxs = [max(v[i] for v in all_corners) for i in range(3)]
else:
    mins = [0, 0, 0]
    maxs = [0, 0, 0]

size = [maxs[i] - mins[i] for i in range(3)]
center = [(maxs[i] + mins[i]) / 2 for i in range(3)]

materials = []
images = []
for mat in bpy.data.materials:
    materials.append(
        {
            "name": mat.name,
            "use_nodes": mat.use_nodes,
            "diffuse_color": list(mat.diffuse_color),
        }
    )

for img in bpy.data.images:
    images.append(
        {
            "name": img.name,
            "size": list(img.size),
            "filepath": img.filepath,
            "packed": img.packed_file is not None,
        }
    )

report = {
    "file": str(glb_path),
    "file_bytes": glb_path.stat().st_size,
    "blender_version": bpy.app.version_string,
    "objects": len(bpy.context.scene.objects),
    "mesh_objects": len(mesh_objects),
    "vertices": vertices,
    "triangles": triangles,
    "bbox": {"min": mins, "max": maxs, "size": size, "center": center},
    "materials": materials,
    "images": images,
}

out_path.write_text(json.dumps(report, indent=2), encoding="utf-8")
