"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireStudentContext, requireTeacherContext } from "@/lib/auth/session";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type { BossProjectRow } from "@/lib/database.types";

export interface BossDraftFormState {
  error?: string;
  saved?: boolean;
}

export interface BossReviewFormState {
  error?: string;
}

// Cada etapa e opcional ao salvar rascunho (o aluno preenche aos poucos).
const optionalStage = z
  .string()
  .trim()
  .max(8000, "Texto muito longo.")
  .optional()
  .transform((v) => v ?? "");

const draftSchema = z.object({
  title: z.string().trim().max(140, "Titulo muito longo.").optional().transform((v) => v ?? ""),
  problem: optionalStage,
  solution: optionalStage,
  architecture: optionalStage,
  prototype: optionalStage,
  validation: optionalStage,
});

const SUBMIT_ERRORS: Record<string, string> = {
  boss_project_incomplete:
    "Preencha o titulo e as 5 etapas antes de enviar para validacao.",
  boss_project_not_found: "Salve seu projeto antes de enviar.",
  boss_project_forbidden: "Voce so pode enviar o seu proprio projeto.",
  boss_project_already_submitted:
    "Seu projeto ja foi enviado e esta aguardando validacao.",
  boss_project_already_approved: "Seu projeto final ja foi aprovado.",
};

const REVIEW_ERRORS: Record<string, string> = {
  feedback_required: "O feedback e obrigatorio para aprovar ou reprovar.",
  boss_project_not_found: "Projeto nao encontrado.",
  boss_project_not_submitted:
    "Este projeto ja foi avaliado ou nao esta aguardando validacao.",
};

/**
 * Salva o rascunho do projeto final do aluno (upsert por aluno). Permitido
 * apenas enquanto o projeto esta em rascunho ou foi reprovado (reenvio).
 * Nao redireciona: mantem o aluno na pagina com indicacao de salvo.
 */
export async function saveBossDraftAction(
  _prev: BossDraftFormState,
  formData: FormData,
): Promise<BossDraftFormState> {
  const { studentProfile } = await requireStudentContext();

  const parsed = draftSchema.safeParse({
    title: formData.get("title"),
    problem: formData.get("problem"),
    solution: formData.get("solution"),
    architecture: formData.get("architecture"),
    prototype: formData.get("prototype"),
    validation: formData.get("validation"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos." };
  }

  const service = createSupabaseServiceClient();

  const { data: existing } = await service
    .from("boss_projects")
    .select("status")
    .eq("student_profile_id", studentProfile.id)
    .maybeSingle();

  if (existing && (existing.status === "submitted" || existing.status === "approved")) {
    return {
      error:
        existing.status === "approved"
          ? "Seu projeto final ja foi aprovado e nao pode ser editado."
          : "Seu projeto esta aguardando validacao e nao pode ser editado agora.",
    };
  }

  const { error } = await service.from("boss_projects").upsert(
    {
      student_profile_id: studentProfile.id,
      title: parsed.data.title,
      problem: parsed.data.problem,
      solution: parsed.data.solution,
      architecture: parsed.data.architecture,
      prototype: parsed.data.prototype,
      validation: parsed.data.validation,
    },
    { onConflict: "student_profile_id" },
  );

  if (error) {
    return { error: "Nao foi possivel salvar. Tente novamente." };
  }

  revalidatePath("/aluno/boss-final");
  return { saved: true };
}

/**
 * Envia o projeto final para validacao via RPC (valida completude e dono).
 */
export async function submitBossProjectAction(
  _prev: BossDraftFormState,
  _formData: FormData,
): Promise<BossDraftFormState> {
  const { studentProfile } = await requireStudentContext();
  const service = createSupabaseServiceClient();

  const { data: project } = await service
    .from("boss_projects")
    .select("id")
    .eq("student_profile_id", studentProfile.id)
    .maybeSingle();

  if (!project) {
    return { error: "Salve seu projeto antes de enviar." };
  }

  const { error } = await service.rpc("submit_boss_project", {
    p_project_id: (project as Pick<BossProjectRow, "id">).id,
    p_student_profile_id: studentProfile.id,
  });

  if (error) {
    const known = Object.keys(SUBMIT_ERRORS).find((key) =>
      error.message.includes(key),
    );
    return {
      error: known
        ? SUBMIT_ERRORS[known]
        : "Nao foi possivel enviar o projeto. Tente novamente.",
    };
  }

  redirect("/aluno/boss-final?enviado=1");
}

const reviewSchema = z.object({
  projectId: z.string().uuid("Projeto invalido."),
  decision: z.enum(["approved", "rejected"], {
    errorMap: () => ({ message: "Escolha aprovar ou reprovar." }),
  }),
  comment: z
    .string()
    .trim()
    .min(1, "O feedback e obrigatorio para aprovar ou reprovar."),
});

/** Avaliacao do projeto final pelo professor via RPC. */
export async function reviewBossProjectAction(
  _prev: BossReviewFormState,
  formData: FormData,
): Promise<BossReviewFormState> {
  const { teacherProfile } = await requireTeacherContext();

  const parsed = reviewSchema.safeParse({
    projectId: formData.get("projectId"),
    decision: formData.get("decision"),
    comment: formData.get("comment"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos." };
  }

  const { projectId, decision, comment } = parsed.data;
  const service = createSupabaseServiceClient();

  const { error } = await service.rpc("review_boss_project", {
    p_project_id: projectId,
    p_teacher_profile_id: teacherProfile.id,
    p_decision: decision,
    p_comment: comment,
  });

  if (error) {
    const known = Object.keys(REVIEW_ERRORS).find((key) =>
      error.message.includes(key),
    );
    return {
      error: known
        ? REVIEW_ERRORS[known]
        : "Nao foi possivel registrar a avaliacao. Tente novamente.",
    };
  }

  redirect("/professor/boss-final?avaliada=1");
}
