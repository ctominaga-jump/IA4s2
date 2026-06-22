import type { AvatarVariant } from "@/lib/database.types";

export const AVATAR_VARIANTS: AvatarVariant[] = [
  "aurora",
  "ember",
  "verdant",
  "nebula",
];

/** Type guard de variante de avatar (para validar input de formulario). */
export function isAvatarVariant(value: string): value is AvatarVariant {
  return (AVATAR_VARIANTS as string[]).includes(value);
}

/**
 * Decide se deve celebrar um level up. So celebra quando ja havia um nível
 * conhecido anteriormente (`lastSeen`) e o nível atual e maior — evita
 * celebrar no primeiro carregamento, quando nao ha referencia.
 */
export function shouldCelebrateLevelUp(
  current: number,
  lastSeen: number | null,
): boolean {
  if (lastSeen === null || !Number.isFinite(lastSeen)) return false;
  return current > lastSeen;
}
