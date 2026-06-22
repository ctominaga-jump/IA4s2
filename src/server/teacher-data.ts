import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type {
  FeedbackRow,
  LearningGoalRow,
  MissionRow,
  SubmissionRow,
  SubmissionStatus,
} from "@/lib/database.types";

export interface QueueItem {
  submission: SubmissionRow;
  missionTitle: string;
  studentName: string;
  isResubmission: boolean;
}

export interface TeacherDashboard {
  counts: Record<SubmissionStatus, number>;
  recent: QueueItem[];
}

interface StudentInfo {
  name: string;
  goal: LearningGoalRow | null;
}

/** Carrega nomes de alunos a partir dos student_profile_ids. */
async function loadStudentNames(
  studentProfileIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (studentProfileIds.length === 0) return map;

  const service = createSupabaseServiceClient();
  const { data: profiles } = await service
    .from("student_profiles")
    .select("id, user_id")
    .in("id", studentProfileIds);

  const userIds = (profiles ?? []).map((p) => p.user_id);
  const { data: users } = await service
    .from("users")
    .select("id, name")
    .in("id", userIds.length > 0 ? userIds : ["__none__"]);

  const nameByUserId = new Map((users ?? []).map((u) => [u.id, u.name]));
  for (const profile of profiles ?? []) {
    map.set(profile.id, nameByUserId.get(profile.user_id) ?? "Aluno");
  }
  return map;
}

async function loadMissionTitles(
  missionIds: string[],
): Promise<Map<string, string>> {
  const map = new Map<string, string>();
  if (missionIds.length === 0) return map;
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("missions")
    .select("id, title")
    .in("id", missionIds);
  for (const m of data ?? []) map.set(m.id, m.title);
  return map;
}

function toQueueItems(
  submissions: SubmissionRow[],
  studentNames: Map<string, string>,
  missionTitles: Map<string, string>,
): QueueItem[] {
  return submissions.map((submission) => ({
    submission,
    missionTitle: missionTitles.get(submission.mission_id) ?? "Missão",
    studentName: studentNames.get(submission.student_profile_id) ?? "Aluno",
    isResubmission: submission.attempt_number > 1,
  }));
}

export async function getTeacherDashboard(): Promise<TeacherDashboard> {
  const service = createSupabaseServiceClient();

  const { data: all } = await service
    .from("submissions")
    .select("*")
    .order("submitted_at", { ascending: false });

  const submissions = (all ?? []) as SubmissionRow[];

  const counts: Record<SubmissionStatus, number> = {
    pending: 0,
    approved: 0,
    rejected: 0,
  };
  for (const s of submissions) counts[s.status] += 1;

  const recentRaw = submissions.slice(0, 8);
  const studentNames = await loadStudentNames(
    recentRaw.map((s) => s.student_profile_id),
  );
  const missionTitles = await loadMissionTitles(
    recentRaw.map((s) => s.mission_id),
  );

  return {
    counts,
    recent: toQueueItems(recentRaw, studentNames, missionTitles),
  };
}

/**
 * Fila de validação. Pendentes primeiro (mais antigas no topo), depois
 * avaliadas (mais recentes no topo). Aceita filtro opcional por status.
 */
export async function getValidationQueue(
  filter?: SubmissionStatus,
): Promise<QueueItem[]> {
  const service = createSupabaseServiceClient();

  let query = service.from("submissions").select("*");
  if (filter) query = query.eq("status", filter);

  const { data } = await query;
  const submissions = (data ?? []) as SubmissionRow[];

  submissions.sort((a, b) => {
    const aPending = a.status === "pending" ? 0 : 1;
    const bPending = b.status === "pending" ? 0 : 1;
    if (aPending !== bPending) return aPending - bPending;
    // Pendentes: mais antigas primeiro. Avaliadas: mais recentes primeiro.
    const aTime = new Date(a.submitted_at).getTime();
    const bTime = new Date(b.submitted_at).getTime();
    return a.status === "pending" ? aTime - bTime : bTime - aTime;
  });

  const studentNames = await loadStudentNames(
    submissions.map((s) => s.student_profile_id),
  );
  const missionTitles = await loadMissionTitles(
    submissions.map((s) => s.mission_id),
  );

  return toQueueItems(submissions, studentNames, missionTitles);
}

export interface SubmissionDetail {
  submission: SubmissionRow;
  mission: MissionRow | null;
  student: StudentInfo;
  feedback: FeedbackRow | null;
  previousAttempts: { submission: SubmissionRow; feedback: FeedbackRow | null }[];
}

export async function getSubmissionDetail(
  submissionId: string,
): Promise<SubmissionDetail | null> {
  const service = createSupabaseServiceClient();

  const { data: submission } = await service
    .from("submissions")
    .select("*")
    .eq("id", submissionId)
    .maybeSingle();

  if (!submission) return null;

  const { data: mission } = await service
    .from("missions")
    .select("*")
    .eq("id", submission.mission_id)
    .maybeSingle();

  // Aluno + objetivo ativo.
  const { data: profile } = await service
    .from("student_profiles")
    .select("id, user_id, active_learning_goal_id")
    .eq("id", submission.student_profile_id)
    .maybeSingle();

  let studentName = "Aluno";
  let goal: LearningGoalRow | null = null;
  if (profile) {
    const { data: user } = await service
      .from("users")
      .select("name")
      .eq("id", profile.user_id)
      .maybeSingle();
    studentName = user?.name ?? "Aluno";

    if (profile.active_learning_goal_id) {
      const { data: g } = await service
        .from("learning_goals")
        .select("*")
        .eq("id", profile.active_learning_goal_id)
        .maybeSingle();
      goal = g;
    }
  }

  const { data: currentFeedback } = await service
    .from("feedback")
    .select("*")
    .eq("submission_id", submissionId)
    .maybeSingle();

  // Tentativas anteriores (mesma missao, mesmo aluno).
  const { data: history } = await service
    .from("submissions")
    .select("*")
    .eq("student_profile_id", submission.student_profile_id)
    .eq("mission_id", submission.mission_id)
    .neq("id", submissionId)
    .order("attempt_number", { ascending: false });

  const historyRows = (history ?? []) as SubmissionRow[];
  const historyFeedbacks = new Map<string, FeedbackRow>();
  if (historyRows.length > 0) {
    const { data: fbs } = await service
      .from("feedback")
      .select("*")
      .in(
        "submission_id",
        historyRows.map((s) => s.id),
      );
    for (const fb of fbs ?? []) historyFeedbacks.set(fb.submission_id, fb);
  }

  return {
    submission,
    mission,
    student: { name: studentName, goal },
    feedback: currentFeedback,
    previousAttempts: historyRows.map((s) => ({
      submission: s,
      feedback: historyFeedbacks.get(s.id) ?? null,
    })),
  };
}
