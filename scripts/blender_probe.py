import pathlib

import bpy

out = pathlib.Path("C:/Code/IA_para_Vida/.blender-probe.txt")
out.write_text(f"BLENDER_OK {bpy.app.version_string}\n", encoding="utf-8")
