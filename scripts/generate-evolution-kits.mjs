// Gera os 24 Evolution Kits (4 avatares x 6 fases) como GLBs paramétricos via
// @gltf-transform/core — fluxo reproduzível sem Blender (decisão registrada em
// docs/product-evolution/15-evolution-kits-design-spec.md).
//
// Convenções (contrato com o app):
// - Espaço de autoria = espaço do GLB base: Y-up, origem no centro, avatar
//   ocupa Y [-0.5, +0.5]. O app escala base + kit juntos (x1.9).
// - Sem câmeras, luzes, animações, texturas ou compressão (sem decoder externo).
// - Materiais PBR por fator; emissivos para leitura em 150 px.
// - Nomes estáveis: root `Kit_<Avatar>_<Fase>`, filhos `kit_<avatar>_<fase>_<modulo>`.
//
// Uso: node scripts/generate-evolution-kits.mjs
import { Document, NodeIO } from "@gltf-transform/core";
import { mkdir } from "node:fs/promises";
import { statSync } from "node:fs";

const OUT_DIR = "public/assets/3d";

// ---------------------------------------------------------------------------
// Anatomia de referência (bbox dos GLBs base normalizados, altura 1.0).
const VISOR_Y = 0.3;
const SHOULDER_Y = 0.24;
const SHOULDER_X = 0.21;
const CHEST_Y = 0.1;
const CHEST_Z = 0.21;
const HIP_Y = -0.15;
const HAND_Y = -0.05;
const HAND_X = 0.34;
const HALO_Y = 0.62;
const CROWN_Y = 0.56;
// Badge atrás do avatar, DESLOCADO lateralmente para cima: visível espreitando
// ao lado da cabeça/ombro mesmo na vista frontal (correção da revisão UX —
// centrado em x=0 ficava 100% oculto atrás do torso quando congelado).
const BADGE_Z = -0.3;
const BADGE_Y = 0.36;
const BADGE_X = 0.19;

// ---------------------------------------------------------------------------
// Cores (briefs JSON). glTF usa fatores LINEARES; os hex são sRGB.
const PALETTES = {
  aurora: { primary: "#16D9E3", secondary: "#6D5DF7", shell: "#1B2540" },
  brasa: { primary: "#FFC857", secondary: "#FF5C7A", shell: "#2A1824" },
  verdejante: { primary: "#3EE58F", secondary: "#16D9E3", shell: "#17302B" },
  nebulosa: { primary: "#6D5DF7", secondary: "#FF5C7A", shell: "#211A3A" },
};
const AMBER = "#FFC857";

function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
function hexToLinear(hex) {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) =>
    srgbToLinear(v / 255),
  );
}

// ---------------------------------------------------------------------------
// Geometrias paramétricas: retornam { positions, normals, indices }.

/** Torus no plano XZ (anel em volta do eixo Y). */
function torusGeo(R, r, tubularSegs = 48, radialSegs = 8) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let i = 0; i <= tubularSegs; i++) {
    const th = (i / tubularSegs) * Math.PI * 2;
    const ct = Math.cos(th);
    const st = Math.sin(th);
    for (let j = 0; j <= radialSegs; j++) {
      const ph = (j / radialSegs) * Math.PI * 2;
      const cp = Math.cos(ph);
      const sp = Math.sin(ph);
      positions.push((R + r * cp) * ct, r * sp, (R + r * cp) * st);
      normals.push(cp * ct, sp, cp * st);
    }
  }
  const row = radialSegs + 1;
  for (let i = 0; i < tubularSegs; i++) {
    for (let j = 0; j < radialSegs; j++) {
      const a = i * row + j;
      const b = (i + 1) * row + j;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return pack(positions, normals, indices);
}

/** Esfera lat-long. */
function sphereGeo(r, wSegs = 12, hSegs = 8) {
  const positions = [];
  const normals = [];
  const indices = [];
  for (let y = 0; y <= hSegs; y++) {
    const v = y / hSegs;
    const phi = v * Math.PI;
    for (let x = 0; x <= wSegs; x++) {
      const u = x / wSegs;
      const th = u * Math.PI * 2;
      const nx = Math.sin(phi) * Math.cos(th);
      const ny = Math.cos(phi);
      const nz = Math.sin(phi) * Math.sin(th);
      positions.push(r * nx, r * ny, r * nz);
      normals.push(nx, ny, nz);
    }
  }
  const row = wSegs + 1;
  for (let y = 0; y < hSegs; y++) {
    for (let x = 0; x < wSegs; x++) {
      const a = y * row + x;
      const b = (y + 1) * row + x;
      indices.push(a, b, a + 1, b, b + 1, a + 1);
    }
  }
  return pack(positions, normals, indices);
}

/** Cilindro/cone ao longo de Y, centrado na origem. rTop=0 => cone. */
function cylGeo(rTop, rBot, h, segs = 16, caps = true) {
  const positions = [];
  const normals = [];
  const indices = [];
  const half = h / 2;
  const slope = (rBot - rTop) / h;
  for (let i = 0; i <= segs; i++) {
    const th = (i / segs) * Math.PI * 2;
    const c = Math.cos(th);
    const s = Math.sin(th);
    const nl = Math.hypot(1, slope);
    positions.push(rTop * c, half, rTop * s);
    normals.push(c / nl, slope / nl, s / nl);
    positions.push(rBot * c, -half, rBot * s);
    normals.push(c / nl, slope / nl, s / nl);
  }
  for (let i = 0; i < segs; i++) {
    const a = i * 2;
    indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
  }
  if (caps) {
    for (const [r, y, ny] of [
      [rTop, half, 1],
      [rBot, -half, -1],
    ]) {
      if (r <= 0) continue;
      const center = positions.length / 3;
      positions.push(0, y, 0);
      normals.push(0, ny, 0);
      for (let i = 0; i <= segs; i++) {
        const th = (i / segs) * Math.PI * 2;
        positions.push(r * Math.cos(th), y, r * Math.sin(th));
        normals.push(0, ny, 0);
      }
      for (let i = 0; i < segs; i++) {
        if (ny > 0) indices.push(center, center + 1 + i + 1, center + 1 + i);
        else indices.push(center, center + 1 + i, center + 1 + i + 1);
      }
    }
  }
  return pack(positions, normals, indices);
}

/** Caixa flat-shaded. */
function boxGeo(w, h, d) {
  const x = w / 2;
  const y = h / 2;
  const z = d / 2;
  const faces = [
    // +X -X +Y -Y +Z -Z : [normal, 4 cantos CCW vistos de fora]
    [[1, 0, 0], [[x, -y, -z], [x, y, -z], [x, y, z], [x, -y, z]]],
    [[-1, 0, 0], [[-x, -y, z], [-x, y, z], [-x, y, -z], [-x, -y, -z]]],
    [[0, 1, 0], [[-x, y, -z], [-x, y, z], [x, y, z], [x, y, -z]]],
    [[0, -1, 0], [[-x, -y, z], [-x, -y, -z], [x, -y, -z], [x, -y, z]]],
    [[0, 0, 1], [[-x, -y, z], [x, -y, z], [x, y, z], [-x, y, z]]],
    [[0, 0, -1], [[x, -y, -z], [-x, -y, -z], [-x, y, -z], [x, y, -z]]],
  ];
  const positions = [];
  const normals = [];
  const indices = [];
  for (const [n, corners] of faces) {
    const base = positions.length / 3;
    for (const c of corners) {
      positions.push(...c);
      normals.push(...n);
    }
    indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  return pack(positions, normals, indices);
}

/** Tetraedro flat-shaded (size = circunraio). */
function tetraGeo(size) {
  const s = size / Math.sqrt(3);
  const v = [
    [s, s, s],
    [s, -s, -s],
    [-s, s, -s],
    [-s, -s, s],
  ];
  const faces = [
    [0, 1, 2],
    [0, 3, 1],
    [0, 2, 3],
    [1, 3, 2],
  ];
  const positions = [];
  const normals = [];
  const indices = [];
  for (const [a, b, c] of faces) {
    const base = positions.length / 3;
    const [pa, pb, pc] = [v[a], v[b], v[c]];
    const u = sub(pb, pa);
    const w = sub(pc, pa);
    const n = norm(cross(u, w));
    for (const p of [pa, pb, pc]) {
      positions.push(...p);
      normals.push(...n);
    }
    indices.push(base, base + 1, base + 2);
  }
  return pack(positions, normals, indices);
}

function pack(positions, normals, indices) {
  return {
    positions: new Float32Array(positions),
    normals: new Float32Array(normals),
    indices: new Uint16Array(indices),
  };
}

// Vetores ----------------------------------------------------------------
const sub = (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross = (a, b) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
function norm(v) {
  const l = Math.hypot(...v) || 1;
  return [v[0] / l, v[1] / l, v[2] / l];
}

/** Euler XYZ (rad) -> quaternion [x,y,z,w]. */
function eulerToQuat([ex, ey, ez]) {
  const cx = Math.cos(ex / 2);
  const sx = Math.sin(ex / 2);
  const cy = Math.cos(ey / 2);
  const sy = Math.sin(ey / 2);
  const cz = Math.cos(ez / 2);
  const sz = Math.sin(ez / 2);
  return [
    sx * cy * cz + cx * sy * sz,
    cx * sy * cz - sx * cy * sz,
    cx * cy * sz + sx * sy * cz,
    cx * cy * cz - sx * sy * sz,
  ];
}

/** Quaternion que alinha o eixo +Y à direção d. */
function quatYTo(d) {
  const y = [0, 1, 0];
  const dn = norm(d);
  const dot = y[1] * dn[1] + y[0] * dn[0] + y[2] * dn[2];
  if (dot > 0.9999) return [0, 0, 0, 1];
  if (dot < -0.9999) return [1, 0, 0, 0]; // 180° em X
  const ax = norm(cross(y, dn));
  const ang = Math.acos(dot);
  const s = Math.sin(ang / 2);
  return [ax[0] * s, ax[1] * s, ax[2] * s, Math.cos(ang / 2)];
}

// ---------------------------------------------------------------------------
// Poliedros para frames de arestas-tubo (wireframe estrutural — glTF não tem
// material wireframe; arestas viram cilindros finos reutilizando 1 mesh).

function icosaVerts(R) {
  const t = (1 + Math.sqrt(5)) / 2;
  const raw = [
    [-1, t, 0], [1, t, 0], [-1, -t, 0], [1, -t, 0],
    [0, -1, t], [0, 1, t], [0, -1, -t], [0, 1, -t],
    [t, 0, -1], [t, 0, 1], [-t, 0, -1], [-t, 0, 1],
  ];
  const l = Math.hypot(1, t);
  return raw.map((v) => v.map((c) => (c / l) * R));
}
function icosaEdges() {
  const faces = [
    [0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11],
    [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8],
    [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9],
    [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1],
  ];
  const set = new Set();
  for (const [a, b, c] of faces) {
    for (const [u, v] of [[a, b], [b, c], [c, a]]) {
      set.add(u < v ? `${u},${v}` : `${v},${u}`);
    }
  }
  return [...set].map((s) => s.split(",").map(Number));
}
function octaVerts(R) {
  return [
    [R, 0, 0], [-R, 0, 0], [0, R, 0], [0, -R, 0], [0, 0, R], [0, 0, -R],
  ];
}
function octaEdges() {
  return [
    [0, 2], [0, 3], [0, 4], [0, 5],
    [1, 2], [1, 3], [1, 4], [1, 5],
    [2, 4], [4, 3], [3, 5], [5, 2],
  ];
}
function boxFrameVerts(w, h, d) {
  const x = w / 2, y = h / 2, z = d / 2;
  return [
    [-x, -y, -z], [x, -y, -z], [x, -y, z], [-x, -y, z],
    [-x, y, -z], [x, y, -z], [x, y, z], [-x, y, z],
  ];
}
function boxFrameEdges() {
  return [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
}

/** Frame de arestas: 1 cilindro unitário reutilizado em N nós (TRS). */
function frame(name, verts, edges, tubeR, mat) {
  const parts = [];
  edges.forEach(([a, b], i) => {
    const pa = verts[a];
    const pb = verts[b];
    const mid = [(pa[0] + pb[0]) / 2, (pa[1] + pb[1]) / 2, (pa[2] + pb[2]) / 2];
    const dir = sub(pb, pa);
    const len = Math.hypot(...dir);
    parts.push({
      name: `${name}${String(i).padStart(2, "0")}`,
      geo: ["cyl", tubeR, tubeR, 1, 6, false],
      pos: mid,
      quat: quatYTo(dir),
      scale: [1, len, 1],
      mat,
    });
  });
  return parts;
}

/** N nós (esferas por padrão) distribuídos num anel horizontal. */
function ringNodes(name, count, R, y, size, mat, geo) {
  const parts = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2;
    parts.push({
      name: `${name}${i}`,
      geo: geo ?? ["sphere", size, 10, 7],
      pos: [Math.cos(a) * R, y, Math.sin(a) * R],
      mat,
    });
  }
  return parts;
}

/** Espelha uma parte em X (par esquerda/direita). */
function mirrored(part) {
  const m = structuredClone(part);
  m.name = `${part.name}R`;
  m.pos = [-part.pos[0], part.pos[1], part.pos[2]];
  if (m.rot) m.rot = [part.rot[0], -part.rot[1], -part.rot[2]];
  return [{ ...structuredClone(part), name: `${part.name}L` }, m];
}

// ---------------------------------------------------------------------------
// Composers compartilhados (expressos na gramática de cada avatar via params).

function crown(name, ringR, mat, spikeGeo, spikeCount, spikeMat) {
  const parts = [
    {
      name: `${name}Ring`,
      geo: ["torus", ringR, 0.018, 40, 8],
      pos: [0, CROWN_Y, 0],
      mat,
    },
  ];
  for (let i = 0; i < spikeCount; i++) {
    const a = (i / spikeCount) * Math.PI * 2;
    parts.push({
      name: `${name}Spike${i}`,
      geo: spikeGeo,
      pos: [Math.cos(a) * ringR, CROWN_Y + 0.04, Math.sin(a) * ringR],
      mat: spikeMat ?? mat,
    });
  }
  return parts;
}

function chestCore(name, mat) {
  return [
    {
      name,
      geo: ["sphere", 0.045, 14, 10],
      pos: [0, CHEST_Y + 0.02, CHEST_Z],
      mat,
    },
  ];
}

function chestLights(name, mat) {
  return [-0.07, 0, 0.07].map((x, i) => ({
    name: `${name}${i}`,
    geo: ["cyl", 0.022, 0.022, 0.014, 12],
    pos: [x, CHEST_Y + 0.04, CHEST_Z],
    rot: [Math.PI / 2, 0, 0],
    mat,
  }));
}

function visorBar(name, mat, w = 0.15) {
  // Abaixo da linha do visor — nunca cobre o visor.
  return [
    {
      name,
      geo: ["box", w, 0.018, 0.012],
      pos: [0, VISOR_Y - 0.07, CHEST_Z - 0.005],
      mat,
    },
  ];
}

function cuffs(name, mat) {
  return mirrored({
    name,
    geo: ["torus", 0.055, 0.012, 24, 6],
    pos: [SHOULDER_X + 0.07, 0.02, 0.02],
    rot: [0, 0, 0.35],
    mat,
  });
}

function armStrips(name, mat, double = false) {
  const strip = (suffix, off) =>
    mirrored({
      name: `${name}${suffix}`,
      geo: ["box", 0.022, 0.24, 0.016],
      pos: [SHOULDER_X + 0.06 + off, 0.08, 0.03],
      rot: [0, 0, -0.18],
      mat,
    });
  return double ? [...strip("A", 0), ...strip("B", 0.045)] : strip("", 0);
}

// ---------------------------------------------------------------------------
// Definições dos 24 kits.

const KITS = {
  aurora: {
    explorador: (m) => [
      // Anel INCLINADO: horizontal visto de frente virava risco no torso
      // (correção da revisão UX) — inclinado lê como órbita elíptica.
      {
        name: "ring",
        geo: ["torus", 0.5, 0.01, 56, 8],
        pos: [0, 0.05, 0],
        rot: [0.3, 0, 0.06],
        mat: m.primary,
      },
      // Bússola holográfica: disco hex + agulha.
      {
        name: "compassDisc",
        geo: ["cyl", 0.06, 0.06, 0.016, 6],
        pos: [0, CHEST_Y + 0.03, CHEST_Z],
        rot: [Math.PI / 2, 0, 0],
        mat: m.shell,
      },
      {
        name: "compassNeedle",
        geo: ["box", 0.014, 0.085, 0.01],
        pos: [0, CHEST_Y + 0.03, CHEST_Z + 0.014],
        rot: [0, 0, -0.5],
        mat: m.primary,
      },
      ...visorBar("visorBar", m.primary),
    ],
    estrategista: (m) => [
      // Placas hex com massa de silhueta (correção UX: legível em 150 px).
      ...mirrored({
        name: "shoulderPlate",
        geo: ["cyl", 0.105, 0.105, 0.032, 6],
        pos: [SHOULDER_X + 0.045, SHOULDER_Y + 0.055, 0],
        rot: [0, 0, -0.28],
        mat: m.secondary,
      }),
      // Linhas de circuito no torso.
      {
        name: "circuitA",
        geo: ["box", 0.018, 0.16, 0.012],
        pos: [-0.08, CHEST_Y - 0.02, CHEST_Z - 0.01],
        mat: m.primary,
      },
      {
        name: "circuitB",
        geo: ["box", 0.018, 0.12, 0.012],
        pos: [0.08, CHEST_Y, CHEST_Z - 0.01],
        mat: m.secondary,
      },
      // Badge hex duplo atrás, espreitando ao lado da cabeça.
      {
        name: "badgeOuter",
        geo: ["cyl", 0.115, 0.115, 0.016, 6],
        pos: [BADGE_X, BADGE_Y, BADGE_Z],
        rot: [Math.PI / 2, 0, 0],
        mat: m.shell,
      },
      {
        name: "badgeInner",
        geo: ["cyl", 0.07, 0.07, 0.024, 6],
        pos: [BADGE_X, BADGE_Y, BADGE_Z],
        rot: [Math.PI / 2, 0, 0],
        mat: m.secondary,
      },
    ],
    criador: (m) => [
      // Microcubos de prototipagem orbitando as mãos.
      ...[
        [HAND_X + 0.04, HAND_Y + 0.08, 0.06],
        [HAND_X + 0.09, HAND_Y - 0.02, 0.0],
        [-HAND_X - 0.04, HAND_Y + 0.06, 0.05],
        [-HAND_X - 0.09, HAND_Y - 0.04, -0.02],
      ].map((pos, i) => ({
        name: `protoCube${i}`,
        geo: ["box", 0.035, 0.035, 0.035],
        pos,
        rot: [0.4 * i, 0.6 * i, 0.2],
        mat: i % 2 ? m.secondary : m.primary,
      })),
      ...cuffs("cuff", m.primary),
      // Visor com pulso: 3 nós sob o visor.
      ...[-0.045, 0, 0.045].map((x, i) => ({
        name: `pulse${i}`,
        geo: ["sphere", 0.012, 8, 6],
        pos: [x, VISOR_Y - 0.07, CHEST_Z - 0.005],
        mat: m.primary,
      })),
    ],
    operador: (m) => [
      ...armStrips("autoLine", m.primary),
      {
        name: "railA",
        geo: ["torus", 0.48, 0.008, 56, 8],
        pos: [0, 0.02, 0],
        rot: [0.14, 0, 0],
        mat: m.primary,
      },
      {
        name: "railB",
        geo: ["torus", 0.58, 0.008, 56, 8],
        pos: [0, 0.02, 0],
        rot: [-0.14, 0, 0],
        mat: m.secondary,
      },
      ...chestLights("seqLight", m.primary),
    ],
    arquiteto: (m) => [
      ...frame("cage", icosaVerts(0.55), icosaEdges(), 0.006, m.primary),
      ...mirrored({
        name: "pauldron",
        geo: ["cyl", 0.08, 0.08, 0.025, 6],
        pos: [SHOULDER_X + 0.04, SHOULDER_Y + 0.05, 0],
        rot: [0, 0, -0.3],
        mat: m.shell,
      }),
      {
        name: "blueprintRing",
        geo: ["torus", 0.62, 0.007, 64, 8],
        pos: [0, 0, 0],
        mat: m.secondary,
      },
      ...ringNodes("tick", 4, 0.62, 0, 0.018, m.secondary),
    ],
    "boss-final": (m) => [
      {
        name: "haloA",
        geo: ["torus", 0.2, 0.014, 48, 8],
        pos: [0, HALO_Y, 0],
        mat: m.primary,
      },
      {
        name: "haloB",
        geo: ["torus", 0.245, 0.01, 48, 8],
        pos: [0, HALO_Y + 0.015, 0],
        mat: m.secondary,
      },
      ...crown("crown", 0.16, m.primary, ["box", 0.022, 0.06, 0.022], 5, m.secondary),
      ...chestCore("core", m.primary),
      ...mirrored({
        name: "shoulderCap",
        geo: ["sphere", 0.055, 12, 8],
        pos: [SHOULDER_X + 0.03, SHOULDER_Y + 0.03, 0],
        scale: [1, 0.55, 1],
        mat: m.shell,
      }),
    ],
  },

  brasa: {
    explorador: (m) => [
      // Anel inclinado = trajetória.
      {
        name: "ring",
        geo: ["torus", 0.5, 0.013, 56, 8],
        pos: [0, 0.06, 0],
        rot: [0.38, 0, 0.1],
        mat: m.primary,
      },
      // Módulo seta (chevron) no peito.
      {
        name: "chevronL",
        geo: ["box", 0.055, 0.016, 0.012],
        pos: [-0.022, CHEST_Y + 0.02, CHEST_Z],
        rot: [0, 0, 0.6],
        mat: m.primary,
      },
      {
        name: "chevronR",
        geo: ["box", 0.055, 0.016, 0.012],
        pos: [0.022, CHEST_Y + 0.02, CHEST_Z],
        rot: [0, 0, -0.6],
        mat: m.primary,
      },
      ...visorBar("visorGlow", m.primary, 0.17),
    ],
    estrategista: (m) => [
      // Chevrons de ombro com massa de silhueta (correção UX).
      ...mirrored({
        name: "shoulderChevron",
        geo: ["box", 0.13, 0.034, 0.028],
        pos: [SHOULDER_X + 0.045, SHOULDER_Y + 0.055, 0],
        rot: [0, 0, -0.5],
        mat: m.secondary,
      }),
      // Strips em rota/seta no torso.
      ...[-0.06, 0, 0.06].map((x, i) => ({
        name: `route${i}`,
        geo: ["box", 0.02, 0.11 - Math.abs(x) * 0.5, 0.012],
        pos: [x, CHEST_Y - 0.04 + Math.abs(x) * 0.4, CHEST_Z - 0.01],
        rot: [0, 0, x === 0 ? 0 : x > 0 ? -0.35 : 0.35],
        mat: m.primary,
      })),
      // Badge triangular tático atrás, espreitando ao lado da cabeça.
      {
        name: "badgeOuter",
        geo: ["cyl", 0.13, 0.13, 0.016, 3],
        pos: [BADGE_X, BADGE_Y, BADGE_Z],
        rot: [Math.PI / 2, 0, 0],
        mat: m.shell,
      },
      {
        name: "badgeInner",
        geo: ["cyl", 0.08, 0.08, 0.024, 3],
        pos: [BADGE_X, BADGE_Y, BADGE_Z],
        rot: [Math.PI / 2, 0, Math.PI],
        mat: m.secondary,
      },
    ],
    criador: (m) => [
      // Faíscas estilizadas (tetraedros, não chamas).
      ...[
        [HAND_X + 0.05, HAND_Y + 0.07, 0.05],
        [HAND_X + 0.1, HAND_Y - 0.03, 0.0],
        [-HAND_X - 0.05, HAND_Y + 0.05, 0.04],
        [-HAND_X - 0.1, HAND_Y - 0.05, -0.02],
      ].map((pos, i) => ({
        name: `spark${i}`,
        geo: ["tetra", 0.034],
        pos,
        rot: [0.7 * i, 0.9 * i, 0.3],
        mat: i % 2 ? m.secondary : m.primary,
      })),
      ...cuffs("forgeCuff", m.primary),
      // Módulos laterais robustos no quadril.
      ...mirrored({
        name: "sideModule",
        geo: ["box", 0.05, 0.08, 0.06],
        pos: [0.26, HIP_Y, 0],
        rot: [0, 0, -0.1],
        mat: m.shell,
      }),
    ],
    operador: (m) => [
      ...armStrips("execTrack", m.primary, true),
      // Anéis angulares (seção hex) mais rápidos.
      {
        name: "railA",
        geo: ["torus", 0.46, 0.011, 32, 6],
        pos: [0, 0.04, 0],
        rot: [0.32, 0, 0],
        mat: m.primary,
      },
      {
        name: "railB",
        geo: ["torus", 0.56, 0.011, 32, 6],
        pos: [0, 0.04, 0],
        rot: [-0.24, 0, 0.12],
        mat: m.secondary,
      },
      ...chestLights("amberSeq", m.primary),
    ],
    arquiteto: (m) => [
      // Exoestrutura octaédrica (motivo triangular).
      ...frame("exo", octaVerts(0.55), octaEdges(), 0.008, m.primary),
      ...mirrored({
        name: "pauldron",
        geo: ["cyl", 0.085, 0.085, 0.026, 3],
        pos: [SHOULDER_X + 0.04, SHOULDER_Y + 0.05, 0],
        rot: [Math.PI / 2, 0, -0.3],
        mat: m.shell,
      }),
      {
        name: "matrixRing",
        geo: ["torus", 0.6, 0.008, 48, 6],
        pos: [0, 0, 0],
        rot: [0.1, 0, 0],
        mat: m.secondary,
      },
      ...ringNodes("arrow", 3, 0.6, 0, 0.024, m.secondary, ["tetra", 0.028]),
    ],
    "boss-final": (m) => [
      // Coroa âmbar de pontas curtas.
      ...crown("crown", 0.17, m.primary, ["cyl", 0, 0.022, 0.06, 8], 5),
      {
        name: "halo",
        geo: ["torus", 0.22, 0.013, 48, 8],
        pos: [0, HALO_Y, 0],
        rot: [0.17, 0, 0],
        mat: m.secondary,
      },
      ...chestCore("core", m.primary),
      // Caps heroicos.
      ...mirrored({
        name: "heroCap",
        geo: ["sphere", 0.062, 12, 8],
        pos: [SHOULDER_X + 0.035, SHOULDER_Y + 0.035, 0],
        scale: [1, 0.6, 1],
        mat: m.shell,
      }),
      ...mirrored({
        name: "capRim",
        geo: ["torus", 0.058, 0.008, 24, 6],
        pos: [SHOULDER_X + 0.035, SHOULDER_Y + 0.038, 0],
        rot: [0, 0, -0.2],
        mat: m.secondary,
      }),
    ],
  },

  verdejante: {
    explorador: (m) => [
      {
        name: "ring",
        geo: ["torus", 0.5, 0.01, 56, 8],
        pos: [0, 0.04, 0],
        mat: m.primary,
      },
      // Nós maiores: o anel horizontal visto de frente vira linha pontuada
      // pelos nós (correção UX de legibilidade em 150 px).
      ...ringNodes("progressNode", 5, 0.5, 0.04, 0.028, m.primary),
      // Broto tecnológico abstrato: 3 esferas decrescentes.
      ...[0, 1, 2].map((i) => ({
        name: `bud${i}`,
        geo: ["sphere", 0.028 - i * 0.008, 10, 7],
        pos: [0, CHEST_Y + 0.02 + i * 0.045, CHEST_Z],
        mat: i === 2 ? m.secondary : m.primary,
      })),
    ],
    estrategista: (m) => [
      // Pares de placas curvas em camadas (pétala abstrata = esfera achatada)
      // — massa de silhueta aumentada (correção da revisão UX).
      ...mirrored({
        name: "layerPlateA",
        geo: ["sphere", 0.105, 12, 8],
        pos: [SHOULDER_X + 0.045, SHOULDER_Y + 0.05, 0],
        scale: [1, 0.32, 0.75],
        rot: [0, 0, -0.3],
        mat: m.shell,
      }),
      ...mirrored({
        name: "layerPlateB",
        geo: ["sphere", 0.08, 12, 8],
        pos: [SHOULDER_X + 0.06, SHOULDER_Y + 0.095, 0],
        scale: [1, 0.32, 0.75],
        rot: [0, 0, -0.42],
        mat: m.primary,
      }),
      // Linhas ciano de planejamento.
      ...[-0.07, 0.07].map((x, i) => ({
        name: `planLine${i}`,
        geo: ["box", 0.018, 0.14, 0.012],
        pos: [x, CHEST_Y - 0.01, CHEST_Z - 0.01],
        rot: [0, 0, x > 0 ? -0.12 : 0.12],
        mat: m.secondary,
      })),
      // Badge circular em camadas atrás, espreitando ao lado da cabeça.
      {
        name: "badgeOuter",
        geo: ["torus", 0.105, 0.016, 32, 8],
        pos: [BADGE_X, BADGE_Y, BADGE_Z],
        rot: [Math.PI / 2, 0, 0],
        mat: m.secondary,
      },
      {
        name: "badgeInner",
        geo: ["cyl", 0.062, 0.062, 0.02, 24],
        pos: [BADGE_X, BADGE_Y, BADGE_Z],
        rot: [Math.PI / 2, 0, 0],
        mat: m.primary,
      },
    ],
    criador: (m) => [
      // Pods orgânico-geométricos (icosa ~ esfera low-poly).
      ...[
        [HAND_X + 0.04, HAND_Y + 0.07, 0.05],
        [HAND_X + 0.09, HAND_Y - 0.03, 0.0],
        [-HAND_X - 0.04, HAND_Y + 0.05, 0.04],
        [-HAND_X - 0.09, HAND_Y - 0.04, -0.02],
      ].map((pos, i) => ({
        name: `pod${i}`,
        geo: ["sphere", 0.028, 6, 4],
        pos,
        rot: [0.5 * i, 0.7 * i, 0],
        mat: i % 2 ? m.secondary : m.primary,
      })),
      // Grade viva: lattice 3x3 de tubos flutuando ao lado.
      ...frame(
        "lattice",
        [
          [0.3, 0.06, 0.12], [0.42, 0.06, 0.12],
          [0.3, 0.06, -0.0], [0.42, 0.06, -0.0],
          [0.3, -0.06, 0.12], [0.42, -0.06, 0.12],
          [0.3, -0.06, -0.0], [0.42, -0.06, -0.0],
        ],
        [
          [0, 1], [2, 3], [4, 5], [6, 7],
          [0, 2], [1, 3], [4, 6], [5, 7],
          [0, 4], [1, 5], [2, 6], [3, 7],
        ],
        0.005,
        m.primary,
      ),
      ...cuffs("growthCuff", m.primary),
    ],
    operador: (m) => [
      // Veios luminosos nos braços/torso.
      ...armStrips("vein", m.primary),
      {
        name: "torsoVein",
        geo: ["box", 0.012, 0.16, 0.01],
        pos: [0, CHEST_Y - 0.05, CHEST_Z - 0.005],
        rot: [0, 0, 0.08],
        mat: m.secondary,
      },
      // Anel de fluxo com nós ordenados.
      {
        name: "flowRing",
        geo: ["torus", 0.52, 0.009, 56, 8],
        pos: [0, 0.03, 0],
        rot: [0.1, 0, 0],
        mat: m.secondary,
      },
      ...ringNodes("flowNode", 8, 0.52, 0.03, 0.016, m.primary),
      ...chestLights("seq", m.primary),
    ],
    arquiteto: (m) => [
      // Laboratório modular: box-frame ciano-verde.
      ...frame(
        "labFrame",
        boxFrameVerts(0.78, 0.92, 0.6),
        boxFrameEdges(),
        0.007,
        m.secondary,
      ),
      ...mirrored({
        name: "maturePlateA",
        geo: ["sphere", 0.08, 12, 8],
        pos: [SHOULDER_X + 0.035, SHOULDER_Y + 0.045, 0],
        scale: [1, 0.3, 0.75],
        rot: [0, 0, -0.32],
        mat: m.shell,
      }),
      ...mirrored({
        name: "maturePlateB",
        geo: ["sphere", 0.06, 12, 8],
        pos: [SHOULDER_X + 0.05, SHOULDER_Y + 0.085, 0],
        scale: [1, 0.3, 0.75],
        rot: [0, 0, -0.45],
        mat: m.primary,
      }),
      {
        name: "techRing",
        geo: ["torus", 0.6, 0.007, 56, 8],
        pos: [0, 0, 0],
        mat: m.primary,
      },
    ],
    "boss-final": (m) => [
      {
        name: "halo",
        geo: ["torus", 0.21, 0.014, 48, 8],
        pos: [0, HALO_Y, 0],
        mat: m.primary,
      },
      // Nós âmbar alternados no halo (acento de recompensa).
      ...ringNodes("haloNode", 4, 0.21, HALO_Y, 0.018, m.amber),
      // Coroa-ciclo: anel + 5 esferas (ciclo completo, mestre mentor).
      ...crown("cycleCrown", 0.155, m.primary, ["sphere", 0.022, 10, 7], 5, m.secondary),
      ...chestCore("core", m.primary),
      ...mirrored({
        name: "capCurve",
        geo: ["sphere", 0.058, 12, 8],
        pos: [SHOULDER_X + 0.03, SHOULDER_Y + 0.03, 0],
        scale: [1, 0.5, 0.85],
        mat: m.shell,
      }),
    ],
  },

  nebulosa: {
    explorador: (m) => [
      // Anel levemente assimétrico: tilt + offset.
      {
        name: "ring",
        geo: ["torus", 0.52, 0.01, 56, 8],
        pos: [0.04, 0.06, 0],
        rot: [0.21, 0, 0.08],
        mat: m.primary,
      },
      // Nós rosa bem espaçados.
      ...[0.3, 2.2, 4.1].map((a, i) => ({
        name: `sparseNode${i}`,
        geo: ["sphere", 0.018, 10, 7],
        pos: [Math.cos(a) * 0.52 + 0.04, 0.06, Math.sin(a) * 0.52],
        mat: m.secondary,
      })),
      ...visorBar("visorAccent", m.primary, 0.18),
    ],
    estrategista: (m) => [
      // Segundo anel rosa em órbita própria.
      {
        name: "orbitA",
        geo: ["torus", 0.5, 0.009, 56, 8],
        pos: [0, 0.05, 0],
        rot: [0.18, 0, 0],
        mat: m.primary,
      },
      {
        name: "orbitB",
        geo: ["torus", 0.58, 0.009, 56, 8],
        pos: [0, 0.08, 0],
        rot: [-0.35, 0.2, 0],
        mat: m.secondary,
      },
      // Badge constelação tática (abstrato, fora do corpo), espreitando ao
      // lado da cabeça — escala aumentada (correção da revisão UX).
      ...frame(
        "constLine",
        [
          [BADGE_X, BADGE_Y + 0.09, BADGE_Z],
          [BADGE_X + 0.1, BADGE_Y, BADGE_Z - 0.02],
          [BADGE_X - 0.07, BADGE_Y - 0.06, BADGE_Z],
          [BADGE_X + 0.04, BADGE_Y - 0.1, BADGE_Z + 0.01],
        ],
        [
          [0, 1], [1, 2], [2, 3],
        ],
        0.006,
        m.secondary,
      ),
      ...[
        [BADGE_X, BADGE_Y + 0.09, BADGE_Z],
        [BADGE_X + 0.1, BADGE_Y, BADGE_Z - 0.02],
        [BADGE_X - 0.07, BADGE_Y - 0.06, BADGE_Z],
        [BADGE_X + 0.04, BADGE_Y - 0.1, BADGE_Z + 0.01],
      ].map((pos, i) => ({
        name: `constNode${i}`,
        geo: ["sphere", 0.024, 10, 7],
        pos,
        mat: i === 0 ? m.primary : m.secondary,
      })),
      // Placas suaves assimétricas (esquerda maior que direita) — massa de
      // silhueta aumentada (correção da revisão UX).
      {
        name: "plateL",
        geo: ["sphere", 0.105, 12, 8],
        pos: [SHOULDER_X + 0.045, SHOULDER_Y + 0.05, 0],
        scale: [1, 0.32, 0.72],
        rot: [0, 0, 0.3],
        mat: m.shell,
      },
      {
        name: "plateR",
        geo: ["sphere", 0.082, 12, 8],
        pos: [-SHOULDER_X - 0.04, SHOULDER_Y + 0.045, 0],
        scale: [1, 0.3, 0.68],
        rot: [0, 0, -0.26],
        mat: m.shell,
      },
    ],
    criador: (m) => [
      // Shards holográficos fragmentados (tetra achatados).
      ...[
        [HAND_X + 0.05, HAND_Y + 0.08, 0.05],
        [HAND_X + 0.1, HAND_Y, 0.0],
        [HAND_X + 0.06, HAND_Y - 0.07, -0.03],
        [-HAND_X - 0.05, HAND_Y + 0.06, 0.04],
        [-HAND_X - 0.1, HAND_Y - 0.04, -0.01],
      ].map((pos, i) => ({
        name: `shard${i}`,
        geo: ["tetra", 0.034],
        pos,
        scale: [1, 0.45, 1],
        rot: [0.8 * i, 1.1 * i, 0.4],
        mat: i % 2 ? m.secondary : m.primary,
      })),
      // Placas iridescentes (material próprio).
      ...mirrored({
        name: "iridPlate",
        geo: ["sphere", 0.065, 12, 8],
        pos: [SHOULDER_X + 0.03, SHOULDER_Y + 0.04, 0],
        scale: [1, 0.3, 0.7],
        rot: [0, 0, -0.3],
        mat: m.iridescent,
      }),
      ...cuffs("violetCuff", m.primary),
    ],
    operador: (m) => [
      // Caminhos orbitais com nós luminosos conectando.
      {
        name: "pathA",
        geo: ["torus", 0.48, 0.008, 56, 8],
        pos: [0, 0.04, 0],
        rot: [0.26, 0, 0],
        mat: m.primary,
      },
      {
        name: "pathB",
        geo: ["torus", 0.58, 0.008, 56, 8],
        pos: [0, 0.04, 0],
        rot: [-0.44, 0.15, 0],
        mat: m.secondary,
      },
      ...[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2 + 0.5;
        return {
          name: `linkNodeA${i}`,
          geo: ["sphere", 0.016, 10, 7],
          pos: [Math.cos(a) * 0.48, 0.04 + Math.sin(a) * 0.48 * 0.26, Math.sin(a) * 0.48],
          mat: m.secondary,
        };
      }),
      ...[0, 1, 2].map((i) => {
        const a = (i / 3) * Math.PI * 2;
        return {
          name: `linkNodeB${i}`,
          geo: ["sphere", 0.014, 10, 7],
          pos: [Math.cos(a) * 0.58, 0.04 - Math.sin(a) * 0.58 * 0.44, Math.sin(a) * 0.58],
          mat: m.primary,
        };
      }),
      // Pulso ritmado no visor.
      ...visorBar("pulseBar", m.primary, 0.13),
    ],
    arquiteto: (m) => [
      // Malha elegante em camadas: 3 anéis com inclinações distintas.
      {
        name: "meshRingA",
        geo: ["torus", 0.5, 0.007, 56, 8],
        pos: [0, 0, 0],
        rot: [0.3, 0, 0],
        mat: m.primary,
      },
      {
        name: "meshRingB",
        geo: ["torus", 0.56, 0.007, 56, 8],
        pos: [0, 0.02, 0],
        rot: [-0.22, 0.4, 0.1],
        mat: m.secondary,
      },
      {
        name: "meshRingC",
        geo: ["torus", 0.62, 0.007, 64, 8],
        pos: [0, -0.02, 0],
        rot: [0.08, -0.3, -0.14],
        mat: m.primary,
      },
      // Frame icosa parcial (metade superior — sistema em construção).
      ...frame(
        "sysFrame",
        icosaVerts(0.52),
        icosaEdges().filter(([a, b]) => {
          const v = icosaVerts(0.52);
          return v[a][1] + v[b][1] > 0;
        }),
        0.005,
        m.secondary,
      ),
      // Ombreiras assimétricas sutis.
      {
        name: "pauldronL",
        geo: ["sphere", 0.075, 12, 8],
        pos: [SHOULDER_X + 0.035, SHOULDER_Y + 0.045, 0],
        scale: [1, 0.32, 0.72],
        rot: [0, 0, 0.3],
        mat: m.shell,
      },
      {
        name: "pauldronR",
        geo: ["sphere", 0.058, 12, 8],
        pos: [-SHOULDER_X - 0.03, SHOULDER_Y + 0.04, 0],
        scale: [1, 0.3, 0.68],
        rot: [0, 0, -0.24],
        mat: m.shell,
      },
    ],
    "boss-final": (m) => [
      {
        name: "halo",
        geo: ["torus", 0.215, 0.013, 48, 8],
        pos: [0, HALO_Y, 0],
        rot: [0.06, 0, 0],
        mat: m.primary,
      },
      {
        name: "haloAccentAmber",
        geo: ["sphere", 0.02, 10, 7],
        pos: [0.215, HALO_Y, 0],
        mat: m.amber,
      },
      ...[1, 2, 3].map((i) => {
        const a = (i / 4) * Math.PI * 2;
        return {
          name: `haloNode${i}`,
          geo: ["sphere", 0.014, 10, 7],
          pos: [Math.cos(a) * 0.215, HALO_Y, Math.sin(a) * 0.215],
          mat: m.secondary,
        };
      }),
      // Coroa orbital minimalista.
      ...crown("crown", 0.15, m.secondary, ["box", 0.018, 0.05, 0.018], 4, m.primary),
      // Clusters de nós densos mas controlados.
      ...[
        [0.3, 0.12, 0.18],
        [0.34, 0.04, 0.1],
        [-0.3, 0.1, 0.16],
        [-0.33, 0.0, 0.08],
        [0.0, -0.3, 0.26],
      ].map((pos, i) => ({
        name: `clusterNode${i}`,
        geo: ["sphere", 0.014, 10, 7],
        pos,
        mat: i % 2 ? m.secondary : m.primary,
      })),
      ...chestCore("core", m.primary),
    ],
  },
};

// ---------------------------------------------------------------------------
// Montagem glTF.

function buildGeometry(geo) {
  const [type, ...args] = geo;
  switch (type) {
    case "torus":
      return torusGeo(...args);
    case "sphere":
      return sphereGeo(...args);
    case "cyl":
      return cylGeo(...args);
    case "box":
      return boxGeo(...args);
    case "tetra":
      return tetraGeo(...args);
    default:
      throw new Error(`geo desconhecida: ${type}`);
  }
}

/**
 * Os builders dos kits referenciam materiais por CHAVE ("primary", "shell"…);
 * cada writeKit cria os Materials no Document do próprio kit a partir destas
 * specs, resolvidas pela paleta do avatar.
 */
const MATERIAL_KEYS = {
  primary: "primary",
  secondary: "secondary",
  amber: "amber",
  shell: "shell",
  iridescent: "iridescent",
};

function materialSpecs(paletteKey) {
  const p = PALETTES[paletteKey];
  const dark = hexToLinear(p.shell).map((c) => c * 0.35);
  return {
    // Emissivos: baseColor escuro + emissiveFactor na cor (leitura em 150 px).
    primary: {
      base: dark,
      emissive: hexToLinear(p.primary),
      metallic: 0.1,
      roughness: 0.4,
    },
    secondary: {
      base: dark,
      emissive: hexToLinear(p.secondary),
      metallic: 0.1,
      roughness: 0.4,
    },
    amber: {
      base: dark,
      emissive: hexToLinear(AMBER),
      metallic: 0.1,
      roughness: 0.4,
    },
    // Casco acetinado escuro não-emissivo.
    shell: { base: hexToLinear(p.shell), metallic: 0.65, roughness: 0.35 },
    // Nebulosa Criador: iridescência aproximada (metálico polido).
    iridescent: {
      base: hexToLinear(p.primary),
      emissive: hexToLinear(p.secondary).map((c) => c * 0.25),
      metallic: 0.95,
      roughness: 0.12,
    },
  };
}

function cap(s) {
  return s
    .split("-")
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join("");
}

async function writeKit(io, avatar, phase, parts) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene(`Kit_${cap(avatar)}_${cap(phase)}`);
  const root = doc.createNode(`Kit_${cap(avatar)}_${cap(phase)}`);
  scene.addChild(root);

  // Materiais deste kit (pertencem a este Document), resolvidos por chave.
  const specs = materialSpecs(avatar);
  const materials = new Map();
  const materialFor = (key) => {
    if (!materials.has(key)) {
      const s = specs[key];
      if (!s) throw new Error(`material desconhecido: ${key}`);
      const mat = doc
        .createMaterial(`kit_${key}`)
        .setBaseColorFactor([...s.base, 1])
        .setMetallicFactor(s.metallic)
        .setRoughnessFactor(s.roughness);
      if (s.emissive) mat.setEmissiveFactor(s.emissive);
      materials.set(key, mat);
    }
    return materials.get(key);
  };

  const meshCache = new Map();
  let tris = 0;

  for (const part of parts) {
    const key = JSON.stringify([part.geo, part.mat]);
    let mesh = meshCache.get(key);
    if (!mesh) {
      const g = buildGeometry(part.geo);
      const position = doc
        .createAccessor()
        .setType("VEC3")
        .setArray(g.positions)
        .setBuffer(buffer);
      const normal = doc
        .createAccessor()
        .setType("VEC3")
        .setArray(g.normals)
        .setBuffer(buffer);
      const indices = doc
        .createAccessor()
        .setType("SCALAR")
        .setArray(g.indices)
        .setBuffer(buffer);
      const prim = doc
        .createPrimitive()
        .setAttribute("POSITION", position)
        .setAttribute("NORMAL", normal)
        .setIndices(indices)
        .setMaterial(materialFor(part.mat));
      mesh = doc.createMesh(key).addPrimitive(prim);
      meshCache.set(key, mesh);
    }
    tris += mesh.listPrimitives()[0].getIndices().getCount() / 3;

    const node = doc
      .createNode(`kit_${avatar}_${phase}_${part.name}`)
      .setMesh(mesh)
      .setTranslation(part.pos ?? [0, 0, 0]);
    if (part.quat) node.setRotation(part.quat);
    else if (part.rot) node.setRotation(eulerToQuat(part.rot));
    if (part.scale) {
      node.setScale(
        Array.isArray(part.scale)
          ? part.scale
          : [part.scale, part.scale, part.scale],
      );
    }
    root.addChild(node);
  }

  const file = `${OUT_DIR}/avatar-${avatar}-kit-${phase}.glb`;
  await io.write(file, doc);
  const kb = statSync(file).size / 1024;
  console.log(
    `${file}  partes=${parts.length}  tris=${Math.round(tris)}  ${kb.toFixed(1)} KB`,
  );
  return { file, parts: parts.length, tris: Math.round(tris), kb };
}

await mkdir(OUT_DIR, { recursive: true });
const io = new NodeIO();
const summary = [];
for (const [avatar, phases] of Object.entries(KITS)) {
  for (const [phase, build] of Object.entries(phases)) {
    summary.push(await writeKit(io, avatar, phase, build(MATERIAL_KEYS)));
  }
}

console.log(`\n${summary.length} kits gerados.`);
const total = summary.reduce((s, k) => s + k.kb, 0);
console.log(`peso total: ${(total / 1024).toFixed(2)} MB`);
