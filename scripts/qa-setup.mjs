// QA setup: cria uma conta de professor de teste (e-mail confirmado) e um
// projeto final SUBMETIDO para um aluno existente, para validacao visual das
// telas do professor. Idempotente. Uso: node scripts/qa-setup.mjs
import { readFileSync } from "node:fs";
import { createClient } from "@supabase/supabase-js";

// Carrega .env.local manualmente (Node nao faz isso sozinho).
const env = Object.fromEntries(
  readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => {
      const i = l.indexOf("=");
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    }),
);

const url = env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = env.SUPABASE_SERVICE_ROLE_KEY;
const admin = createClient(url, serviceKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

const TEACHER = {
  email: "qa.professor.boss@example.com",
  password: "QaProfessor!2026",
  name: "Professora QA",
};

// 1) Cria (ou reaproveita) o usuario de auth, com e-mail confirmado.
let authUserId;
{
  const { data, error } = await admin.auth.admin.createUser({
    email: TEACHER.email,
    password: TEACHER.password,
    email_confirm: true,
    user_metadata: { name: TEACHER.name, role: "teacher" },
  });
  if (error && !String(error.message).toLowerCase().includes("already")) {
    throw error;
  }
  if (data?.user) {
    authUserId = data.user.id;
  } else {
    // Ja existe: localiza pelo e-mail.
    const { data: list } = await admin.auth.admin.listUsers();
    authUserId = list.users.find((u) => u.email === TEACHER.email)?.id;
  }
}
if (!authUserId) throw new Error("nao consegui obter o auth user id");

// 2) users + teacher_profiles (espelha signUpAction).
const { data: appUser } = await admin
  .from("users")
  .upsert(
    {
      auth_user_id: authUserId,
      name: TEACHER.name,
      email: TEACHER.email,
      role: "teacher",
      status: "active",
    },
    { onConflict: "auth_user_id" },
  )
  .select()
  .single();

await admin
  .from("teacher_profiles")
  .upsert({ user_id: appUser.id }, { onConflict: "user_id" });

// 3) Projeto final SUBMETIDO para um aluno existente.
const { data: student } = await admin
  .from("student_profiles")
  .select("id")
  .limit(1)
  .single();

const FILLED = {
  title: "Atende Facil — assistente de respostas para pequenos negocios",
  problem:
    "Pequenos comerciantes perdem horas respondendo as mesmas duvidas no WhatsApp (horario, preco, entrega) e demoram a responder novos clientes.",
  solution:
    "Um assistente que responde as duvidas frequentes a partir de um roteiro aprovado pelo dono, sempre deixando a decisao final com ele.",
  architecture:
    "Cliente pergunta -> o assistente busca no roteiro -> a IA redige a resposta no tom do negocio -> o dono aprova antes de enviar.",
  prototype:
    "Criei o prompt-modelo e testei com 5 perguntas reais. Cole do prompt: 'Responda como o dono da loja X, tom simpatico e curto...'.",
  validation:
    "Mostrei para 3 comerciantes: 2 usariam hoje, 1 pediu suporte a audio. Proximo passo: integrar a uma planilha de respostas.",
};

await admin.from("boss_projects").upsert(
  {
    student_profile_id: student.id,
    ...FILLED,
    status: "submitted",
    submitted_at: new Date().toISOString(),
    feedback: null,
    reviewed_at: null,
    reviewer_teacher_profile_id: null,
  },
  { onConflict: "student_profile_id" },
);

const { data: project } = await admin
  .from("boss_projects")
  .select("id, status")
  .eq("student_profile_id", student.id)
  .single();

console.log(
  JSON.stringify(
    {
      teacherEmail: TEACHER.email,
      teacherPassword: TEACHER.password,
      projectId: project.id,
      projectStatus: project.status,
    },
    null,
    2,
  ),
);
