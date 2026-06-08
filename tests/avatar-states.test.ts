import { describe, expect, it } from "vitest";

import {
  AVATAR_KITS,
  AVATAR_MODELS,
  AVATAR_STATES,
  avatarKitForPhase,
  avatarModelForVariant,
  avatarStateForPhase,
  resolvedAvatarStateForPhase,
} from "@/components/three/avatar/avatar-states";
import type { AvatarVariant } from "@/lib/database.types";

const VARIANTS: AvatarVariant[] = ["aurora", "ember", "verdant", "nebula"];

describe("avatar identity model registry", () => {
  it("maps each variant to its own GLB", () => {
    expect(AVATAR_MODELS.aurora?.url).toBe("/assets/3d/avatar-aurora.glb");
    expect(AVATAR_MODELS.ember?.url).toBe("/assets/3d/avatar-brasa.glb");
    expect(AVATAR_MODELS.verdant?.url).toBe("/assets/3d/avatar-verdejante.glb");
    expect(AVATAR_MODELS.nebula?.url).toBe("/assets/3d/avatar-nebulosa.glb");
  });

  it("never points a non-aurora variant to the aurora GLB", () => {
    for (const variant of VARIANTS.filter((v) => v !== "aurora")) {
      expect(avatarModelForVariant(variant)?.url).not.toBe(
        "/assets/3d/avatar-aurora.glb",
      );
    }
  });

  it("resolves the identity model for every variant and phase", () => {
    for (const variant of VARIANTS) {
      for (let phase = 0; phase < AVATAR_STATES.length; phase++) {
        const resolved = resolvedAvatarStateForPhase(phase, variant);
        expect(resolved.model?.url).toBe(AVATAR_MODELS[variant]?.url);
      }
    }
  });

  it("falls back to the procedural core for unknown variants", () => {
    expect(avatarModelForVariant("unknown" as AvatarVariant)).toBeNull();
  });
});

describe("evolution kit registry", () => {
  const KIT_SLUGS: Record<AvatarVariant, string> = {
    aurora: "aurora",
    ember: "brasa",
    verdant: "verdejante",
    nebula: "nebulosa",
  };
  const PHASE_SLUGS = [
    null,
    "explorador",
    "estrategista",
    "criador",
    "operador",
    "operador", // Operador Tecnico: fallback reusa o kit operador (sem GLB proprio).
    "arquiteto",
    "boss-final",
  ];

  it("has one entry per phase for every variant, Despertar without kit", () => {
    for (const variant of VARIANTS) {
      expect(AVATAR_KITS[variant]).toHaveLength(AVATAR_STATES.length);
      expect(AVATAR_KITS[variant][0]).toBeNull();
    }
  });

  it("maps variant + phase to the stable kit file naming convention", () => {
    for (const variant of VARIANTS) {
      for (let phase = 1; phase < AVATAR_STATES.length; phase++) {
        expect(avatarKitForPhase(variant, phase)).toBe(
          `/assets/3d/avatar-${KIT_SLUGS[variant]}-kit-${PHASE_SLUGS[phase]}.glb`,
        );
      }
    }
  });

  it("never shares a kit between variants (no recolor by asset reuse)", () => {
    for (let phase = 1; phase < AVATAR_STATES.length; phase++) {
      const urls = VARIANTS.map((v) => avatarKitForPhase(v, phase));
      expect(new Set(urls).size).toBe(VARIANTS.length);
    }
  });

  it("resolves kitUrl per phase and clamps out-of-range indices", () => {
    for (const variant of VARIANTS) {
      expect(resolvedAvatarStateForPhase(0, variant).kitUrl).toBeNull();
      expect(resolvedAvatarStateForPhase(6, variant).kitUrl).toContain(
        "kit-arquiteto",
      );
      expect(resolvedAvatarStateForPhase(7, variant).kitUrl).toContain(
        "kit-boss-final",
      );
      expect(avatarKitForPhase(variant, -3)).toBeNull();
      expect(avatarKitForPhase(variant, 99)).toContain("kit-boss-final");
    }
  });

  it("returns null for unknown variants (rollback-safe)", () => {
    expect(avatarKitForPhase("unknown" as AvatarVariant, 3)).toBeNull();
  });

  it("points every registry entry to an existing GLB in public/", async () => {
    const { existsSync } = await import("node:fs");
    const { join } = await import("node:path");
    for (const variant of VARIANTS) {
      for (const url of AVATAR_KITS[variant]) {
        if (!url) continue;
        expect(existsSync(join(process.cwd(), "public", url)), url).toBe(true);
      }
    }
  });
});

describe("procedural evolution states", () => {
  it("keeps evolution layers per phase regardless of variant", () => {
    for (const variant of VARIANTS) {
      for (const state of AVATAR_STATES) {
        const resolved = resolvedAvatarStateForPhase(state.index, variant);
        expect(resolved.rings).toBe(state.rings);
        expect(resolved.particles).toBe(state.particles);
        expect(resolved.crown).toBe(state.crown);
        expect(resolved.distort).toBe(state.distort);
      }
    }
  });

  it("keeps the crown exclusive to the Boss Final state", () => {
    expect(AVATAR_STATES.filter((s) => s.crown)).toHaveLength(1);
    expect(AVATAR_STATES[7].crown).toBe(true);
  });

  it("clamps the phase index safely", () => {
    expect(avatarStateForPhase(-5).index).toBe(0);
    expect(avatarStateForPhase(99).index).toBe(7);
  });
});
