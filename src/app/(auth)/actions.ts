"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import { dashboardPathForRole } from "@/lib/auth/session";

export interface AuthFormState {
  error?: string;
  message?: string;
}

const signUpSchema = z.object({
  name: z.string().trim().min(2, "Informe seu nome completo."),
  email: z.string().trim().toLowerCase().email("Informe um e-mail valido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  role: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Escolha um perfil." }),
  }),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail valido."),
  password: z.string().min(1, "Informe sua senha."),
  redirectTo: z.string().optional(),
});

export async function signUpAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos." };
  }

  const { name, email, password, role } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name, role } },
  });

  if (error) {
    if (error.message.toLowerCase().includes("already registered")) {
      return { error: "Este e-mail ja esta cadastrado. Tente fazer login." };
    }
    return { error: "Nao foi possivel criar a conta. Tente novamente." };
  }

  const authUser = data.user;
  if (!authUser) {
    return { error: "Nao foi possivel criar a conta. Tente novamente." };
  }

  // Cria o usuario de aplicacao e o perfil correspondente (service role).
  const service = createSupabaseServiceClient();

  const { data: appUser, error: userError } = await service
    .from("users")
    .upsert(
      {
        auth_user_id: authUser.id,
        name,
        email,
        role,
        status: "active",
      },
      { onConflict: "auth_user_id" },
    )
    .select()
    .single();

  if (userError || !appUser) {
    return {
      error:
        "Conta criada, mas houve um erro ao montar seu perfil. Contate o suporte.",
    };
  }

  if (role === "student") {
    await service
      .from("student_profiles")
      .upsert({ user_id: appUser.id }, { onConflict: "user_id" });
  } else {
    await service
      .from("teacher_profiles")
      .upsert({ user_id: appUser.id }, { onConflict: "user_id" });
  }

  // Sem sessao => o projeto exige confirmacao de e-mail.
  if (!data.session) {
    return {
      message:
        "Conta criada! Confirme seu e-mail para acessar o portal. Depois faca login.",
    };
  }

  redirect(dashboardPathForRole(role));
}

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData,
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    redirectTo: formData.get("redirectTo") ?? undefined,
  });

  if (!parsed.success) {
    return { error: parsed.error.errors[0]?.message ?? "Dados invalidos." };
  }

  const { email, password, redirectTo } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { error: "E-mail ou senha invalidos." };
  }

  const service = createSupabaseServiceClient();
  const { data: appUser } = await service
    .from("users")
    .select("*")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (!appUser) {
    await supabase.auth.signOut();
    return { error: "Perfil nao encontrado. Contate o suporte." };
  }

  if (appUser.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Sua conta esta inativa. Contate o suporte." };
  }

  await service
    .from("users")
    .update({ last_login_at: new Date().toISOString() })
    .eq("id", appUser.id);

  const safeRedirect =
    redirectTo && redirectTo.startsWith("/") && !redirectTo.startsWith("//")
      ? redirectTo
      : dashboardPathForRole(appUser.role);

  redirect(safeRedirect);
}

export async function logoutAction(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
