"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { requireStudentContext } from "@/lib/auth/session";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { getPublishedMissionById } from "@/server/content";
import type { SubmissionRow } from "@/lib/database.types";

export interface SubmissionFormState {
  error?: string;
}

const submitSchema = z.object({
  missionId: z.string().uuid("Missão invalida."),
  content: z
    .string()
    .trim()
    .min(1, "Escreva sua entrega antes de enviar."),
});

export async function submitMissionAction(
  _prev: SubmissionFormState,
  formData: FormData,
): Promise<SubmissionFormState> {
  const { studentProfile } = await requireStudentContext();

  const parsed = submitSchema.safeParse({
    missionId: formData.get("missionId"),
    content: formData.get("content"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  const { missionId, content } = parsed.data;

  const mission = await getPublishedMissionById(missionId);
  if (!mission) {
    return { error: "Missão não encontrada ou indisponível." };
  }

  const service = createSupabaseServiceClient();

  const { data: existing } = await service
    .from("submissions")
    .select("*")
    .eq("student_profile_id", studentProfile.id)
    .eq("mission_id", missionId);

  const subs = (existing ?? []) as SubmissionRow[];

  if (subs.some((s) => s.status === "approved")) {
    return { error: "Esta missão já foi aprovada e não aceita novo envio." };
  }
  if (subs.some((s) => s.status === "pending")) {
    return {
      error: "Você já tem uma entrega aguardando validação para esta missão.",
    };
  }

  const attemptNumber =
    subs.reduce((max, s) => Math.max(max, s.attempt_number), 0) + 1;

  const { error } = await service.from("submissions").insert({
    student_profile_id: studentProfile.id,
    mission_id: missionId,
    content: content,
    status: "pending",
    attempt_number: attemptNumber,
    submitted_at: new Date().toISOString(),
  });

  if (error) {
    // Conflito de indice único (entrega concorrente).
    if (error.code === "23505") {
      return {
        error: "Já existe uma entrega para esta missão. Atualize a página.",
      };
    }
    return { error: "Não foi possível enviar sua entrega. Tente novamente." };
  }

  redirect(`/aluno/missoes/${missionId}?enviada=1`);
}
