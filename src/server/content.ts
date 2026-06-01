import "server-only";

import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type {
  CourseRow,
  JourneyPhaseRow,
  MissionRow,
  ModuleRow,
} from "@/lib/database.types";

export interface PublishedJourney {
  course: CourseRow | null;
  modules: ModuleRow[];
  missions: MissionRow[];
}

/**
 * Carrega o conteudo publicado visivel para alunos: apenas missoes
 * publicadas que pertencem a modulos publicados de cursos publicados.
 * Ordena por posicao do modulo e da missao.
 */
export async function getPublishedJourney(): Promise<PublishedJourney> {
  const service = createSupabaseServiceClient();

  const { data: courses } = await service
    .from("courses")
    .select("*")
    .eq("status", "published")
    .order("created_at", { ascending: true });

  if (!courses || courses.length === 0) {
    return { course: null, modules: [], missions: [] };
  }

  const courseIds = courses.map((c) => c.id);

  const { data: modules } = await service
    .from("modules")
    .select("*")
    .eq("status", "published")
    .in("course_id", courseIds)
    .order("position", { ascending: true });

  const moduleIds = (modules ?? []).map((m) => m.id);

  let missions: MissionRow[] = [];
  if (moduleIds.length > 0) {
    const { data } = await service
      .from("missions")
      .select("*")
      .eq("status", "published")
      .in("module_id", moduleIds)
      .order("position", { ascending: true });
    missions = data ?? [];
  }

  return {
    course: courses[0],
    modules: modules ?? [],
    missions,
  };
}

/** Fases narrativas da jornada, ordenadas. */
export async function getJourneyPhases(): Promise<JourneyPhaseRow[]> {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("journey_phases")
    .select("*")
    .order("number", { ascending: true });
  return data ?? [];
}

export async function getPublishedMissionById(
  missionId: string,
): Promise<MissionRow | null> {
  const service = createSupabaseServiceClient();
  const { data } = await service
    .from("missions")
    .select("*")
    .eq("id", missionId)
    .eq("status", "published")
    .maybeSingle();
  return data;
}
