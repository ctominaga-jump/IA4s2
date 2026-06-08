import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Compass,
  Crown,
  Lock,
  MessageSquareText,
  Radio,
  RotateCcw,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/empty-state";
import { Appear, MotionBar } from "@/components/motion";
import { AvatarTrophyTag } from "@/components/game/avatar-figure";
import { EvolvingAvatar } from "@/components/three/avatar/lazy-avatar";
import { LevelUpCelebration } from "@/components/game/level-up-celebration";
import { PHASES, type PhaseMeta } from "@/components/game/journey-phases";
import { cn } from "@/lib/utils";
import type { MissionStatus } from "@/lib/domain";
import type { AvatarVariant } from "@/lib/database.types";

export interface CockpitViewModel {
  firstName: string;
  totalXp: number;
  levelNumber: number;
  levelTitle: string;
  nextLevelTitle: string | null;
  levelProgressPercent: number;
  xpForNext: number;
  avatarVariant: AvatarVariant;
  approvedCount: number;
  totalMissions: number;
  overallPercent: number;
  currentPhaseIndex: number;
  counts: Record<MissionStatus, number>;
  nextMission: {
    id: string;
    title: string;
    description: string;
    xpReward: number;
    status: MissionStatus;
  } | null;
  allDone: boolean;
  recentFeedback: {
    id: string;
    missionId: string;
    missionTitle: string;
    approved: boolean;
    comment: string;
    createdAt: string;
  }[];
  goal: {
    title: string;
    description: string | null;
    categoryLabel: string | null;
  } | null;
  /**
   * Liga o EvolvingAvatar 3D no painel "Seu agente". Resolvido pela page via
   * `avatar3dEnabledInApp()` (gate `ENABLE_3D_AVATAR_IN_APP`); ausente/false
   * mantém o AvatarFigure 2D de mesma dimensão (rollback sem código).
   */
  avatar3d?: boolean;
}

export function StudentCockpit(vm: CockpitViewModel) {
  return (
    <div className="space-y-5">
      <LevelUpCelebration
        currentLevelNumber={vm.levelNumber}
        levelTitle={vm.levelTitle}
      />
      <Appear>
        <HeroStrip vm={vm} />
      </Appear>

      <Appear delay={0.08} className="grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
        <AvatarPanel vm={vm} />
        <div className="space-y-5">
          <NextQuestPanel vm={vm} />
          <JourneyMap currentPhaseIndex={vm.currentPhaseIndex} />
        </div>
      </Appear>

      <Appear delay={0.16} className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_350px]">
        <div className="space-y-5">
          <GoalContract goal={vm.goal} />
          <MissionStatusPanel vm={vm} />
        </div>
        <MentorTransmissions feedback={vm.recentFeedback} />
      </Appear>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Hero compacto: saudacao + metricas em uma faixa de baixa altura.    */
/* ------------------------------------------------------------------ */
function HeroStrip({ vm }: { vm: CockpitViewModel }) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card/80 p-5 md:p-6">
      <div className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-primary/15 blur-3xl" />
      <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#16D9E3]/25 bg-[#16D9E3]/10 px-3 py-1 text-xs font-medium text-[#9CEBF0]">
            <Sparkles className="size-3.5" />
            Cockpit de evolucao em IA
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
            Ola, {vm.firstName}. Sua jornada esta ativa.
          </h1>
          <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
            Avance pelas fases, acumule XP e prepare seu caminho ate o Boss
            Final: criar um produto com IA.
          </p>
        </div>

        <div className="grid shrink-0 grid-cols-3 gap-2.5 md:w-[360px]">
          <HeroMetric
            label="XP total"
            value={vm.totalXp}
            detail={`Nivel ${vm.levelNumber}`}
          />
          <HeroMetric
            label="Missoes"
            value={`${vm.approvedCount}/${vm.totalMissions}`}
            detail={`${vm.overallPercent}% feito`}
          />
          <HeroMetric
            label="Fase"
            value={PHASES[vm.currentPhaseIndex]?.name ?? "Despertar"}
            detail={vm.levelTitle}
            compact
          />
        </div>
      </div>
    </section>
  );
}

function HeroMetric({
  label,
  value,
  detail,
  compact,
}: {
  label: string;
  value: string | number;
  detail: string;
  compact?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background/40 p-3">
      <p className="text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1.5 font-bold tabular-nums text-foreground",
          compact ? "text-base leading-tight" : "text-xl",
        )}
      >
        {value}
      </p>
      <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
        {detail}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar como identidade: anel de progresso + aura + nivel/classe.    */
/* ------------------------------------------------------------------ */
function AvatarPanel({ vm }: { vm: CockpitViewModel }) {
  const pct = Math.min(100, Math.max(0, vm.levelProgressPercent));
  const phase = PHASES[vm.currentPhaseIndex] ?? PHASES[0];

  return (
    <section className="flex flex-col rounded-3xl border border-border bg-card/80 p-5">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9CEBF0]">
          Seu agente
        </p>
        <AvatarTrophyTag levelNumber={vm.levelNumber} />
      </div>

      <div className="mx-auto mt-5">
        {/* 3D (GLB da identidade + Evolution Kit da fase) com envelope
            validado: dynamic ssr:false + mount-on-visible + ErrorBoundary.
            `forceFallback` (gate desligado) mantém o AvatarFigure 2D de
            MESMA dimensão — sem CLS e sem baixar o chunk three.js. */}
        <EvolvingAvatar
          variant={vm.avatarVariant}
          levelNumber={vm.levelNumber}
          phaseIndex={vm.currentPhaseIndex}
          progressPercent={vm.levelProgressPercent}
          size="md"
          forceFallback={!vm.avatar3d}
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-sm font-semibold text-foreground">{vm.levelTitle}</p>
        <p className="text-xs text-muted-foreground">Fase: {phase.name}</p>
      </div>

      <div className="mt-4 rounded-2xl border border-border bg-background/40 p-3">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span className="tabular-nums">{vm.totalXp} XP</span>
          <span className="tabular-nums">{pct}%</span>
        </div>
        <MotionBar
          pct={pct}
          className="mt-2 h-2 overflow-hidden rounded-full bg-white/10"
          barClassName="rounded-full bg-gradient-to-r from-[#16D9E3] to-success"
        />
        <p className="mt-2 text-[11px] leading-4 text-muted-foreground">
          {vm.nextLevelTitle
            ? `${vm.xpForNext} XP para ${vm.nextLevelTitle}.`
            : "Nivel maximo. Continue refinando suas habilidades."}
        </p>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Missao ativa: quest principal em destaque.                          */
/* ------------------------------------------------------------------ */
function NextQuestPanel({ vm }: { vm: CockpitViewModel }) {
  const { nextMission, allDone } = vm;
  const href = nextMission
    ? `/aluno/missoes/${nextMission.id}`
    : "/aluno/missoes";

  const heading = nextMission
    ? nextMission.status === "rejected"
      ? `Revisar: ${nextMission.title}`
      : nextMission.title
    : allDone
      ? "Todas as missoes disponiveis foram concluidas"
      : "Acompanhe suas entregas em validacao";

  const body = nextMission
    ? nextMission.description
    : allDone
      ? "Excelente. O proximo passo e preparar desafios avancados e o Boss Final."
      : "Quando uma entrega for avaliada, a proxima acao aparece aqui.";

  return (
    <section className="relative overflow-hidden rounded-3xl border border-primary/25 bg-gradient-to-br from-primary/[0.14] via-card/80 to-card/80 p-5 md:p-6">
      <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-primary/20 blur-3xl" />
      <div className="relative flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="min-w-0">
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#9CEBF0]">
            <Radio className="size-3.5" />
            Missao ativa
          </span>
          <h2 className="mt-2.5 text-xl font-bold leading-tight md:text-2xl">
            {heading}
          </h2>
          <p className="mt-2 line-clamp-2 max-w-xl text-sm leading-6 text-muted-foreground">
            {body}
          </p>
          {nextMission ? (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-warning/30 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
              <Zap className="size-3.5" />+{nextMission.xpReward} XP na
              aprovacao
            </div>
          ) : null}
        </div>
        <Button
          asChild
          size="lg"
          className="shrink-0 shadow-[0_0_24px_rgba(109,93,247,0.4)]"
        >
          <Link href={href}>
            {nextMission ? "Abrir missao" : "Ver jornada"}
            <ArrowRight />
          </Link>
        </Button>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Mapa da jornada: trilho conectado com nos por fase.                 */
/* ------------------------------------------------------------------ */
function JourneyMap({ currentPhaseIndex }: { currentPhaseIndex: number }) {
  const lastIndex = PHASES.length - 1;
  const railPercent =
    lastIndex > 0 ? (currentPhaseIndex / lastIndex) * 100 : 0;

  return (
    <section className="rounded-3xl border border-border bg-card/80 p-5 md:p-6">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#9CEBF0]">
            Mapa da jornada
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Oito fases do Despertar ao Boss Final.
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/aluno/missoes">
            Ver jornada <ArrowRight />
          </Link>
        </Button>
      </div>

      {/* Desktop: trilho horizontal */}
      <div className="relative hidden px-1 md:block">
        <div className="absolute inset-x-5 top-6 -translate-y-1/2">
          <div className="h-0.5 w-full rounded-full bg-border" />
          <div
            className="absolute inset-y-0 left-0 h-0.5 rounded-full bg-gradient-to-r from-success via-[#16D9E3] to-primary"
            style={{ width: `${railPercent}%` }}
          />
        </div>
        <ol className="relative flex items-start justify-between">
          {PHASES.map((phase, index) => (
            <PhaseNode
              key={phase.name}
              phase={phase}
              index={index}
              currentPhaseIndex={currentPhaseIndex}
              isBoss={index === lastIndex}
              orientation="horizontal"
            />
          ))}
        </ol>
      </div>

      {/* Mobile: trilho vertical acessivel */}
      <ol className="relative space-y-2 md:hidden">
        {PHASES.map((phase, index) => (
          <PhaseNode
            key={phase.name}
            phase={phase}
            index={index}
            currentPhaseIndex={currentPhaseIndex}
            isBoss={index === lastIndex}
            orientation="vertical"
          />
        ))}
      </ol>
    </section>
  );
}

function PhaseNode({
  phase,
  index,
  currentPhaseIndex,
  isBoss,
  orientation,
}: {
  phase: PhaseMeta;
  index: number;
  currentPhaseIndex: number;
  isBoss: boolean;
  orientation: "horizontal" | "vertical";
}) {
  const complete = index < currentPhaseIndex;
  const active = index === currentPhaseIndex;
  const Icon = complete ? CheckCircle2 : active ? phase.icon : isBoss ? Crown : Lock;

  const circle = (
    <span
      className={cn(
        "z-10 flex items-center justify-center rounded-full border transition-colors",
        orientation === "horizontal" ? "size-12" : "size-10 shrink-0",
        active
          ? "border-primary/60 bg-primary/20 text-foreground shadow-[0_0_22px_rgba(109,93,247,0.5)]"
          : complete
            ? "border-success/50 bg-success/15 text-success"
            : isBoss
              ? "border-warning/40 bg-warning/10 text-warning"
              : "border-border bg-background/60 text-muted-foreground",
      )}
    >
      <Icon className="size-5" />
    </span>
  );

  if (orientation === "vertical") {
    return (
      <li className="flex items-center gap-3 rounded-2xl border border-border bg-background/30 px-3 py-2">
        {circle}
        <div className="min-w-0">
          <p
            className={cn(
              "text-sm font-medium",
              active ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {phase.name}
          </p>
          <p className="text-[11px] text-muted-foreground">
            {complete
              ? "Concluida"
              : active
                ? "Em andamento"
                : isBoss
                  ? "Climax final"
                  : "Bloqueada"}
          </p>
        </div>
        <span className="ml-auto text-xs font-semibold tabular-nums text-muted-foreground">
          0{index + 1}
        </span>
      </li>
    );
  }

  return (
    <li className="flex w-14 flex-col items-center gap-2 text-center">
      {circle}
      <span
        className={cn(
          "text-[11px] font-medium leading-tight",
          active
            ? "text-foreground"
            : complete
              ? "text-success/90"
              : "text-muted-foreground",
        )}
      >
        {phase.name}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Contrato da jornada: objetivo real (leitura).                       */
/* ------------------------------------------------------------------ */
function GoalContract({ goal }: { goal: CockpitViewModel["goal"] }) {
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-5">
      <div className="flex items-center gap-2">
        <Target className="size-4 text-primary" />
        <h2 className="font-semibold">Contrato da jornada</h2>
      </div>
      {goal ? (
        <div className="mt-3 rounded-2xl border border-border bg-background/40 p-4">
          <p className="text-base font-medium text-foreground">{goal.title}</p>
          {goal.description ? (
            <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
              {goal.description}
            </p>
          ) : null}
          <div className="mt-3 flex items-center justify-between gap-3">
            {goal.categoryLabel ? (
              <span className="rounded-full border border-border bg-secondary px-2.5 py-0.5 text-xs font-medium text-secondary-foreground">
                {goal.categoryLabel}
              </span>
            ) : (
              <span />
            )}
            <Link
              href="/aluno/perfil"
              className="text-xs font-medium text-primary hover:underline"
            >
              Editar no perfil
            </Link>
          </div>
        </div>
      ) : (
        <p className="mt-3 text-sm text-muted-foreground">
          Voce ainda nao registrou um objetivo. Defina o que quer alcancar para
          dar contexto a cada missao.
        </p>
      )}
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* Status das missoes: barra de progresso + contagens.                 */
/* ------------------------------------------------------------------ */
function MissionStatusPanel({ vm }: { vm: CockpitViewModel }) {
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-5">
      <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="size-4 text-primary" />
            <h2 className="font-semibold">Status das missoes</h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            O loop principal: executar, enviar, validar e evoluir.
          </p>
        </div>
      </div>

      <MotionBar
        pct={vm.overallPercent}
        className="mb-5 h-2.5 w-full overflow-hidden rounded-full bg-white/10"
        barClassName="rounded-full bg-gradient-to-r from-primary via-[#16D9E3] to-success"
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatusTile
          label="Nao iniciadas"
          value={vm.counts.not_started}
          status="not_started"
        />
        <StatusTile
          label="Em validacao"
          value={vm.counts.pending}
          status="pending"
        />
        <StatusTile
          label="Aprovadas"
          value={vm.counts.approved}
          status="approved"
        />
        <StatusTile
          label="Revisar"
          value={vm.counts.rejected}
          status="rejected"
        />
      </div>
    </section>
  );
}

function StatusTile({
  label,
  value,
  status,
}: {
  label: string;
  value: number;
  status: MissionStatus;
}) {
  const tone = {
    not_started: "bg-muted text-muted-foreground",
    pending: "bg-warning/15 text-warning",
    approved: "bg-success/15 text-success",
    rejected: "bg-destructive/15 text-destructive",
  }[status];

  const Icon =
    status === "approved"
      ? CheckCircle2
      : status === "pending"
        ? Clock
        : status === "rejected"
          ? RotateCcw
          : Compass;

  return (
    <div className="rounded-2xl border border-border bg-background/40 p-4">
      <div
        className={cn(
          "mb-3 flex size-9 items-center justify-center rounded-lg",
          tone,
        )}
      >
        <Icon className="size-5" />
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Transmissoes do mentor: feedback recente.                           */
/* ------------------------------------------------------------------ */
function MentorTransmissions({
  feedback,
}: {
  feedback: CockpitViewModel["recentFeedback"];
}) {
  return (
    <section className="rounded-3xl border border-border bg-card/80 p-5">
      <div className="mb-4 flex items-center gap-2">
        <Radio className="size-4 text-primary" />
        <h2 className="font-semibold">Transmissoes do mentor</h2>
      </div>
      {feedback.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="Sem feedback ainda"
          description="Envie sua primeira entrega para receber orientacao do professor."
          className="px-4 py-8"
        />
      ) : (
        <ul className="space-y-3">
          {feedback.map((item) => (
            <li
              key={item.id}
              className="rounded-2xl border border-border bg-background/40 p-3 text-sm"
            >
              <Link
                href={`/aluno/missoes/${item.missionId}`}
                className="flex items-center gap-2 font-medium hover:underline"
              >
                {item.approved ? (
                  <CheckCircle2 className="size-4 text-success" />
                ) : (
                  <RotateCcw className="size-4 text-destructive" />
                )}
                {item.missionTitle}
              </Link>
              <p className="mt-2 line-clamp-3 text-muted-foreground">
                {item.comment}
              </p>
              <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="size-3" />
                {item.createdAt}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
