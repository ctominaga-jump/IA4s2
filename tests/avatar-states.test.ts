import { describe, expect, it } from "vitest";

import {
  AVATAR_MODELS,
  AVATAR_STATES,
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
    expect(AVATAR_STATES[6].crown).toBe(true);
  });

  it("clamps the phase index safely", () => {
    expect(avatarStateForPhase(-5).index).toBe(0);
    expect(avatarStateForPhase(99).index).toBe(6);
  });
});
