import { describe, expect, it } from "vitest";

import {
  BOSS_STAGES,
  countFilledStages,
  isBossProjectComplete,
} from "@/components/game/boss-stages";
import type { BossProjectRow } from "@/lib/database.types";

function makeProject(overrides: Partial<BossProjectRow>): BossProjectRow {
  return {
    id: "p1",
    student_profile_id: "s1",
    title: null,
    problem: null,
    solution: null,
    architecture: null,
    prototype: null,
    validation: null,
    status: "draft",
    reviewer_teacher_profile_id: null,
    feedback: null,
    submitted_at: null,
    reviewed_at: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("boss final helpers", () => {
  it("has exactly 5 narrative stages", () => {
    expect(BOSS_STAGES).toHaveLength(5);
    expect(BOSS_STAGES.map((s) => s.key)).toEqual([
      "problem",
      "solution",
      "architecture",
      "prototype",
      "validation",
    ]);
  });

  it("counts filled stages, ignoring blank/whitespace", () => {
    expect(countFilledStages(null)).toBe(0);
    expect(countFilledStages(makeProject({}))).toBe(0);
    expect(
      countFilledStages(makeProject({ problem: "x", solution: "   " })),
    ).toBe(1);
    expect(
      countFilledStages(
        makeProject({
          problem: "a",
          solution: "b",
          architecture: "c",
          prototype: "d",
          validation: "e",
        }),
      ),
    ).toBe(5);
  });

  it("is complete only with a title and all 5 stages filled", () => {
    const full = {
      title: "Produto",
      problem: "a",
      solution: "b",
      architecture: "c",
      prototype: "d",
      validation: "e",
    };
    expect(isBossProjectComplete(makeProject(full))).toBe(true);
    // sem titulo
    expect(isBossProjectComplete(makeProject({ ...full, title: "  " }))).toBe(
      false,
    );
    // falta uma etapa
    expect(
      isBossProjectComplete(makeProject({ ...full, validation: "" })),
    ).toBe(false);
    expect(isBossProjectComplete(null)).toBe(false);
  });
});
