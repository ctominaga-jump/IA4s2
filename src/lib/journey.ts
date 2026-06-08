import type { JourneyPhaseRow } from "@/lib/database.types";
import type { MissionStatus } from "@/lib/domain";

export type PhaseState = "empty" | "locked" | "active" | "complete";

export interface PhaseGroup<T> {
  phase: JourneyPhaseRow;
  missions: T[];
  total: number;
  approved: number;
  percent: number;
  state: PhaseState;
}

export interface JourneyMap<T> {
  groups: PhaseGroup<T>[];
  /** Missoes publicadas sem fase associada (defesa contra conteudo orfao). */
  orphans: T[];
  /** Numero da fase em andamento, ou null se nenhuma fase tem missoes. */
  activePhaseNumber: number | null;
}

/**
 * Agrupa missoes (com estado por aluno) nas fases narrativas da jornada e
 * deriva o estado de cada fase. Funcao pura: nao acessa banco e e testavel.
 *
 * Regras de estado (em ordem de numero da fase):
 * - `empty`: fase sem missoes (conteudo futuro).
 * - `complete`: todas as missoes da fase aprovadas.
 * - `active`: primeira fase com missoes ainda nao concluida.
 * - `locked`: fase com missoes depois da fase ativa.
 */
export function buildJourneyMap<T>(
  phases: JourneyPhaseRow[],
  missions: T[],
  getPhaseId: (mission: T) => string | null,
  getStatus: (mission: T) => MissionStatus,
): JourneyMap<T> {
  const byPhase = new Map<string, T[]>();
  const orphans: T[] = [];
  const phaseIds = new Set(phases.map((p) => p.id));

  for (const mission of missions) {
    const phaseId = getPhaseId(mission);
    if (phaseId && phaseIds.has(phaseId)) {
      const list = byPhase.get(phaseId) ?? [];
      list.push(mission);
      byPhase.set(phaseId, list);
    } else {
      orphans.push(mission);
    }
  }

  const sorted = [...phases].sort((a, b) => a.number - b.number);
  let activeAssigned = false;
  let activePhaseNumber: number | null = null;

  const groups: PhaseGroup<T>[] = sorted.map((phase) => {
    const phaseMissions = byPhase.get(phase.id) ?? [];
    const total = phaseMissions.length;
    const approved = phaseMissions.filter(
      (mission) => getStatus(mission) === "approved",
    ).length;
    const percent = total > 0 ? Math.round((approved / total) * 100) : 0;

    let state: PhaseState;
    if (total === 0) {
      state = "empty";
    } else if (approved === total) {
      state = "complete";
    } else if (!activeAssigned) {
      state = "active";
      activeAssigned = true;
      activePhaseNumber = phase.number;
    } else {
      state = "locked";
    }

    return { phase, missions: phaseMissions, total, approved, percent, state };
  });

  return { groups, orphans, activePhaseNumber };
}

/**
 * Indice 0-based da fase atual do aluno, derivado da jornada REAL (nao de
 * proporcao de XP). Usado por cockpit/perfil/avatar para nunca mostrar uma
 * fase adiantada (ex.: Boss Final) antes de ela ser alcancada.
 *
 * - fase em andamento -> `activePhaseNumber - 1`;
 * - sem nenhuma missao em fase alguma -> 0 (Despertar);
 * - todas as fases com missoes concluidas -> ultima fase (Boss Final).
 */
export function resolveCurrentPhaseIndex<T>(map: JourneyMap<T>): number {
  if (map.activePhaseNumber !== null) {
    return map.activePhaseNumber - 1;
  }
  const withMissions = map.groups.filter((group) => group.total > 0);
  if (withMissions.length === 0) return 0;
  if (withMissions.every((group) => group.state === "complete")) {
    return map.groups.length - 1;
  }
  return 0;
}
