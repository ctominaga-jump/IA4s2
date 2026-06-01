import { AppShell } from "@/components/app-shell";
import { requireTeacherContext } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { appUser } = await requireTeacherContext();

  return (
    <AppShell
      userName={appUser.name}
      roleLabel="Professor"
      homeHref="/professor"
      navItems={[
        { href: "/professor", label: "Inicio" },
        { href: "/professor/fila", label: "Fila de validacao" },
        { href: "/professor/boss-final", label: "Projetos finais" },
      ]}
    >
      {children}
    </AppShell>
  );
}
