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
 * Registry dos 7 estados de evolução do avatar.
 *
 * A evolução por fase é PROCEDURAL: aura, anéis orbitais, partículas, cor,
 * distorção do núcleo e props (coroa no Boss). O modelo base NÃO varia por
 * fase — ele varia por IDENTIDADE (AVATAR_MODELS). Ver
 * docs/product-evolution/13-real-3d-assets-plan.md.
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

/** Config de render do avatar: camadas procedurais + modelo base (ou null). */
export type AvatarRenderConfig = AvatarStateConfig & {
  model: AvatarModelSource | null;
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
  };
}
