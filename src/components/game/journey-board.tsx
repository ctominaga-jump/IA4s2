import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Crown,
  Lock,
  Sparkles,
  Target,
  Timer,
  Zap,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { HoverLift, MotionBar } from "@/components/motion";
import { MissionStatusBadge } from "@/components/status-badge";
import { cn } from "@/lib/utils";
import {
  MISSION_DIFFICULTY_LABEL,
  MISSION_DIFFICULTY_VARIANT,
  type MissionStatus,
} from "@/lib/domain";
import type { MissionDifficulty } from "@/lib/database.types";
import type { PhaseState } from "@/lib/journey";

export interface JourneyMissionVM {
  id: string;
  title: string;
  description: string;
  status: MissionStatus;
  xpReward: number;
  difficulty: MissionDifficulty;
  estimatedMinutes: number;
}

export interface JourneyPhaseVM {
  number: number;
  name: string;
  tagline: string;
  state: PhaseState;
  total: number;
  approved: number;
  percent: number;
  isBoss: boolean;
  missions: JourneyMissionVM[];
}

export interface JourneyBoardViewModel {
  courseTitle: string;
  courseDescription: string | null;
  goalTitle: string | null;
  overallApproved: number;
  overallTotal: number;
  overallPercent: number;
  phases: JourneyPhaseVM[];
}

const STATE_LABEL: Record<PhaseState, string> = {
  complete: "Concluida",
  active: "Em andamento",
  locked: "Bloqueada",
  empty: "Em breve",
};

const STATE_VARIANT: Record<PhaseState, "success" | "warning" | "muted"> = {
  complete: "success",
  active: "warning",
  locked: "muted",
  empty: "muted",
};

export function JourneyBoard(vm: JourneyBoardViewModel) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 md:p-6">
        <div className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-primary/15 blur-3xl" />
        <div className="relative">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#16D9E3]/25 bg-[#16D9E3]/10 px-3 py-1 text-xs font-medium text-[#9CEBF0]">
            <Sparkles className="size-3.5" />
            Mapa da jornada
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            {vm.courseTitle}
          </h1>
          {vm.courseDescription ? (
            <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
              {vm.courseDescription}
            </p>
          ) : null}

          {vm.goalTitle ? (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-background/50 px-3 py-1.5 text-sm">
              <Target className="size-4 shrink-0 text-primary" />
              <span className="text-muted-foreground">
                Seu objetivo:{" "}
                <span className="font-medium text-foreground">
                  {vm.goalTitle}
                </span>
              </span>
            </div>
          ) : null}

          <div className="mt-5">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Progresso geral</span>
              <span className="tabular-nums">
                {vm.overallApproved}/{vm.overallTotal} missoes ·{" "}
                {vm.overallPercent}%
              </span>
            </div>
            <MotionBar
              pct={vm.overallPercent}
              className="h-2.5 w-full overflow-hidden rounded-full bg-white/10"
              barClassName="rounded-full bg-gradient-to-r from-primary via-[#16D9E3] to-success"
            />
          </div>
        </div>
      </header>

      <ol className="space-y-4">
        {vm.phases.map((phase, index) => (
          <PhaseStation
            key={phase.number}
            phase={phase}
            isLast={index === vm.phases.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}

function PhaseStation({
  phase,
  isLast,
}: {
  phase: JourneyPhaseVM;
  isLast: boolean;
}) {
  const complete = phase.state === "complete";
  const active = phase.state === "active";

  const NodeIcon = complete
    ? CheckCircle2
    : phase.isBoss
      ? Crown
      : phase.state === "locked" || phase.state === "empty"
        ? Lock
        : Sparkles;

  return (
    <li className="relative flex gap-4">
      {/* Trilho vertical + no da fase */}
      <div className="flex flex-col items-center">
        <span
          className={cn(
            "z-10 flex size-11 items-center justify-center rounded-full border text-sm font-bold tabular-nums",
            active
              ? "border-primary/60 bg-primary/20 text-foreground shadow-[0_0_22px_rgba(109,93,247,0.5)]"
              : complete
                ? "border-success/50 bg-success/15 text-success"
                : phase.isBoss
                  ? "border-warning/45 bg-warning/10 text-warning"
                  : "border-border bg-background/60 text-muted-foreground",
          )}
        >
          {complete || phase.isBoss || phase.state === "locked" ? (
            <NodeIcon className="size-5" />
          ) : (
            phase.number
          )}
        </span>
        {!isLast ? (
          <span
            className={cn(
              "mt-1 w-0.5 flex-1 rounded-full",
              complete ? "bg-success/40" : "bg-border",
            )}
          />
        ) : null}
      </div>

      {/* Conteudo da fase */}
      <div
        className={cn(
          "mb-2 flex-1 rounded-3xl border bg-card/80 p-5",
          active ? "border-primary/30" : "border-border",
        )}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Fase {phase.number}
              </p>
              <Badge variant={STATE_VARIANT[phase.state]}>
                {STATE_LABEL[phase.state]}
              </Badge>
            </div>
            <h2 className="mt-1 text-lg font-bold">{phase.name}</h2>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {phase.tagline}
            </p>
          </div>
          {phase.total > 0 ? (
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums">
                {phase.approved}/{phase.total}
              </p>
              <p className="text-[11px] text-muted-foreground">aprovadas</p>
            </div>
          ) : null}
        </div>

        {phase.total > 0 ? (
          <ul className="mt-4 space-y-2.5">
            {phase.missions.map((mission) => (
              <MissionNode key={mission.id} mission={mission} />
            ))}
          </ul>
        ) : phase.isBoss ? (
          <Link
            href="/aluno/boss-final"
            className="group mt-4 flex items-center gap-3 rounded-2xl border border-warning/30 bg-warning/5 px-4 py-4 text-sm transition-colors hover:border-warning/60 hover:bg-warning/10"
          >
            <Crown className="size-5 shrink-0 text-warning" />
            <span className="min-w-0 flex-1 text-muted-foreground">
              O grande desafio: transforme a jornada em um produto com IA.{" "}
              <span className="font-medium text-foreground">
                Abrir o Boss Final
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-warning transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <div className="mt-4 flex items-center gap-2 rounded-2xl border border-dashed border-border bg-background/30 px-4 py-4 text-sm text-muted-foreground">
            <Lock className="size-4 shrink-0" />
            Novas missoes desta fase chegam em breve.
          </div>
        )}
      </div>
    </li>
  );
}

function MissionNode({ mission }: { mission: JourneyMissionVM }) {
  return (
    <li>
      <HoverLift>
      <Link
        href={`/aluno/missoes/${mission.id}`}
        className="group flex items-center gap-3 rounded-2xl border border-border bg-background/40 p-3.5 transition-colors hover:border-primary/40 hover:bg-primary/5"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-medium">{mission.title}</p>
            <MissionStatusBadge status={mission.status} />
          </div>
          <p className="mt-1 line-clamp-1 text-sm text-muted-foreground">
            {mission.description}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <Badge variant={MISSION_DIFFICULTY_VARIANT[mission.difficulty]}>
              {MISSION_DIFFICULTY_LABEL[mission.difficulty]}
            </Badge>
            <span className="inline-flex items-center gap-1">
              <Timer className="size-3" />
              {mission.estimatedMinutes} min
            </span>
            <span className="inline-flex items-center gap-1 font-medium text-warning">
              <Zap className="size-3" />+{mission.xpReward} XP
            </span>
          </div>
        </div>
        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </Link>
      </HoverLift>
    </li>
  );
}
