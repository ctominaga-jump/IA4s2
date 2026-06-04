"use client";

import dynamic from "next/dynamic";

import { AvatarFigure } from "@/components/game/avatar-figure";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { useInViewport } from "@/components/three/use-in-viewport";
import type { AvatarVariant } from "@/lib/database.types";

/**
 * `EvolvingAvatar` — API pública do avatar 3D evolutivo (cockpit-ready).
 *
 * Envelope validado: `dynamic(ssr:false)` + mount-on-visible + ErrorBoundary +
 * fallback estático = `AvatarFigure` (o avatar 2D já no produto), de MESMA
 * dimensão. Estados:
 *  - antes de visível / sem WebGL / erro  → `AvatarFigure` (2D);
 *  - visível, baixando o chunk            → disco neutro (LoadingDisc);
 *  - visível, carregado                   → cena 3D procedural do estado.
 *
 * `forceFallback` mantém o 2D (rollback por flag). Tudo respeita
 * `prefers-reduced-motion` (no AvatarCanvas).
 */

const SIZES = { md: 150, lg: 184 } as const;

const AvatarCanvas = dynamic(
  () => import("@/components/three/avatar/avatar-canvas").then((m) => m.AvatarCanvas),
  { ssr: false, loading: () => <LoadingDisc /> },
);

function LoadingDisc() {
  return (
    <div className="grid size-full place-items-center">
      <span className="size-16 animate-pulse rounded-full border border-white/15 bg-white/5 motion-reduce:animate-none" />
    </div>
  );
}

export function EvolvingAvatar({
  variant,
  levelNumber,
  phaseIndex,
  progressPercent,
  size = "md",
  forceFallback = false,
}: {
  variant: AvatarVariant;
  levelNumber: number;
  phaseIndex: number;
  progressPercent: number;
  size?: keyof typeof SIZES;
  forceFallback?: boolean;
}) {
  const [ref, visible] = useInViewport<HTMLDivElement>({
    enabled: !forceFallback,
  });
  const px = SIZES[size];

  const fallback = (
    <AvatarFigure
      variant={variant}
      levelNumber={levelNumber}
      phaseIndex={phaseIndex}
      progressPercent={progressPercent}
      size={size}
    />
  );

  return (
    <div ref={ref} className="relative" style={{ width: px, height: px }}>
      {visible && !forceFallback ? (
        <SceneErrorBoundary fallback={fallback}>
          <div className="absolute inset-0">
            <AvatarCanvas phaseIndex={phaseIndex} variant={variant} />
          </div>
        </SceneErrorBoundary>
      ) : (
        fallback
      )}
    </div>
  );
}
