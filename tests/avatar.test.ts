import { describe, expect, it } from "vitest";

import { isAvatarVariant, shouldCelebrateLevelUp } from "@/lib/avatar";

describe("avatar helpers", () => {
  it("validates avatar variants", () => {
    expect(isAvatarVariant("aurora")).toBe(true);
    expect(isAvatarVariant("nebula")).toBe(true);
    expect(isAvatarVariant("rainbow")).toBe(false);
    expect(isAvatarVariant("")).toBe(false);
  });

  it("does not celebrate without a previous level reference", () => {
    expect(shouldCelebrateLevelUp(3, null)).toBe(false);
  });

  it("celebrates only when the current level is higher than the last seen", () => {
    expect(shouldCelebrateLevelUp(3, 2)).toBe(true);
    expect(shouldCelebrateLevelUp(2, 2)).toBe(false);
    expect(shouldCelebrateLevelUp(1, 2)).toBe(false);
  });

  it("ignores non-finite last seen values", () => {
    expect(shouldCelebrateLevelUp(3, Number.NaN)).toBe(false);
  });
});
