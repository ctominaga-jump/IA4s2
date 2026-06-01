import { describe, expect, it } from "vitest";

import { buildJourneyMap } from "@/lib/journey";
import type { JourneyPhaseRow } from "@/lib/database.types";
import type { MissionStatus } from "@/lib/domain";

interface TestMission {
  id: string;
  phaseId: string | null;
  status: MissionStatus;
}

const phases: JourneyPhaseRow[] = [
  phase({ id: "p1", number: 1, slug: "despertar", name: "Despertar" }),
  phase({ id: "p2", number: 2, slug: "explorador", name: "Explorador" }),
  phase({ id: "p3", number: 3, slug: "estrategista", name: "Estrategista" }),
  phase({ id: "p4", number: 4, slug: "operador", name: "Operador" }),
];

function build(missions: TestMission[]) {
  return buildJourneyMap(
    phases,
    missions,
    (m) => m.phaseId,
    (m) => m.status,
  );
}

describe("buildJourneyMap", () => {
  it("orders groups by phase number and counts approvals", () => {
    const { groups } = build([
      { id: "m1", phaseId: "p1", status: "approved" },
      { id: "m2", phaseId: "p1", status: "not_started" },
    ]);

    expect(groups.map((g) => g.phase.number)).toEqual([1, 2, 3, 4]);
    expect(groups[0].total).toBe(2);
    expect(groups[0].approved).toBe(1);
    expect(groups[0].percent).toBe(50);
  });

  it("marks fully approved phases complete and the first pending phase active", () => {
    const { groups, activePhaseNumber } = build([
      { id: "m1", phaseId: "p1", status: "approved" },
      { id: "m2", phaseId: "p2", status: "pending" },
      { id: "m3", phaseId: "p3", status: "not_started" },
    ]);

    expect(groups[0].state).toBe("complete");
    expect(groups[1].state).toBe("active");
    expect(activePhaseNumber).toBe(2);
  });

  it("locks phases with missions that come after the active phase", () => {
    const { groups } = build([
      { id: "m1", phaseId: "p1", status: "not_started" },
      { id: "m2", phaseId: "p3", status: "not_started" },
    ]);

    expect(groups[0].state).toBe("active");
    // fase 2 nao tem missoes -> empty; fase 3 vem depois da ativa -> locked
    expect(groups[1].state).toBe("empty");
    expect(groups[2].state).toBe("locked");
  });

  it("treats phases without missions as empty (conteudo futuro)", () => {
    const { groups } = build([{ id: "m1", phaseId: "p1", status: "approved" }]);

    expect(groups[0].state).toBe("complete");
    expect(groups[3].state).toBe("empty");
  });

  it("collects missions with unknown or null phase as orphans", () => {
    const { groups, orphans } = build([
      { id: "m1", phaseId: null, status: "approved" },
      { id: "m2", phaseId: "ghost", status: "pending" },
      { id: "m3", phaseId: "p1", status: "not_started" },
    ]);

    expect(orphans.map((m) => m.id)).toEqual(["m1", "m2"]);
    expect(groups[0].total).toBe(1);
  });

  it("returns null active phase when no phase has missions", () => {
    const { activePhaseNumber } = build([]);
    expect(activePhaseNumber).toBeNull();
  });
});

function phase(overrides: Partial<JourneyPhaseRow>): JourneyPhaseRow {
  return {
    id: "p",
    number: 1,
    slug: "slug",
    name: "Fase",
    tagline: "tagline",
    created_at: "2026-05-31T00:00:00.000Z",
    updated_at: "2026-05-31T00:00:00.000Z",
    ...overrides,
  };
}
