import { redirect } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import { requireStudentContext } from "@/lib/auth/session";
import { getAllLevels, resolveLevelProgress } from "@/server/student-data";

export const dynamic = "force-dynamic";

export default async function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appUser, studentProfile } = await requireStudentContext();

  // Aluno sem onboarding concluido vai direto para o onboarding.
  // (a propria rota de onboarding nao usa este layout)
  if (!studentProfile.onboarding_completed_at) {
    redirect("/onboarding");
  }

  const levels = await getAllLevels();
  const progress = resolveLevelProgress(studentProfile.total_xp, levels);
  const levelLabel = `Nv ${progress.current?.number ?? 1} · ${
    progress.current?.title ?? "Explorador"
  }`;

  return (
    <StudentGameShell
      userName={appUser.name}
      totalXp={studentProfile.total_xp}
      levelLabel={levelLabel}
    >
      {children}
    </StudentGameShell>
  );
}
