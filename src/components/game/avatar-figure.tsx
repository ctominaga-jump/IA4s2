import { Trophy } from "lucide-react";

import { PHASES } from "@/components/game/journey-phases";
import { cn } from "@/lib/utils";
import type { AvatarVariant } from "@/lib/database.types";

interface VariantPalette {
  from: string;
  to: string;
  glow: string;
  aura: string;
}

const PALETTE: Record<AvatarVariant, VariantPalette> = {
  aurora: {
    from: "#16D9E3",
    to: "#6D5DF7",
    glow: "rgba(22,217,227,0.30)",
    aura: "rgba(22,217,227,0.30)",
  },
  ember: {
    from: "#FFC857",
    to: "#FF5C7A",
    glow: "rgba(255,92,122,0.30)",
    aura: "rgba(255,200,87,0.28)",
  },
  verdant: {
    from: "#3EE58F",
    to: "#16D9E3",
    glow: "rgba(62,229,143,0.30)",
    aura: "rgba(62,229,143,0.28)",
  },
  nebula: {
    from: "#6D5DF7",
    to: "#FF5C7A",
    glow: "rgba(109,93,247,0.32)",
    aura: "rgba(109,93,247,0.28)",
  },
};

const SIZES = {
  md: { box: 150, core: 96, icon: "size-10", badge: "size-7 text-xs" },
  lg: { box: 184, core: 116, icon: "size-12", badge: "size-8 text-sm" },
} as const;

/**
 * Avatar evolutivo do aluno. A identidade combina:
 * - variante de cor escolhida (persistida em student_profiles.avatar_variant);
 * - icone da fase atual (derivado de phaseIndex);
 * - anel de progresso do nivel (derivado do XP);
 * - badge de nivel.
 * Componente puro: sem 3D e sem estado, com fallback visual estavel.
 */
export function AvatarFigure({
  variant,
  levelNumber,
  phaseIndex,
  progressPercent,
  size = "md",
  showLevelBadge = true,
}: {
  variant: AvatarVariant;
  levelNumber: number;
  phaseIndex: number;
  progressPercent: number;
  size?: keyof typeof SIZES;
  showLevelBadge?: boolean;
}) {
  const palette = PALETTE[variant] ?? PALETTE.aurora;
  const dims = SIZES[size];
  const phase = PHASES[Math.min(Math.max(phaseIndex, 0), PHASES.length - 1)];
  const PhaseIcon = phase.icon;

  const pct = Math.min(100, Math.max(0, progressPercent));
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - pct / 100);
  const gradientId = `avatar-ring-${variant}-${size}`;

  return (
    <div
      className="relative grid place-items-center"
      style={{ width: dims.box, height: dims.box }}
    >
      <div
        className="absolute inset-2 rounded-full"
        style={{
          background: `radial-gradient(circle, ${palette.aura}, rgba(109,93,247,0.10) 55%, transparent 70%)`,
        }}
      />
      <svg
        viewBox="0 0 120 120"
        className="absolute inset-0 size-full -rotate-90"
        aria-hidden
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.from} />
            <stop offset="100%" stopColor={palette.to} />
          </linearGradient>
        </defs>
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.08)"
          strokeWidth="6"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>

      <div
        className="relative flex items-center justify-center rounded-full border border-white/15 bg-[#10172a]"
        style={{
          width: dims.core,
          height: dims.core,
          boxShadow: `0 0 38px ${palette.glow}`,
        }}
      >
        <PhaseIcon className={cn(dims.icon, "text-white/90")} />
      </div>

      {showLevelBadge ? (
        <span
          className={cn(
            "absolute bottom-1 right-1 flex items-center justify-center rounded-full border border-white/20 font-bold tabular-nums text-[#10172a]",
            dims.badge,
          )}
          style={{
            background: `linear-gradient(135deg, ${palette.from}, ${palette.to})`,
          }}
        >
          {levelNumber}
        </span>
      ) : null}
    </div>
  );
}

/** Pequeno selo de trofeu reutilizavel em cabecalhos de identidade. */
export function AvatarTrophyTag({ levelNumber }: { levelNumber: number }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-bold tabular-nums text-warning">
      <Trophy className="size-3" />
      Nv {levelNumber}
    </span>
  );
}
