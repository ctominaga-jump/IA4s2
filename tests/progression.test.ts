import { describe, expect, it } from "vitest";

import {
  byMostRecentSubmission,
  computeMissionStatus,
  resolveLevelProgress,
} from "@/lib/progression";
import type { LevelRow } from "@/lib/database.types";

const levels = [
  level({ id: "level-1", number: 1, title: "Explorador", min_xp: 0, max_xp: 99 }),
  level({
    id: "level-2",
    number: 2,
    title: "Aprendiz de Prompts",
    min_xp: 100,
    max_xp: 249,
  }),
  level({
    id: "level-3",
    number: 3,
    title: "Praticante de IA",
    min_xp: 250,
    max_xp: null,
  }),
];

describe("progression rules", () => {
  it("resolves the current level, next level and XP remaining", () => {
    const progress = resolveLevelProgress(120, levels);

    expect(progress.current?.number).toBe(2);
    expect(progress.next?.number).toBe(3);
    expect(progress.xpIntoLevel).toBe(20);
    expect(progress.xpForNext).toBe(130);
    expect(progress.progressPercent).toBe(13);
  });

  it("caps progress at the last level", () => {
    const progress = resolveLevelProgress(900, levels);

    expect(progress.current?.number).toBe(3);
    expect(progress.next).toBeNull();
    expect(progress.progressPercent).toBe(100);
    expect(progress.xpForNext).toBe(0);
  });

  it("marks a mission as not started when there are no submissions", () => {
    expect(computeMissionStatus([])).toBe("not_started");
  });

  it("keeps an approved mission approved even when older attempts exist", () => {
    expect(
      computeMissionStatus([
        submission({ status: "rejected", attempt_number: 1 }),
        submission({ status: "approved", attempt_number: 2 }),
      ]),
    ).toBe("approved");
  });

  it("uses the most recent attempt to decide pending vs rejected", () => {
    expect(
      computeMissionStatus([
        submission({
          status: "pending",
          attempt_number: 2,
          submitted_at: "2026-05-31T11:00:00.000Z",
        }),
        submission({
          status: "rejected",
          attempt_number: 1,
          submitted_at: "2026-05-31T12:00:00.000Z",
        }),
      ]),
    ).toBe("pending");
  });

  it("sorts submissions by attempt number and timestamp descending", () => {
    const sorted = [
      submission({ status: "rejected", attempt_number: 1 }),
      submission({ status: "pending", attempt_number: 2 }),
      submission({
        status: "rejected",
        attempt_number: 2,
        submitted_at: "2026-05-31T13:00:00.000Z",
      }),
    ].sort(byMostRecentSubmission);

    expect(sorted.map((item) => item.status)).toEqual([
      "rejected",
      "pending",
      "rejected",
    ]);
  });
});

function level(overrides: Partial<LevelRow>): LevelRow {
  return {
    id: "level",
    number: 1,
    title: "Nivel",
    min_xp: 0,
    max_xp: null,
    created_at: "2026-05-31T00:00:00.000Z",
    updated_at: "2026-05-31T00:00:00.000Z",
    ...overrides,
  };
}

function submission(overrides: {
  status: "pending" | "approved" | "rejected";
  attempt_number: number;
  submitted_at?: string;
}) {
  return {
    status: overrides.status,
    attempt_number: overrides.attempt_number,
    submitted_at: overrides.submitted_at ?? "2026-05-31T10:00:00.000Z",
  };
}
