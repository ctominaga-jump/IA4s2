import type { LevelRow, SubmissionRow } from "@/lib/database.types";
import type { MissionStatus } from "@/lib/domain";

type SubmissionState = Pick<
  SubmissionRow,
  "status" | "attempt_number" | "submitted_at"
>;

export function computeMissionStatus(submissions: SubmissionState[]): MissionStatus {
  if (submissions.length === 0) return "not_started";
  if (submissions.some((submission) => submission.status === "approved")) {
    return "approved";
  }

  const latest = [...submissions].sort(byMostRecentSubmission)[0];
  return latest.status === "pending" ? "pending" : "rejected";
}

export function byMostRecentSubmission(
  a: SubmissionState,
  b: SubmissionState,
): number {
  if (b.attempt_number !== a.attempt_number) {
    return b.attempt_number - a.attempt_number;
  }
  return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
}

export function resolveLevelProgress(totalXp: number, levels: LevelRow[]) {
  const sorted = [...levels].sort((a, b) => a.number - b.number);
  const current =
    sorted
      .filter((level) => totalXp >= level.min_xp)
      .sort((a, b) => b.number - a.number)[0] ?? sorted[0] ?? null;

  const next = current
    ? sorted.find((level) => level.number === current.number + 1) ?? null
    : null;

  let progressPercent = 100;
  let xpIntoLevel = 0;
  let xpForNext = 0;

  if (current && next) {
    const span = next.min_xp - current.min_xp;
    xpIntoLevel = totalXp - current.min_xp;
    xpForNext = next.min_xp - totalXp;
    progressPercent = span > 0 ? Math.round((xpIntoLevel / span) * 100) : 0;
  }

  return { current, next, progressPercent, xpIntoLevel, xpForNext };
}
