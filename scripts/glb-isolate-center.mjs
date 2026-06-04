// Isola o robô central de um GLB de turnaround Tripo (3 robôs em fileira no
// eixo Z), recentra na origem e normaliza a altura para 1.0 no eixo Y — a
// mesma convenção do avatar-aurora.glb (pipeline Blender). Útil quando o
// Blender não está disponível e o GLB intermediário saiu do
// `@gltf-transform/cli optimize` com os 3 robôs fundidos num único mesh.
//
// Uso: node scripts/glb-isolate-center.mjs <in.glb> <out.glb>
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { prune } from "@gltf-transform/functions";

const [inPath, outPath] = process.argv.slice(2);
if (!inPath || !outPath) {
  console.error("uso: node scripts/glb-isolate-center.mjs <in.glb> <out.glb>");
  process.exit(1);
}

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
const doc = await io.read(inPath);
const root = doc.getRoot();

const meshes = root.listMeshes();
if (meshes.length !== 1 || meshes[0].listPrimitives().length !== 1) {
  console.error(
    `esperado 1 mesh/1 primitive (turnaround joined); achei ${meshes.length} mesh(es)`,
  );
  process.exit(1);
}

const prim = meshes[0].listPrimitives()[0];
const pos = prim.getAttribute("POSITION");
const indices = prim.getIndices();
if (!indices) {
  console.error("esperado primitive indexado (turnaround pos-optimize)");
  process.exit(1);
}
const posArr = pos.getArray();
const idxArr = indices.getArray();

// 1) Centroide Z por triângulo -> recorte do terço central da fileira.
const [zMin, zMax] = [pos.getMin([])[2], pos.getMax([])[2]];
const span = zMax - zMin;
const cutLo = zMin + span / 3;
const cutHi = zMax - span / 3;

const keptIdx = [];
for (let t = 0; t < idxArr.length; t += 3) {
  const [a, b, c] = [idxArr[t], idxArr[t + 1], idxArr[t + 2]];
  const z = (posArr[a * 3 + 2] + posArr[b * 3 + 2] + posArr[c * 3 + 2]) / 3;
  if (z >= cutLo && z <= cutHi) keptIdx.push(a, b, c);
}
console.log(
  `${inPath}: tris ${idxArr.length / 3} -> ${keptIdx.length / 3} (recorte Z [${cutLo.toFixed(3)}, ${cutHi.toFixed(3)}])`,
);

// 2) Remapeia vértices usados (compacta os atributos).
const remap = new Map();
const newIdx = new Uint32Array(keptIdx.length);
for (let i = 0; i < keptIdx.length; i++) {
  const old = keptIdx[i];
  if (!remap.has(old)) remap.set(old, remap.size);
  newIdx[i] = remap.get(old);
}
const vertCount = remap.size;

for (const semantic of prim.listSemantics()) {
  const attr = prim.getAttribute(semantic);
  const src = attr.getArray();
  const n = attr.getElementSize();
  const dst = new src.constructor(vertCount * n);
  for (const [old, neu] of remap) {
    for (let k = 0; k < n; k++) dst[neu * n + k] = src[old * n + k];
  }
  attr.setArray(dst);
}
indices.setArray(newIdx);

// 3) Recentra na origem e normaliza altura Y = 1.0 (baked nos vértices).
const p = prim.getAttribute("POSITION").getArray();
const min = [Infinity, Infinity, Infinity];
const max = [-Infinity, -Infinity, -Infinity];
for (let i = 0; i < p.length; i += 3) {
  for (let k = 0; k < 3; k++) {
    if (p[i + k] < min[k]) min[k] = p[i + k];
    if (p[i + k] > max[k]) max[k] = p[i + k];
  }
}
const center = [0, 1, 2].map((k) => (min[k] + max[k]) / 2);
const height = max[1] - min[1];
const s = 1 / height;
for (let i = 0; i < p.length; i += 3) {
  for (let k = 0; k < 3; k++) p[i + k] = (p[i + k] - center[k]) * s;
}
prim.getAttribute("POSITION").setArray(p);
console.log(
  `altura original ${height.toFixed(3)} -> 1.0; centro ${center.map((v) => v.toFixed(3)).join(", ")} -> origem`,
);

// 4) Remove recursos órfãos e zera transforms de nó (posições já em world-ish
// space do mesh único pós-optimize/join).
await doc.transform(prune());

await io.write(outPath, doc);
console.log(`gravado ${outPath}`);
