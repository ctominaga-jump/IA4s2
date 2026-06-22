import Link from "next/link";
import { ClipboardCheck, ShieldCheck } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { StudentNav, type StudentNavItem } from "@/components/game/student-nav";

const NAV_ITEMS: StudentNavItem[] = [
  { href: "/professor", label: "Painel" },
  { href: "/professor/fila", label: "Validações" },
  { href: "/professor/boss-final", label: "Boss Final" },
];

/**
 * Shell premium da area do professor. Usa a mesma linguagem visual da area do
 * aluno, mas com tom operacional: fila, validação e mentoria em primeiro plano.
 */
export function TeacherGameShell({
  userName,
  children,
}: {
  userName: string;
  children: React.ReactNode;
}) {
  const firstName = userName.split(" ")[0] ?? userName;
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="theme-game relative flex min-h-screen flex-col bg-background text-foreground">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_12%_-8%,rgba(22,217,227,0.18),transparent_40%),radial-gradient(circle_at_88%_0%,rgba(255,200,87,0.12),transparent_38%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(244,247,251,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,251,0.035)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_50%_0%,black,transparent_75%)]"
      />

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/professor"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#16D9E3] to-warning text-[#070A12] shadow-[0_0_22px_rgba(22,217,227,0.35)]">
                <ClipboardCheck className="size-5" />
              </span>
              <span className="hidden sm:inline">IA para Vida Real</span>
            </Link>
            <StudentNav items={NAV_ITEMS} />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:inline-flex">
              <ShieldCheck className="size-3.5" />
              Mentor
            </span>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#16D9E3]/80 to-warning/80 text-sm font-bold text-[#070A12] shadow-[0_0_16px_rgba(255,200,87,0.28)]">
                {initial}
              </span>
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm font-medium">{firstName}</p>
                <p className="text-xs text-muted-foreground">
                  Professor validador
                </p>
              </div>
            </div>
            <LogoutButton />
          </div>
        </div>
      </header>

      <main className="container flex-1 py-6 md:py-8">{children}</main>
    </div>
  );
}
