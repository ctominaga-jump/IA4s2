import { TeacherGameShell } from "@/components/game/teacher-game-shell";
import { requireTeacherContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appUser } = await requireTeacherContext();

  return (
    <TeacherGameShell userName={appUser.name}>
      {children}
    </TeacherGameShell>
  );
}
