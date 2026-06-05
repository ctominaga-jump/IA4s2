import { PHASES } from "@/components/game/journey-phases";
import type { AvatarVariant } from "@/lib/database.types";

export interface AvatarIdentityConfig {
  variant: AvatarVariant;
  label: string;
  description: string;
  accent: string;
  secondary: string;
  glow: string;
}

export const AVATAR_IDENTITIES: Record<AvatarVariant, AvatarIdentityConfig> = {
  aurora: {
    variant: "aurora",
    label: "Agente Aurora",
    description: "Ciano/violeta, tecnologico e padrao.",
    accent: "#16D9E3",
    secondary: "#6D5DF7",
    glow: "#16D9E3",
  },
  ember: {
    variant: "ember",
    label: "Agente Brasa",
    description: "Ambar/vermelho, energia e acao.",
    accent: "#FFC857",
    secondary: "#FF5C7A",
    glow: "#FF5C7A",
  },
  verdant: {
    variant: "verdant",
    label: "Agente Verdejante",
    description: "Verde/ciano, crescimento e aprendizagem.",
    accent: "#3EE58F",
    secondary: "#16D9E3",
    glow: "#3EE58F",
  },
  nebula: {
    variant: "nebula",
    label: "Agente Nebulosa",
    description: "Violeta/rosa, criatividade e estrategia.",
    accent: "#6D5DF7",
    secondary: "#FF5C7A",
    glow: "#6D5DF7",
  },
};

/**
 * Fonte do GLB de IDENTIDADE + ajustes de encaixe no envelope 3D.
 *
 * Todos os GLBs seguem a convenção da Aurora: Y-up, altura 1.0, centrados na
 * origem. Brasa/Verdejante/Nebulosa foram normalizados via
 * `scripts/glb-isolate-center.mjs` (isola o robô central do turnaround Tripo
 * que o `gltf-transform optimize` manteve fundido). `rotation` permite
 * compensar a frente do modelo sem reprocessar o asset.
 */
export interface AvatarModelSource {
  /** GLB local em `public/assets/3d` (ou URL de GLB próprio/licenciado). */
  url: string;
  /** Escala para ~1.9 de altura visual (anéis orbitais começam em r 1.25). */
  scale: number;
  /** Euler XYZ (rad) para alinhar o GLB a Y-up / frente +Z. */
  rotation: [number, number, number];
}

/**
 * Registry IDENTIDADE -> GLB. A identidade do avatar é o modelo base; a
 * evolução por fase continua 100% procedural (AVATAR_STATES). Rollback por
 * variante: trocar a entrada por `null` volta o núcleo procedural sem remover
 * código (equivalente ao antigo `modelUrl=null`).
 *
 * Pesos atuais (ver relatórios em docs/product-evolution/visual-reviews/):
 * - aurora ~752 KB / 15k tris — pronto para produção;
 * - brasa ~37,5k tris (~1,5 MB), verdejante ~47,2k tris (~1,9 MB), nebulosa
 *   ~39,5k tris (~1,6 MB) — OTIMIZAÇÃO INTERMEDIÁRIA: ok para preview/validação; produção
 *   mobile exige nova passada no Blender
 *   (scripts/blender_optimize_avatar.py, alvo 15k-30k tris).
 */
export const AVATAR_MODELS: Record<AvatarVariant, AvatarModelSource | null> = {
  aurora: { url: "/assets/3d/avatar-aurora.glb", scale: 1.9, rotation: [0, 0, 0] },
  ember: { url: "/assets/3d/avatar-brasa.glb", scale: 1.9, rotation: [0, 0, 0] },
  verdant: { url: "/assets/3d/avatar-verdejante.glb", scale: 1.9, rotation: [0, 0, 0] },
  nebula: { url: "/assets/3d/avatar-nebulosa.glb", scale: 1.9, rotation: [0, 0, 0] },
};

/**
 * Registry IDENTIDADE + FASE -> Evolution Kit (GLB modular sobre o base).
 *
 * Os kits são acessórios/placas/halos/wireframes gerados por
 * `scripts/generate-evolution-kits.mjs` (ver
 * docs/product-evolution/15-evolution-kits-design-spec.md). Índice do array =
 * phaseIndex (0..6); Despertar (0) é sempre `null` — o estado base não tem kit.
 *
 * Rollback por variante/fase: trocar a entrada por `null` volta àquela fase
 * sem kit (camadas procedurais continuam), sem remover código nem asset.
 */
const KIT_PHASE_SLUGS = [
  null, // Despertar: GLB base + camadas procedurais, sem kit.
  "explorador",
  "estrategista",
  "criador",
  "operador",
  "arquiteto",
  "boss-final",
] as const;

/** Slug de arquivo por variante (GLBs usam os nomes em português). */
const KIT_AVATAR_SLUGS: Record<AvatarVariant, string> = {
  aurora: "aurora",
  ember: "brasa",
  verdant: "verdejante",
  nebula: "nebulosa",
};

function kitUrlsFor(variant: AvatarVariant): ReadonlyArray<string | null> {
  return KIT_PHASE_SLUGS.map((phase) =>
    phase
      ? `/assets/3d/avatar-${KIT_AVATAR_SLUGS[variant]}-kit-${phase}.glb`
      : null,
  );
}

export const AVATAR_KITS: Record<AvatarVariant, ReadonlyArray<string | null>> = {
  aurora: kitUrlsFor("aurora"),
  ember: kitUrlsFor("ember"),
  verdant: kitUrlsFor("verdant"),
  nebula: kitUrlsFor("nebula"),
};

/** Resolve o kit de evolução (`null` => fase sem kit, ex.: Despertar). */
export function avatarKitForPhase(
  variant: AvatarVariant,
  phaseIndex: number,
): string | null {
  const kits = AVATAR_KITS[variant];
  if (!kits) return null;
  const i = Math.min(Math.max(phaseIndex, 0), kits.length - 1);
  return kits[i];
}

/**
 * Registry dos 7 estados de evolução do avatar.
 *
 * A evolução por fase combina camadas PROCEDURAIS (aura, anéis orbitais,
 * partículas, cor, distorção, coroa) com o Evolution Kit da fase
 * (AVATAR_KITS). O modelo base NÃO varia por fase — ele varia por IDENTIDADE
 * (AVATAR_MODELS). Ver docs/product-evolution/13-real-3d-assets-plan.md e
 * docs/product-evolution/15-evolution-kits-design-spec.md.
 */
export interface AvatarStateConfig {
  index: number;
  /** Nome da fase (Despertar … Boss Final). */
  name: string;
  /** Cor primária (emissiva do núcleo). */
  accent: string;
  /** Cor secundária (anéis/partículas). */
  secondary: string;
  /** Número de anéis orbitais. */
  rings: number;
  /** Quantidade de partículas (sparkles). */
  particles: number;
  /** Distorção do núcleo (energia). */
  distort: number;
  /** Prop especial do Boss Final. */
  crown: boolean;
}

/** Config de render: camadas procedurais + modelo base + kit (ou null). */
export type AvatarRenderConfig = AvatarStateConfig & {
  model: AvatarModelSource | null;
  /** Evolution Kit da fase (GLB modular) ou `null` (fase sem kit/rollback). */
  kitUrl: string | null;
};

export type ResolvedAvatarStateConfig = AvatarRenderConfig & AvatarIdentityConfig;

const CYAN = "#16D9E3";
const VIOLET = "#6D5DF7";
const GREEN = "#3EE58F";
const AMBER = "#FFC857";
const ROSE = "#FF5C7A";

export const AVATAR_STATES: AvatarStateConfig[] = [
  { index: 0, name: PHASES[0].name, accent: CYAN, secondary: VIOLET, rings: 0, particles: 14, distort: 0.2, crown: false },
  { index: 1, name: PHASES[1].name, accent: CYAN, secondary: GREEN, rings: 1, particles: 18, distort: 0.24, crown: false },
  { index: 2, name: PHASES[2].name, accent: VIOLET, secondary: CYAN, rings: 1, particles: 22, distort: 0.26, crown: false },
  { index: 3, name: PHASES[3].name, accent: VIOLET, secondary: CYAN, rings: 2, particles: 26, distort: 0.28, crown: false },
  { index: 4, name: PHASES[4].name, accent: CYAN, secondary: VIOLET, rings: 2, particles: 30, distort: 0.3, crown: false },
  { index: 5, name: PHASES[5].name, accent: VIOLET, secondary: CYAN, rings: 3, particles: 36, distort: 0.32, crown: false },
  { index: 6, name: PHASES[6].name, accent: AMBER, secondary: ROSE, rings: 3, particles: 44, distort: 0.36, crown: true },
];

/** Resolve um estado por índice de fase, com clamp seguro (0..6). */
export function avatarStateForPhase(phaseIndex: number): AvatarStateConfig {
  const i = Math.min(Math.max(phaseIndex, 0), AVATAR_STATES.length - 1);
  return AVATAR_STATES[i];
}

export function avatarIdentityForVariant(variant: AvatarVariant): AvatarIdentityConfig {
  return AVATAR_IDENTITIES[variant] ?? AVATAR_IDENTITIES.aurora;
}

/** Resolve o GLB de identidade da variante (`null` => núcleo procedural). */
export function avatarModelForVariant(variant: AvatarVariant): AvatarModelSource | null {
  return AVATAR_MODELS[variant] ?? null;
}

export function resolvedAvatarStateForPhase(
  phaseIndex: number,
  variant: AvatarVariant,
): ResolvedAvatarStateConfig {
  return {
    ...avatarStateForPhase(phaseIndex),
    ...avatarIdentityForVariant(variant),
    model: avatarModelForVariant(variant),
    kitUrl: avatarKitForPhase(variant, phaseIndex),
  };
}
