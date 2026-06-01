import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseServiceClient } from "@/lib/supabase/service";
import type {
  StudentProfileRow,
  TeacherProfileRow,
  UserRow,
} from "@/lib/database.types";

export interface SessionUser {
  authUserId: string;
  appUser: UserRow;
}

/**
 * Identifica o usuario logado e carrega o usuario de aplicacao (tabela users).
 * Retorna null quando nao ha sessao valida ou quando o usuario de aplicacao
 * ainda nao existe / esta inativo.
 */
export async function getSessionUser(): Promise<SessionUser | null> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const service = createSupabaseServiceClient();
  const { data: appUser } = await service
    .from("users")
    .select("*")
    .eq("auth_user_id", user.id)
    .maybeSingle();

  if (!appUser || appUser.status !== "active") return null;

  return { authUserId: user.id, appUser };
}

export interface StudentContext extends SessionUser {
  studentProfile: StudentProfileRow;
}

/**
 * Garante que o usuario atual e um aluno ativo. Redireciona:
 * - para /login se nao autenticado;
 * - para /professor se for professor tentando acessar area do aluno.
 */
export async function requireStudentContext(): Promise<StudentContext> {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  if (session.appUser.role !== "student") redirect("/professor");

  const service = createSupabaseServiceClient();
  const { data: studentProfile } = await service
    .from("student_profiles")
    .select("*")
    .eq("user_id", session.appUser.id)
    .maybeSingle();

  if (!studentProfile) redirect("/login");

  return { ...session, studentProfile };
}

export interface TeacherContext extends SessionUser {
  teacherProfile: TeacherProfileRow;
}

/**
 * Garante que o usuario atual e um professor ativo. Redireciona:
 * - para /login se nao autenticado;
 * - para /aluno se for aluno tentando acessar area do professor.
 */
export async function requireTeacherContext(): Promise<TeacherContext> {
  const session = await getSessionUser();
  if (!session) redirect("/login");

  if (session.appUser.role !== "teacher") redirect("/aluno");

  const service = createSupabaseServiceClient();
  const { data: teacherProfile } = await service
    .from("teacher_profiles")
    .select("*")
    .eq("user_id", session.appUser.id)
    .maybeSingle();

  if (!teacherProfile) redirect("/login");

  return { ...session, teacherProfile };
}

/** Caminho do dashboard inicial conforme o perfil. */
export function dashboardPathForRole(role: UserRow["role"]): string {
  return role === "teacher" ? "/professor" : "/aluno";
}
