"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireStudentContext } from "@/lib/auth/session";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export interface GoalFormState {
  error?: string;
  success?: boolean;
}

const goalSchema = z.object({
  title: z.string().trim().min(3, "Descreva seu objetivo em uma frase."),
  description: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => (v && v.length > 0 ? v : null)),
  category: z
    .enum([
      "study",
      "career",
      "business",
      "creation",
      "productivity",
      "personal",
      "other",
    ])
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

const onboardingSchema = goalSchema.extend({
  declared_level: z
    .enum(["beginner", "basic", "intermediate"])
    .optional()
    .or(z.literal("").transform(() => undefined)),
});

export async function completeOnboardingAction(
  _prev: GoalFormState,
  formData: FormData,
): Promise<GoalFormState> {
  const { studentProfile } = await requireStudentContext();

  const parsed = onboardingSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    category: formData.get("category") ?? undefined,
    declared_level: formData.get("declared_level") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  const service = createSupabaseServiceClient();

  const { data: goal, error: goalError } = await service
    .from("learning_goals")
    .insert({
      student_profile_id: studentProfile.id,
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category ?? null,
      status: "active",
    })
    .select()
    .single();

  if (goalError || !goal) {
    return { error: "Não foi possível salvar seu objetivo. Tente novamente." };
  }

  const { error: profileError } = await service
    .from("student_profiles")
    .update({
      active_learning_goal_id: goal.id,
      declared_level: parsed.data.declared_level ?? null,
      onboarding_completed_at: new Date().toISOString(),
    })
    .eq("id", studentProfile.id);

  if (profileError) {
    return { error: "Não foi possível concluir o onboarding. Tente novamente." };
  }

  redirect("/aluno");
}

export async function updateGoalAction(
  _prev: GoalFormState,
  formData: FormData,
): Promise<GoalFormState> {
  const { studentProfile } = await requireStudentContext();

  const parsed = goalSchema.safeParse({
    title: formData.get("title"),
    description: formData.get("description") ?? undefined,
    category: formData.get("category") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  if (!studentProfile.active_learning_goal_id) {
    return { error: "Nenhum objetivo ativo para editar." };
  }

  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("learning_goals")
    .update({
      title: parsed.data.title,
      description: parsed.data.description ?? null,
      category: parsed.data.category ?? null,
    })
    .eq("id", studentProfile.active_learning_goal_id)
    .eq("student_profile_id", studentProfile.id);

  if (error) {
    return { error: "Não foi possível atualizar o objetivo." };
  }

  revalidatePath("/aluno");
  revalidatePath("/aluno/perfil");
  return { success: true };
}
