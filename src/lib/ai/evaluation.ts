import { z } from "zod";

import type { GeminiSchema } from "@/lib/ai/gemini";
import type { SubmissionDetail } from "@/server/teacher-data";

export interface AiSuggestion {
  decision: "approved" | "rejected";
  comment: string;
  confidence: "alta" | "media" | "baixa";
}

export interface AiSuggestionResult {
  suggestion?: AiSuggestion;
  error?: string;
}

export const suggestionSchema = z.object({
  decision: z.enum(["approved", "rejected"]),
  comment: z.string().trim().min(1),
  confidence: z.enum(["alta", "media", "baixa"]),
});

export const RESPONSE_SCHEMA: GeminiSchema = {
  type: "OBJECT",
  properties: {
    decision: { type: "STRING", enum: ["approved", "rejected"] },
    comment: { type: "STRING" },
    confidence: { type: "STRING", enum: ["alta", "media", "baixa"] },
  },
  required: ["decision", "comment", "confidence"],
  propertyOrdering: ["decision", "comment", "confidence"],
};

export const SYSTEM_PROMPT = `Você é um assistente pedagógico que ajuda um professor a avaliar entregas de alunos na plataforma "IA para Vida Real".

Seu papel é SUGERIR (nunca decidir sozinho): o professor sempre revisa e confirma.

Regras:
- Avalie a resposta do aluno SOMENTE contra os critérios da missão (objetivo, instruções, entrega esperada e critério de aprovação).
- "approved" quando a resposta cumpre o critério de aprovação; "rejected" quando falta algo essencial.
- O feedback deve ser em português do Brasil, acolhedor e construtivo: diga o que ficou bom e, se reprovar, o próximo passo concreto. 2 a 4 frases.
- Não invente fatos sobre o aluno nem exija mais do que a missão pede.
- Indique "confidence" (alta/media/baixa) conforme a clareza da evidência na resposta.`;

/**
 * Monta o conteúdo de usuário enviado ao modelo a partir do detalhe da
 * entrega. Função pura para facilitar teste sem rede.
 */
export function buildEvaluationPrompt(detail: SubmissionDetail): string {
  const { submission, mission, previousAttempts } = detail;

  const rubric = mission
    ? [
        `Título da missão: ${mission.title}`,
        `Objetivo de aprendizagem: ${mission.learning_objective}`,
        `Instruções para o aluno: ${mission.instructions}`,
        `Entrega esperada: ${mission.expected_submission}`,
        mission.acceptance_criteria
          ? `Critério de aprovação: ${mission.acceptance_criteria}`
          : "Critério de aprovação: (não definido — use o objetivo e a entrega esperada como referência)",
      ].join("\n")
    : "Contexto da missão indisponível.";

  const history =
    previousAttempts.length > 0
      ? previousAttempts
          .map(
            ({ submission: prev, feedback }) =>
              `- Tentativa ${prev.attempt_number} (${prev.status}): ${
                feedback?.comment ?? "sem feedback registrado"
              }`,
          )
          .join("\n")
      : "Nenhuma tentativa anterior.";

  return [
    "=== RUBRICA DA MISSÃO ===",
    rubric,
    "",
    "=== TENTATIVAS ANTERIORES ===",
    history,
    "",
    `=== RESPOSTA DO ALUNO (tentativa ${submission.attempt_number}) ===`,
    submission.content,
  ].join("\n");
}
