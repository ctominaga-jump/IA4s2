import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  requireTeacherContext: vi.fn(async () => ({
    teacherProfile: { id: "00000000-0000-0000-0000-0000000000aa" },
  })),
  getSubmissionDetail: vi.fn(),
  generateStructured: vi.fn(),
}));

vi.mock("@/lib/auth/session", () => ({
  requireTeacherContext: mocks.requireTeacherContext,
}));

vi.mock("@/server/teacher-data", () => ({
  getSubmissionDetail: mocks.getSubmissionDetail,
}));

vi.mock("@/lib/ai/gemini", () => ({
  generateStructured: mocks.generateStructured,
  // GeminiError precisa ser uma classe real para o `instanceof` da action.
  GeminiError: class GeminiError extends Error {},
}));

import { buildEvaluationPrompt } from "@/lib/ai/evaluation";
import { suggestEvaluationAction } from "@/server/ai-evaluation";

const SUBMISSION_ID = "00000000-0000-0000-0000-000000000001";

function detail(overrides: Record<string, unknown> = {}) {
  return {
    submission: {
      id: SUBMISSION_ID,
      content: "Resposta do aluno com 3 exemplos.",
      attempt_number: 2,
      status: "pending",
    },
    mission: {
      title: "Descubra a IA no seu dia",
      learning_objective: "Reconhecer aplicações de IA.",
      instructions: "Liste 3 situações.",
      expected_submission: "Envie as 3 situações.",
      acceptance_criteria: "O aluno cita 3 exemplos concretos.",
    },
    student: { name: "Aluno", goal: null },
    feedback: null,
    previousAttempts: [
      {
        submission: { attempt_number: 1, status: "rejected" },
        feedback: { comment: "Faltou um exemplo." },
      },
    ],
    ...overrides,
  };
}

describe("buildEvaluationPrompt", () => {
  it("inclui rubrica, tentativas anteriores e a resposta do aluno", () => {
    const prompt = buildEvaluationPrompt(detail() as never);
    expect(prompt).toContain("Critério de aprovação: O aluno cita 3 exemplos");
    expect(prompt).toContain("Tentativa 1 (rejected): Faltou um exemplo.");
    expect(prompt).toContain("Resposta do aluno com 3 exemplos.");
    expect(prompt).toContain("tentativa 2");
  });

  it("usa fallback quando não há critério de aprovação", () => {
    const d = detail();
    (d.mission as Record<string, unknown>).acceptance_criteria = null;
    const prompt = buildEvaluationPrompt(d as never);
    expect(prompt).toContain("não definido");
  });
});

describe("suggestEvaluationAction", () => {
  beforeEach(() => {
    mocks.getSubmissionDetail.mockReset();
    mocks.generateStructured.mockReset();
    process.env.GEMINI_API_KEY = "test-key";
    process.env.ENABLE_AI_EVALUATION = "1";
  });

  afterEach(() => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.ENABLE_AI_EVALUATION;
  });

  it("desliga quando a feature flag está off (sem chave)", async () => {
    delete process.env.GEMINI_API_KEY;
    const result = await suggestEvaluationAction(SUBMISSION_ID);
    expect(result.error).toMatch(/não está habilitada/);
    expect(mocks.generateStructured).not.toHaveBeenCalled();
  });

  it("rejeita id inválido antes de chamar a IA", async () => {
    const result = await suggestEvaluationAction("nao-e-uuid");
    expect(result.error).toBe("Entrega inválida.");
    expect(mocks.getSubmissionDetail).not.toHaveBeenCalled();
  });

  it("retorna a sugestão validada quando a IA responde bem", async () => {
    mocks.getSubmissionDetail.mockResolvedValue(detail());
    mocks.generateStructured.mockResolvedValue({
      decision: "approved",
      comment: "Bom trabalho, os 3 exemplos estão claros.",
      confidence: "alta",
    });

    const result = await suggestEvaluationAction(SUBMISSION_ID);

    expect(result.suggestion).toEqual({
      decision: "approved",
      comment: "Bom trabalho, os 3 exemplos estão claros.",
      confidence: "alta",
    });
    expect(mocks.generateStructured).toHaveBeenCalledOnce();
  });

  it("trata resposta da IA fora do schema", async () => {
    mocks.getSubmissionDetail.mockResolvedValue(detail());
    mocks.generateStructured.mockResolvedValue({ decision: "maybe" });

    const result = await suggestEvaluationAction(SUBMISSION_ID);
    expect(result.error).toMatch(/resposta inesperada/);
    expect(result.suggestion).toBeUndefined();
  });

  it("trata erro de rede/serviço da IA com mensagem amigável", async () => {
    mocks.getSubmissionDetail.mockResolvedValue(detail());
    mocks.generateStructured.mockRejectedValue(new Error("boom"));
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    const result = await suggestEvaluationAction(SUBMISSION_ID);
    expect(result.error).toMatch(/Avalie manualmente/);
    spy.mockRestore();
  });
});
