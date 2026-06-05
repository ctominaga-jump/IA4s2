// Auditoria dos Evolution Kits (GLB Asset Engineer): peso, triângulos,
// vértices, bounding box, materiais e ausência de dados proibidos
// (texturas, animações, câmeras, luzes, skins, extensões com decoder).
//
// Sai com código 1 se qualquer kit violar o contrato do design spec
// (docs/product-evolution/15-evolution-kits-design-spec.md).
//
// Uso: node scripts/inspect-kits.mjs
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { statSync } from "node:fs";

const AVATARS = ["aurora", "brasa", "verdejante", "nebulosa"];
const PHASES = [
  "explorador",
  "estrategista",
  "criador",
  "operador",
  "arquiteto",
  "boss-final",
];

// Orçamentos do design spec.
const MAX_KB = 150;
const MAX_TRIS = 8000;
// Envelope espacial: espaço do avatar base (altura 1.0) com folga para anéis
// orbitais (r<=0.66) e halo (y<=0.72).
const MAX_XZ = 0.7;
const MAX_Y = 0.75;

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
let failures = 0;
const rows = [];

function getWorldBounds(doc) {
  // Percorre nós com mesh aplicando TRS (sem hierarquia profunda: root + 1 nível).
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  const visit = (node, parentMatrix) => {
    const m = multiply(parentMatrix, trsMatrix(node));
    const mesh = node.getMesh();
    if (mesh) {
      for (const prim of mesh.listPrimitives()) {
        const pos = prim.getAttribute("POSITION");
        const arr = pos.getArray();
        for (let i = 0; i < arr.length; i += 3) {
          const p = applyMatrix(m, [arr[i], arr[i + 1], arr[i + 2]]);
          for (let k = 0; k < 3; k++) {
            if (p[k] < min[k]) min[k] = p[k];
            if (p[k] > max[k]) max[k] = p[k];
          }
        }
      }
    }
    for (const child of node.listChildren()) visit(child, m);
  };
  for (const scene of doc.getRoot().listScenes()) {
    for (const node of scene.listChildren()) visit(node, identity());
  }
  return { min, max };
}

const identity = () => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
function trsMatrix(node) {
  const [tx, ty, tz] = node.getTranslation();
  const [qx, qy, qz, qw] = node.getRotation();
  const [sx, sy, sz] = node.getScale();
  const x2 = qx + qx, y2 = qy + qy, z2 = qz + qz;
  const xx = qx * x2, xy = qx * y2, xz = qx * z2;
  const yy = qy * y2, yz = qy * z2, zz = qz * z2;
  const wx = qw * x2, wy = qw * y2, wz = qw * z2;
  return [
    (1 - (yy + zz)) * sx, (xy + wz) * sx, (xz - wy) * sx, 0,
    (xy - wz) * sy, (1 - (xx + zz)) * sy, (yz + wx) * sy, 0,
    (xz + wy) * sz, (yz - wx) * sz, (1 - (xx + yy)) * sz, 0,
    tx, ty, tz, 1,
  ];
}
function multiply(a, b) {
  const out = new Array(16).fill(0);
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      for (let k = 0; k < 4; k++) out[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k];
    }
  }
  return out;
}
function applyMatrix(m, [x, y, z]) {
  return [
    m[0] * x + m[4] * y + m[8] * z + m[12],
    m[1] * x + m[5] * y + m[9] * z + m[13],
    m[2] * x + m[6] * y + m[10] * z + m[14],
  ];
}

for (const avatar of AVATARS) {
  for (const phase of PHASES) {
    const file = `public/assets/3d/avatar-${avatar}-kit-${phase}.glb`;
    const problems = [];
    let row;
    try {
      const kb = statSync(file).size / 1024;
      const doc = await io.read(file);
      const root = doc.getRoot();

      let tris = 0;
      let verts = 0;
      for (const mesh of root.listMeshes()) {
        for (const prim of mesh.listPrimitives()) {
          tris += (prim.getIndices()?.getCount() ?? 0) / 3;
          verts += prim.getAttribute("POSITION")?.getCount() ?? 0;
        }
      }
      const { min, max } = getWorldBounds(doc);

      if (kb > MAX_KB) problems.push(`peso ${kb.toFixed(0)}KB > ${MAX_KB}KB`);
      if (tris > MAX_TRIS) problems.push(`tris ${tris} > ${MAX_TRIS}`);
      if (root.listTextures().length) problems.push("tem texturas");
      if (root.listAnimations().length) problems.push("tem animações");
      if (root.listCameras().length) problems.push("tem câmeras");
      if (root.listSkins().length) problems.push("tem skins");
      const exts = doc.getRoot().listExtensionsUsed().map((e) => e.extensionName);
      if (exts.length) problems.push(`extensões: ${exts.join(",")}`);
      const r = Math.max(
        Math.abs(min[0]), Math.abs(max[0]), Math.abs(min[2]), Math.abs(max[2]),
      );
      if (r > MAX_XZ) problems.push(`raio XZ ${r.toFixed(2)} > ${MAX_XZ}`);
      if (Math.abs(min[1]) > MAX_Y || Math.abs(max[1]) > MAX_Y) {
        problems.push(`Y [${min[1].toFixed(2)}, ${max[1].toFixed(2)}] fora de ±${MAX_Y}`);
      }

      row = {
        kit: `${avatar}/${phase}`,
        kb: kb.toFixed(1),
        tris: Math.round(tris),
        verts,
        mats: root.listMaterials().length,
        bounds: `XZ≤${r.toFixed(2)} Y[${min[1].toFixed(2)},${max[1].toFixed(2)}]`,
        status: problems.length ? `FALHA: ${problems.join("; ")}` : "ok",
      };
    } catch (err) {
      row = { kit: `${avatar}/${phase}`, status: `ERRO: ${err.message}` };
      problems.push(String(err));
    }
    if (problems.length) failures++;
    rows.push(row);
  }
}

console.table(rows);
const totalKb = rows.reduce((s, r) => s + Number(r.kb ?? 0), 0);
console.log(`total: ${rows.length} kits, ${(totalKb / 1024).toFixed(2)} MB`);
if (failures) {
  console.error(`\n${failures} kit(s) fora do contrato.`);
  process.exit(1);
}
console.log("todos os kits dentro do contrato do design spec.");
