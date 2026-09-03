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
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  password: z.string().min(6, "A senha deve ter ao menos 6 caracteres."),
  role: z.enum(["student", "teacher"], {
    errorMap: () => ({ message: "Escolha um perfil." }),
  }),
});

const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido."),
  password: z.string().min(1, "Informe sua senha."),
  redirectTo: z.string().optional(),
});

/**
 * Traduz um erro do Supabase Auth em mensagem para o usuário.
 *
 * Só devolve "e-mail ou senha inválidos" quando a credencial foi de fato
 * rejeitada. Falhas de rede/configuracao (projeto fora do ar, URL ou chave
 * erradas) ganham mensagem propria — antes elas apareciam como senha
 * incorreta e mandavam o usuário caçar o problema no lugar errado.
 */
function describeAuthError(error: {
  message: string;
  code?: string;
  status?: number;
  name?: string;
}): string {
  const code = error.code ?? "";
  const message = error.message.toLowerCase();

  if (code === "invalid_credentials" || message.includes("invalid login")) {
    return "E-mail ou senha inválidos.";
  }

  if (code === "email_not_confirmed" || message.includes("not confirmed")) {
    return "Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.";
  }

  if (code === "over_request_rate_limit" || error.status === 429) {
    return "Muitas tentativas seguidas. Aguarde alguns instantes e tente de novo.";
  }

  if (
    error.name === "AuthRetryableFetchError" ||
    !error.status ||
    error.status >= 500 ||
    message.includes("fetch failed")
  ) {
    // Não é credencial: o servidor não conseguiu falar com o Supabase.
    console.error("[auth] falha ao contatar o Supabase:", error);
    return "Não foi possível contatar o serviço de autenticação. Tente novamente em instantes.";
  }

  console.error("[auth] erro inesperado no login:", error);
  return "Não foi possível entrar agora. Tente novamente.";
}

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
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
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
      return { error: "Este e-mail já está cadastrado. Tente fazer login." };
    }
    return { error: describeAuthError(error) };
  }

  const authUser = data.user;
  if (!authUser) {
    return { error: "Não foi possível criar a conta. Tente novamente." };
  }

  // Cria o usuário de aplicação e o perfil correspondente (service role).
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

  // Sem sessão => o projeto exige confirmacao de e-mail.
  if (!data.session) {
    return {
      message:
        "Conta criada! Confirme seu e-mail para acessar o portal. Depois faça login.",
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
    return { error: parsed.error.errors[0]?.message ?? "Dados inválidos." };
  }

  const { email, password, redirectTo } = parsed.data;
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: describeAuthError(error) };
  }

  if (!data.user) {
    return { error: "E-mail ou senha inválidos." };
  }

  const service = createSupabaseServiceClient();
  const { data: appUser } = await service
    .from("users")
    .select("*")
    .eq("auth_user_id", data.user.id)
    .maybeSingle();

  if (!appUser) {
    await supabase.auth.signOut();
    return { error: "Perfil não encontrado. Contate o suporte." };
  }

  if (appUser.status !== "active") {
    await supabase.auth.signOut();
    return { error: "Sua conta está inativa. Contate o suporte." };
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
