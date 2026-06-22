import Link from "next/link";
import { Cpu, Zap } from "lucide-react";

import { LogoutButton } from "@/components/logout-button";
import { StudentNav, type StudentNavItem } from "@/components/game/student-nav";

const NAV_ITEMS: StudentNavItem[] = [
  { href: "/aluno", label: "Cockpit" },
  { href: "/aluno/missoes", label: "Jornada" },
  { href: "/aluno/boss-final", label: "Boss Final" },
  { href: "/aluno/perfil", label: "Meu progresso" },
];

/**
 * Shell premium escuro da area do aluno. Fornece o canvas ambiente (glow + grid),
 * o header e aplica o tema `.theme-game`, integrando visualmente todas as telas
 * do aluno (cockpit, jornada e progresso) sem alterar dados ou regras.
 */
export function StudentGameShell({
  userName,
  totalXp,
  levelLabel,
  navItems = NAV_ITEMS,
  children,
}: {
  userName: string;
  totalXp: number;
  levelLabel: string;
  navItems?: StudentNavItem[];
  children: React.ReactNode;
}) {
  const firstName = userName.split(" ")[0] ?? userName;
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <div className="theme-game relative flex min-h-screen flex-col bg-background text-foreground">
      {/* Canvas ambiente: glow controlado + grid sútil de laboratorio */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_15%_-5%,rgba(109,93,247,0.22),transparent_42%),radial-gradient(circle_at_88%_0%,rgba(22,217,227,0.16),transparent_40%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[linear-gradient(rgba(244,247,251,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,251,0.035)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(circle_at_50%_0%,black,transparent_75%)]"
      />

      <header className="sticky top-0 z-20 border-b border-border/70 bg-background/70 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <Link
              href="/aluno"
              className="flex items-center gap-2.5 font-semibold tracking-tight"
            >
              <span className="relative flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-[#16D9E3] text-white shadow-[0_0_22px_rgba(109,93,247,0.55)]">
                <Cpu className="size-5" />
              </span>
              <span className="hidden sm:inline">IA para Vida Real</span>
            </Link>
            <StudentNav items={navItems} />
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-semibold tabular-nums text-warning sm:inline-flex">
              <Zap className="size-3.5" />
              {totalXp} XP
            </span>
            <div className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-primary/80 to-[#16D9E3]/70 text-sm font-bold text-white shadow-[0_0_16px_rgba(22,217,227,0.35)]">
                {initial}
              </span>
              <div className="hidden text-right leading-tight sm:block">
                <p className="text-sm font-medium">{firstName}</p>
                <p className="text-xs text-muted-foreground">{levelLabel}</p>
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
