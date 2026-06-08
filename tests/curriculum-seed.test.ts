import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

// ============================================================
// Invariantes estaticas do curriculo (seeds 0003 + 0004).
// Sem banco: parseia os arquivos SQL e valida as regras de conteudo
// aprovadas na rodada de curriculo avancado (docs/product-evolution/19).
// ============================================================

const SEEDS_DIR = join(__dirname, "..", "database", "seeds");
const seed0003 = readFileSync(join(SEEDS_DIR, "0003_journey_content.sql"), "utf8");
const seed0004 = readFileSync(join(SEEDS_DIR, "0004_advanced_curriculum.sql"), "utf8");

interface SeedMission {
  id: string;
  moduleId: string;
  phaseId: string;
  title: string;
  description: string;
  learningObjective: string;
  instructions: string;
  expectedSubmission: string;
  acceptanceCriteria: string;
  difficulty: string;
  estimatedMinutes: number;
  xpReward: number;
  position: number;
  status: string;
}

/** Tokeniza o bloco VALUES de um INSERT, respeitando strings ('' como escape)
 *  e comentarios de linha (--), e devolve uma lista de tuplas de valores. */
function parseInsertTuples(sql: string, insertMarker: string): (string | number)[][] {
  const start = sql.indexOf(insertMarker);
  if (start === -1) throw new Error(`insert nao encontrado: ${insertMarker}`);
  const valuesStart = sql.indexOf("values", start);
  const end = sql.indexOf("on conflict", valuesStart);
  const block = sql.slice(valuesStart + "values".length, end);

  const tuples: (string | number)[][] = [];
  let current: (string | number)[] | null = null;
  let depth = 0;
  let i = 0;

  while (i < block.length) {
    const ch = block[i];

    // comentario de linha
    if (ch === "-" && block[i + 1] === "-") {
      const eol = block.indexOf("\n", i);
      i = eol === -1 ? block.length : eol + 1;
      continue;
    }

    // string literal
    if (ch === "'") {
      let value = "";
      i += 1;
      while (i < block.length) {
        if (block[i] === "'" && block[i + 1] === "'") {
          value += "'";
          i += 2;
        } else if (block[i] === "'") {
          i += 1;
          break;
        } else {
          value += block[i];
          i += 1;
        }
      }
      if (depth >= 1 && current) current.push(value);
      continue;
    }

    if (ch === "(") {
      depth += 1;
      if (depth === 1) current = [];
      i += 1;
      continue;
    }

    if (ch === ")") {
      depth -= 1;
      if (depth === 0 && current) {
        tuples.push(current);
        current = null;
      }
      i += 1;
      continue;
    }

    // numero
    if (/[0-9]/.test(ch) && depth >= 1) {
      let num = "";
      while (i < block.length && /[0-9]/.test(block[i])) {
        num += block[i];
        i += 1;
      }
      current?.push(Number(num));
      continue;
    }

    i += 1;
  }

  return tuples;
}

function parseMissions(sql: string): SeedMission[] {
  return parseInsertTuples(sql, "insert into public.missions").map((tuple) => {
    if (tuple.length !== 14) {
      throw new Error(`tupla de missao com ${tuple.length} valores: ${tuple[0]}`);
    }
    const [
      id, moduleId, phaseId, title, description, learningObjective, instructions,
      expectedSubmission, acceptanceCriteria, difficulty, estimatedMinutes,
      xpReward, position, status,
    ] = tuple;
    return {
      id, moduleId, phaseId, title, description, learningObjective, instructions,
      expectedSubmission, acceptanceCriteria, difficulty, estimatedMinutes,
      xpReward, position, status,
    } as SeedMission;
  });
}

/** Estado final do curriculo: 0003 aplicado e sobrescrito pelo 0004 (upsert por id). */
function finalCurriculum(): Map<string, SeedMission> {
  const byId = new Map<string, SeedMission>();
  for (const mission of parseMissions(seed0003)) byId.set(mission.id, mission);
  for (const mission of parseMissions(seed0004)) byId.set(mission.id, mission);
  return byId;
}

const PHASE_IDS = {
  f1: "00000000-0000-0000-0000-0000000f0001",
  f2: "00000000-0000-0000-0000-0000000f0002",
  f3: "00000000-0000-0000-0000-0000000f0003",
  f4: "00000000-0000-0000-0000-0000000f0004",
  f5: "00000000-0000-0000-0000-0000000f0005",
  f6Tecnico: "00000000-0000-0000-0000-0000000f0008",
  f7Arquiteto: "00000000-0000-0000-0000-0000000f0006",
} as const;

const XP_BANDS: Record<string, [number, number]> = {
  easy: [40, 60],
  medium: [70, 100],
  hard: [120, 150],
};

const SEED_0003_MISSION_IDS = [
  "00000000-0000-0000-0000-0000000e0101",
  "00000000-0000-0000-0000-0000000e0102",
  "00000000-0000-0000-0000-0000000e0001",
  "00000000-0000-0000-0000-0000000e0002",
  "00000000-0000-0000-0000-0000000e0003",
  "00000000-0000-0000-0000-0000000e0203",
  "00000000-0000-0000-0000-0000000e0004",
  "00000000-0000-0000-0000-0000000e0302",
  "00000000-0000-0000-0000-0000000e0303",
  "00000000-0000-0000-0000-0000000e0005",
  "00000000-0000-0000-0000-0000000e0402",
  "00000000-0000-0000-0000-0000000e0403",
  "00000000-0000-0000-0000-0000000e0501",
  "00000000-0000-0000-0000-0000000e0502",
  "00000000-0000-0000-0000-0000000e0503",
  "00000000-0000-0000-0000-0000000e0601",
  "00000000-0000-0000-0000-0000000e0602",
  "00000000-0000-0000-0000-0000000e0603",
];

describe("curriculo avancado (seeds 0003 + 0004)", () => {
  const curriculum = finalCurriculum();
  const missions = [...curriculum.values()];

  it("tem 24 missoes com positions unicas e sequenciais 1..24", () => {
    expect(missions).toHaveLength(24);
    const positions = missions.map((m) => m.position).sort((a, b) => a - b);
    expect(positions).toEqual(Array.from({ length: 24 }, (_, i) => i + 1));
  });

  it("preserva todas as missoes do seed 0003 (nenhum id deletado)", () => {
    for (const id of SEED_0003_MISSION_IDS) {
      expect(curriculum.has(id), `missao ${id} sumiu`).toBe(true);
    }
    expect(seed0004.toLowerCase()).not.toContain("delete from");
  });

  it("mantem XP dentro das bandas por dificuldade e minutos positivos", () => {
    for (const m of missions) {
      const band = XP_BANDS[m.difficulty];
      expect(band, `dificuldade desconhecida em ${m.title}`).toBeDefined();
      expect(
        m.xpReward >= band[0] && m.xpReward <= band[1],
        `${m.title}: xp ${m.xpReward} fora da banda ${m.difficulty}`,
      ).toBe(true);
      expect(m.estimatedMinutes).toBeGreaterThan(0);
      expect(m.status).toBe("published");
    }
  });

  it("distribui 4 missoes em cada fase avancada (5, 6 e 7)", () => {
    const countByPhase = (phaseId: string) =>
      missions.filter((m) => m.phaseId === phaseId).length;
    expect(countByPhase(PHASE_IDS.f5)).toBe(4);
    expect(countByPhase(PHASE_IDS.f6Tecnico)).toBe(4);
    expect(countByPhase(PHASE_IDS.f7Arquiteto)).toBe(4);
  });

  it("nao exige terminal/VS Code antes da fase 6 (Operador Tecnico)", () => {
    const earlyPhases = new Set<string>([
      PHASE_IDS.f1, PHASE_IDS.f2, PHASE_IDS.f3, PHASE_IDS.f4, PHASE_IDS.f5,
    ]);
    const forbidden = /terminal|vs code|visual studio|editor de codigo/i;
    for (const m of missions.filter((mm) => earlyPhases.has(mm.phaseId))) {
      const text = [
        m.title, m.description, m.learningObjective,
        m.instructions, m.expectedSubmission, m.acceptanceCriteria,
      ].join(" ");
      expect(forbidden.test(text), `mencao tecnica precoce em "${m.title}"`).toBe(false);
    }
  });

  it("fase 6 (Operador Tecnico) so usa dificuldade easy/medium e oferece fallback simulado", () => {
    const f6 = missions.filter((m) => m.phaseId === PHASE_IDS.f6Tecnico);
    for (const m of f6) {
      expect(["easy", "medium"]).toContain(m.difficulty);
    }
    // degraus 2-4 exigem declaracao real/simulado na entrega
    const withEvidence = f6.filter((m) => m.difficulty === "medium");
    for (const m of withEvidence) {
      expect(
        /real ou simulado/i.test(m.expectedSubmission + m.acceptanceCriteria),
        `missao tecnica sem declaracao real/simulado: "${m.title}"`,
      ).toBe(true);
    }
  });

  it("renumera fases na ordem segura no seed 0004 (8 antes de 7 antes da nova fase 6)", () => {
    const idxBoss = seed0004.indexOf("number = 8");
    const idxArquiteto = seed0004.indexOf("number = 7");
    const idxNovaFase = seed0004.indexOf("'operador-tecnico'");
    expect(idxBoss).toBeGreaterThan(-1);
    expect(idxArquiteto).toBeGreaterThan(idxBoss);
    expect(idxNovaFase).toBeGreaterThan(idxArquiteto);
  });
});
