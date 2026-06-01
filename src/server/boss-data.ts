import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type {
  BossProjectRow,
  LearningGoalRow,
} from "@/lib/database.types";

/** Projeto final do aluno (ou null se ainda nao existe). */
export async function getBossProjectForStudent(
  studentProfileId: string,
): Promise<BossProjectRow | null> {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("boss_projects")
    .select("*")
    .eq("student_profile_id", studentProfileId)
    .maybeSingle();
  return data;
}

export interface BossQueueItem {
  project: BossProjectRow;
  studentName: string;
  goalTitle: string | null;
}

/**
 * Fila de projetos finais para o professor. Submetidos primeiro (mais antigos
 * no topo), depois avaliados (mais recentes no topo). Rascunhos nunca aparecem.
 */
export async function getBossProjectQueue(): Promise<BossQueueItem[]> {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("boss_projects")
    .select("*")
    .neq("status", "draft");

  const projects = (data ?? []) as BossProjectRow[];
  if (projects.length === 0) return [];

  projects.sort((a, b) => {
    const aSubmitted = a.status === "submitted" ? 0 : 1;
    const bSubmitted = b.status === "submitted" ? 0 : 1;
    if (aSubmitted !== bSubmitted) return aSubmitted - bSubmitted;
    const aTime = new Date(a.submitted_at ?? a.updated_at).getTime();
    const bTime = new Date(b.submitted_at ?? b.updated_at).getTime();
    return a.status === "submitted" ? aTime - bTime : bTime - aTime;
  });

  const names = await loadStudentNames(
    projects.map((p) => p.student_profile_id),
  );

  return projects.map((project) => ({
    project,
    studentName: names.get(project.student_profile_id) ?? "Aluno",
    goalTitle: null,
  }));
}

export interface BossProjectDetail {
  project: BossProjectRow;
  studentName: string;
  goal: LearningGoalRow | null;
}

export async function getBossProjectDetail(
  projectId: string,
): Promise<BossProjectDetail | null> {
  const service = createSupabaseServiceClient();
  const { data: project } = await service
    .from("boss_projects")
    .select("*")
    .eq("id", projectId)
    .maybeSingle();

  if (!project) return null;

  const { data: profile } = await service
    .from("student_profiles")
    .select("id, user_id, active_learning_goal_id")
    .eq("id", project.student_profile_id)
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

  return { project, studentName, goal };
}

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
