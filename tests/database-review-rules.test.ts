import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import path from "node:path";

const migrationInit = readMigration("0001_init.sql");
const migrationFunctions = readMigration("0002_functions.sql");
const migrationHardening = readMigration("0004_harden_functions.sql");

describe("database review and XP safety rules", () => {
  it("keeps one pending submission and one approved submission per student mission", () => {
    expect(migrationInit).toContain("submissions_one_pending_per_mission");
    expect(migrationInit).toMatch(
      /on public\.submissions \(student_profile_id, mission_id\)\s+where status = 'pending'/,
    );
    expect(migrationInit).toContain("submissions_one_approved_per_mission");
    expect(migrationInit).toMatch(
      /on public\.submissions \(student_profile_id, mission_id\)\s+where status = 'approved'/,
    );
  });

  it("keeps mission approval XP idempotent per student mission", () => {
    expect(migrationInit).toContain("xp_one_mission_approved_per_student");
    expect(migrationInit).toMatch(
      /on public\.xp_transactions \(student_profile_id, mission_id\)\s+where reason = 'mission_approved'/,
    );
    expect(migrationFunctions).toContain("on conflict (student_profile_id, mission_id)");
    expect(migrationFunctions).toContain("where reason = 'mission_approved'");
    expect(migrationFunctions).toContain("do nothing");
  });

  it("requires feedback, only reviews pending submissions and hardens RPC access", () => {
    expect(migrationFunctions).toContain("raise exception 'feedback_required'");
    expect(migrationFunctions).toContain("raise exception 'submission_not_pending'");
    expect(migrationFunctions).toContain("where id = p_submission_id");
    expect(migrationFunctions).toContain("for update");
    expect(migrationHardening).toContain(
      "grant execute on function public.review_submission",
    );
    expect(migrationHardening).toContain("to service_role");
  });
});

function readMigration(fileName: string): string {
  return readFileSync(
    path.join(process.cwd(), "database", "migrations", fileName),
    "utf8",
  );
}
