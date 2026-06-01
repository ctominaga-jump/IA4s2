"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";

import { requireStudentContext } from "@/lib/auth/session";
import { createSupabaseServiceClient } from "@/lib/supabase/service";

export interface AvatarFormState {
  error?: string;
  success?: boolean;
}

const avatarSchema = z.object({
  variant: z.enum(["aurora", "ember", "verdant", "nebula"]),
});

/**
 * Atualiza a variante cosmetica do avatar do aluno. Apenas customizacao
 * visual: nao toca XP, nivel, missoes nem fluxo de submissao/review.
 */
export async function updateAvatarVariantAction(
  _prev: AvatarFormState,
  formData: FormData,
): Promise<AvatarFormState> {
  const { studentProfile } = await requireStudentContext();

  const parsed = avatarSchema.safeParse({ variant: formData.get("variant") });
  if (!parsed.success) {
    return { error: "Variante de avatar invalida." };
  }

  const service = createSupabaseServiceClient();
  const { error } = await service
    .from("student_profiles")
    .update({ avatar_variant: parsed.data.variant })
    .eq("id", studentProfile.id);

  if (error) {
    return { error: "Nao foi possivel atualizar seu avatar. Tente novamente." };
  }

  revalidatePath("/aluno");
  revalidatePath("/aluno/perfil");
  return { success: true };
}
