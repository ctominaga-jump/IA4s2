"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireTeacherContext } from "@/lib/auth/session";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export interface ReviewFormState {
  error?: string;
}

const reviewSchema = z.object({
  submissionId: z.string().uuid("Entrega invalida."),
  decision: z.enum(["approved", "rejected"], {
    errorMap: () => ({ message: "Escolha aprovar ou reprovar." }),
  }),
  comment: z
    .string()
    .trim()
    .min(1, "O feedback é obrigatório para aprovar ou reprovar."),
});

const ERROR_MESSAGES: Record<string, string> = {
  feedback_required: "O feedback é obrigatório para aprovar ou reprovar.",
  submission_not_found: "Entrega não encontrada.",
  submission_not_pending:
    "Esta entrega já foi avaliada e não pode ser alterada.",
};

export async function reviewSubmissionAction(
  _prev: ReviewFormState,
  formData: FormData,
): Promise<ReviewFormState> {
  const { teacherProfile } = await requireTeacherContext();

  const parsed = reviewSchema.safeParse({
    submissionId: formData.get("submissionId"),
    decision: formData.get("decision"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  const { submissionId, decision, comment } = parsed.data;
  const service = createSupabaseServiceClient();

  const { error } = await service.rpc("review_submission", {
    p_submission_id: submissionId,
    p_teacher_profile_id: teacherProfile.id,
    p_decision: decision,
    p_comment: comment,
  });

  if (error) {
    const known = Object.keys(ERROR_MESSAGES).find((key) =>
      error.message.includes(key),
    );
    return {
      error: known
        ? ERROR_MESSAGES[known]
        : "Não foi possível registrar a avaliação. Tente novamente.",
    };
  }

  redirect("/professor/fila?avaliada=1");
}
