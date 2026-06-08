import { describe, expect, it } from "vitest";

import { PHASES } from "@/components/game/journey-phases";
import { buildJourneyMap, resolveCurrentPhaseIndex } from "@/lib/journey";
import type { JourneyPhaseRow } from "@/lib/database.types";
import type { MissionStatus } from "@/lib/domain";

// ============================================================
// Coesao da jornada de 8 fases (rodada de coesao visual).
// ============================================================

describe("PHASES (metadata visual)", () => {
  it("tem 8 fases na ordem do seed 0004", () => {
    expect(PHASES.map((p) => p.name)).toEqual([
      "Despertar",
      "Explorador",
      "Estrategista",
      "Criador",
      "Operador IA",
      "Op. Tecnico",
      "Arquiteto",
      "Boss Final",
    ]);
  });

  it("Operador IA e Op. Tecnico usam icones distintos", () => {
    expect(PHASES[4].icon).not.toBe(PHASES[5].icon);
  });
});

interface TestMission {
  phaseId: string | null;
  status: MissionStatus;
}

function phase(number: number, id: string): JourneyPhaseRow {
  return {
    id,
    number,
    slug: `f${number}`,
    name: `Fase ${number}`,
    tagline: "t",
    created_at: "2026-06-07T00:00:00.000Z",
    updated_at: "2026-06-07T00:00:00.000Z",
  };
}

// 8 fases; a fase 8 (Boss) nao tem missoes (empty), como em producao.
const PHASES_8: JourneyPhaseRow[] = Array.from({ length: 8 }, (_, i) =>
  phase(i + 1, `p${i + 1}`),
);

function mapFor(missions: TestMission[]) {
  return buildJourneyMap(
    PHASES_8,
    missions,
    (m) => m.phaseId,
    (m) => m.status,
  );
}

describe("resolveCurrentPhaseIndex", () => {
  it("retorna 0 (Despertar) quando nao ha missoes iniciadas", () => {
    const map = mapFor([
      { phaseId: "p1", status: "not_started" },
      { phaseId: "p2", status: "not_started" },
    ]);
    expect(resolveCurrentPhaseIndex(map)).toBe(0);
  });

  it("aponta para a fase em andamento (activePhaseNumber - 1)", () => {
    const map = mapFor([
      { phaseId: "p1", status: "approved" },
      { phaseId: "p2", status: "pending" },
      { phaseId: "p3", status: "not_started" },
    ]);
    expect(resolveCurrentPhaseIndex(map)).toBe(1); // fase 2
  });

  it("nao adianta o Boss: 23/24 aprovadas com pendente na fase 7 -> indice 6", () => {
    const missions: TestMission[] = [];
    // fases 1-6 (4 missoes cada) todas aprovadas
    for (const p of ["p1", "p2", "p3", "p4", "p5", "p6"]) {
      for (let i = 0; i < 4; i++) missions.push({ phaseId: p, status: "approved" });
    }
    // fase 7: 3 aprovadas + 1 pendente
    missions.push({ phaseId: "p7", status: "approved" });
    missions.push({ phaseId: "p7", status: "approved" });
    missions.push({ phaseId: "p7", status: "approved" });
    missions.push({ phaseId: "p7", status: "pending" });
    const map = mapFor(missions);
    expect(resolveCurrentPhaseIndex(map)).toBe(6); // fase 7, nunca o Boss (7)
  });

  it("aponta para a ultima fase (Boss) quando todas as fases com missoes estao completas", () => {
    const missions: TestMission[] = [];
    for (const p of ["p1", "p2", "p3", "p4", "p5", "p6", "p7"]) {
      missions.push({ phaseId: p, status: "approved" });
    }
    const map = mapFor(missions);
    expect(resolveCurrentPhaseIndex(map)).toBe(7); // Boss Final (indice da ultima fase)
  });

  it("retorna 0 quando nenhuma fase tem missoes", () => {
    const map = mapFor([]);
    expect(resolveCurrentPhaseIndex(map)).toBe(0);
  });
});
