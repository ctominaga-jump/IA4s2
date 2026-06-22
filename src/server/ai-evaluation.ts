"use server";

import { z } from "zod";

import { requireTeacherContext } from "@/lib/auth/session";
import { aiEvaluationEnabled } from "@/lib/feature-flags";
import { GeminiError, generateStructured } from "@/lib/ai/gemini";
import {
  buildEvaluationPrompt,
  RESPONSE_SCHEMA,
  SYSTEM_PROMPT,
  suggestionSchema,
  type AiSuggestionResult,
} from "@/lib/ai/evaluation";
import { getSubmissionDetail } from "@/server/teacher-data";

export type { AiSuggestion, AiSuggestionResult } from "@/lib/ai/evaluation";

/**
 * Gera uma sugestão de avaliação por IA para uma entrega. Apenas professores.
 * A sugestão é sempre revisada e confirmada por um humano — esta action não
 * persiste nada no banco.
 */
export async function suggestEvaluationAction(
  submissionId: string,
): Promise<AiSuggestionResult> {
  await requireTeacherContext();

  if (!aiEvaluationEnabled()) {
    return { error: "Avaliação por IA não está habilitada." };
  }

  const parsedId = z.string().uuid().safeParse(submissionId);
  if (!parsedId.success) {
    return { error: "Entrega inválida." };
  }

  const detail = await getSubmissionDetail(parsedId.data);
  if (!detail) {
    return { error: "Entrega não encontrada." };
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25_000);
    let raw: unknown;
    try {
      raw = await generateStructured({
        system: SYSTEM_PROMPT,
        user: buildEvaluationPrompt(detail),
        schema: RESPONSE_SCHEMA,
        signal: controller.signal,
      });
    } finally {
      clearTimeout(timeout);
    }

    const result = suggestionSchema.safeParse(raw);
    if (!result.success) {
      return { error: "A IA retornou uma resposta inesperada. Tente de novo." };
    }
    return { suggestion: result.data };
  } catch (error) {
    if (error instanceof GeminiError) {
      console.error("[ai-evaluation]", error.message, error.cause ?? "");
    } else {
      console.error("[ai-evaluation] erro inesperado", error);
    }
    return {
      error: "Não foi possível gerar a sugestão agora. Avalie manualmente.",
    };
  }
}
