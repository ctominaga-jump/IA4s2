import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { getPublishedJourney } from "@/server/content";
import type { MissionStatus } from "@/lib/domain";
import {
  byMostRecentSubmission,
  computeMissionStatus,
  resolveLevelProgress,
} from "@/lib/progression";
import type {
  FeedbackRow,
  LearningGoalRow,
  LevelRow,
  MissionRow,
  SubmissionRow,
} from "@/lib/database.types";

export interface MissionWithState {
  mission: MissionRow;
  status: MissionStatus;
  latestSubmission: SubmissionRow | null;
  latestFeedback: FeedbackRow | null;
}

export interface StudentMissionData {
  courseTitle: string | null;
  courseDescription: string | null;
  items: MissionWithState[];
  counts: Record<MissionStatus, number>;
  total: number;
}

/**
 * Carrega missoes publicadas com o estado de cada uma para o aluno,
 * alem da contagem por status.
 */
export async function getStudentMissionData(
  studentProfileId: string,
): Promise<StudentMissionData> {
  const service = createSupabaseServiceClient();
  const journey = await getPublishedJourney();

  const missionIds = journey.missions.map((m) => m.id);

  const { data: submissions } = await service
    .from("submissions")
    .select("*")
    .eq("student_profile_id", studentProfileId)
    .in("mission_id", missionIds.length > 0 ? missionIds : ["__none__"]);

  const submissionsByMission = new Map<string, SubmissionRow[]>();
  for (const sub of submissions ?? []) {
    const list = submissionsByMission.get(sub.mission_id) ?? [];
    list.push(sub);
    submissionsByMission.set(sub.mission_id, list);
  }
  for (const list of submissionsByMission.values()) {
    list.sort(byMostRecentSubmission);
  }

  // Feedback das entregas mais recentes (uma consulta).
  const latestSubmissionIds = Array.from(submissionsByMission.values())
    .map((list) => list[0]?.id)
    .filter(Boolean) as string[];

  const feedbackBySubmission = new Map<string, FeedbackRow>();
  if (latestSubmissionIds.length > 0) {
    const { data: feedbacks } = await service
      .from("feedback")
      .select("*")
      .in("submission_id", latestSubmissionIds);
    for (const fb of feedbacks ?? []) {
      feedbackBySubmission.set(fb.submission_id, fb);
    }
  }

  const counts: Record<MissionStatus, number> = {
    not_started: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  };

  const items: MissionWithState[] = journey.missions.map((mission) => {
    const subs = submissionsByMission.get(mission.id) ?? [];
    const status = computeMissionStatus(subs);
    counts[status] += 1;
    const latestSubmission = subs[0] ?? null;
    const latestFeedback = latestSubmission
      ? feedbackBySubmission.get(latestSubmission.id) ?? null
      : null;
    return { mission, status, latestSubmission, latestFeedback };
  });

  return {
    courseTitle: journey.course?.title ?? null,
    courseDescription: journey.course?.description ?? null,
    items,
    counts,
    total: journey.missions.length,
  };
}

/** Estado de uma missao especifica para o aluno (tela de missao). */
export async function getMissionStateForStudent(
  studentProfileId: string,
  missionId: string,
): Promise<MissionWithState | null> {
  const data = await getStudentMissionData(studentProfileId);
  return data.items.find((item) => item.mission.id === missionId) ?? null;
}

export async function getActiveLearningGoal(
  goalId: string | null,
): Promise<LearningGoalRow | null> {
  if (!goalId) return null;
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("learning_goals")
    .select("*")
    .eq("id", goalId)
    .maybeSingle();
  return data;
}

export async function getLevelById(
  levelId: string | null,
): Promise<LevelRow | null> {
  if (!levelId) return null;
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("levels")
    .select("*")
    .eq("id", levelId)
    .maybeSingle();
  return data;
}

export async function getAllLevels(): Promise<LevelRow[]> {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("levels")
    .select("*")
    .order("number", { ascending: true });
  return data ?? [];
}
export { resolveLevelProgress };
