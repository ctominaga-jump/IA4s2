import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  RotateCcw,
  Sparkles,
  User,
  Zap,
} from "lucide-react";
import type { ReactNode } from "react";

import { EvolvingAvatar } from "@/components/three/avatar/lazy-avatar";
import { PHASES } from "@/components/game/journey-phases";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import type { AvatarVariant } from "@/lib/database.types";
import type { MissionStatus } from "@/lib/domain";

export interface ProfileViewModel {
  name: string;
  email: string;
  avatarVariant: AvatarVariant;
  levelNumber: number;
  levelTitle: string;
  nextLevelTitle: string | null;
  totalXp: number;
  levelProgressPercent: number;
  xpForNext: number;
  currentPhaseIndex: number;
  approvedCount: number;
  totalMissions: number;
  approvedMissions: { id: string; title: string; xpReward: number }[];
  inProgressMissions: {
    id: string;
    title: string;
    status: Exclude<MissionStatus, "approved" | "not_started">;
  }[];
  /**
   * Liga o EvolvingAvatar 3D no hero de identidade. Resolvido pela page via
   * `avatar3dEnabledInApp()`; ausente/false mantém o AvatarFigure 2D de
   * mesma dimensão (rollback sem código).
   */
  avatar3d?: boolean;
}

export function ProfileView({
  vm,
  goalSlot,
  avatarPickerSlot,
}: {
  vm: ProfileViewModel;
  goalSlot: ReactNode;
  avatarPickerSlot: ReactNode;
}) {
  const pct = Math.min(100, Math.max(0, vm.levelProgressPercent));
  const phase = PHASES[vm.currentPhaseIndex] ?? PHASES[0];

  return (
    <div className="space-y-5">
      {/* Hero de identidade */}
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 md:p-6">
        <div className="pointer-events-none absolute -right-12 -top-16 size-52 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative flex flex-col items-center gap-5 sm:flex-row sm:items-center">
          {/* 3D (GLB + kit da fase); gate desligado => AvatarFigure 2D de
              mesma dimensão (sem CLS, sem chunk three.js). */}
          <EvolvingAvatar
            variant={vm.avatarVariant}
            levelNumber={vm.levelNumber}
            phaseIndex={vm.currentPhaseIndex}
            progressPercent={vm.levelProgressPercent}
            size="lg"
            forceFallback={!vm.avatar3d}
          />
          <div className="min-w-0 flex-1 text-center sm:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#16D9E3]/25 bg-[#16D9E3]/10 px-3 py-1 text-xs font-medium text-[#9CEBF0]">
              <Sparkles className="size-3.5" />
              Identidade do agente
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight md:text-3xl">
              {vm.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              Nível {vm.levelNumber} · {vm.levelTitle} · Fase {phase.name}
            </p>

            <div className="mt-4 max-w-md">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="tabular-nums">{vm.totalXp} XP</span>
                <span className="tabular-nums">{pct}%</span>
              </div>
              <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#16D9E3] to-success"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {vm.nextLevelTitle
                  ? `${vm.xpForNext} XP para ${vm.nextLevelTitle}.`
                  : "Nível máximo alcançado."}
              </p>
            </div>

            <div className="mt-4 flex flex-wrap justify-center gap-2 sm:justify-start">
              <StatChip label="XP total" value={vm.totalXp} />
              <StatChip
                label="Missões aprovadas"
                value={`${vm.approvedCount}/${vm.totalMissions}`}
              />
              <StatChip label="Fase atual" value={phase.name} />
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="space-y-5">
          {goalSlot}

          <section className="rounded-3xl border border-border bg-card/80 p-5">
            <h2 className="font-semibold">
              Missões aprovadas ({vm.approvedMissions.length})
            </h2>
            <div className="mt-3">
              {vm.approvedMissions.length === 0 ? (
                <EmptyState
                  icon={CheckCircle2}
                  title="Nenhuma missão aprovada ainda"
                  description="Conclua sua primeira missão para começar a somar XP."
                  className="px-4 py-8"
                  action={
                    <Link
                      href="/aluno/missoes"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      Ir para a jornada
                    </Link>
                  }
                />
              ) : (
                <ul className="space-y-2">
                  {vm.approvedMissions.map((m) => (
                    <li key={m.id}>
                      <Link
                        href={`/aluno/missoes/${m.id}`}
                        className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-3 text-sm transition-colors hover:border-primary/40"
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <CheckCircle2 className="size-4 text-success" />
                          {m.title}
                        </span>
                        <Badge variant="success">+{m.xpReward} XP</Badge>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {vm.inProgressMissions.length > 0 ? (
            <section className="rounded-3xl border border-border bg-card/80 p-5">
              <h2 className="font-semibold">Missões em andamento</h2>
              <ul className="mt-3 space-y-2">
                {vm.inProgressMissions.map((m) => (
                  <li key={m.id}>
                    <Link
                      href={`/aluno/missoes/${m.id}`}
                      className="flex items-center justify-between rounded-2xl border border-border bg-background/40 p-3 text-sm transition-colors hover:border-primary/40"
                    >
                      <span className="flex items-center gap-2 font-medium">
                        {m.status === "pending" ? (
                          <Clock className="size-4 text-warning" />
                        ) : (
                          <RotateCcw className="size-4 text-destructive" />
                        )}
                        {m.title}
                      </span>
                      <ArrowRight className="size-4 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <div className="space-y-5">
          <section className="rounded-3xl border border-border bg-card/80 p-5">
            {avatarPickerSlot}
          </section>

          <section className="rounded-3xl border border-border bg-card/80 p-5">
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              <h2 className="font-semibold">Dados do perfil</h2>
            </div>
            <div className="mt-3 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-muted-foreground">
                <User className="size-4" />
                {vm.name}
              </p>
              <p className="flex items-center gap-2 text-muted-foreground">
                <Mail className="size-4" />
                {vm.email}
              </p>
            </div>
            <div className="mt-4 flex items-start gap-2 rounded-2xl border border-border bg-background/40 p-3 text-xs text-muted-foreground">
              <Zap className="mt-0.5 size-3.5 shrink-0 text-warning" />
              Seu nível sobe automaticamente conforme você acumula XP em missões
              aprovadas. Cada missão concede XP uma única vez.
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 px-3 py-2 text-left">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-bold tabular-nums">{value}</p>
    </div>
  );
}
