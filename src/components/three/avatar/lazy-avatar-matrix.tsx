"use client";

import dynamic from "next/dynamic";

import { AvatarFigure } from "@/components/game/avatar-figure";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { useInViewport } from "@/components/three/use-in-viewport";
import { AVATAR_STATES } from "@/components/three/avatar/avatar-states";
import type { AvatarVariant } from "@/lib/database.types";

/**
 * Envelope lazy da matriz 4x7 (mesmo padrão do `EvolvingAvatar`):
 * mount-on-visible + dynamic(ssr:false) + ErrorBoundary. O fallback (antes de
 * visível, sem WebGL, erro ou `forceFallback`) é a grade 2D de
 * `AvatarFigure` — o conteúdo nunca some.
 */

const VARIANTS: AvatarVariant[] = ["aurora", "ember", "verdant", "nebula"];

const AvatarMatrixCanvas = dynamic(
  () =>
    import("@/components/three/avatar/avatar-matrix-canvas").then(
      (m) => m.AvatarMatrixCanvas,
    ),
  { ssr: false, loading: () => <MatrixFallback /> },
);

function MatrixFallback() {
  return (
    <div className="overflow-x-auto">
      <div className="grid w-max grid-cols-7 gap-3">
        {VARIANTS.map((variant) =>
          AVATAR_STATES.map((state) => (
            <AvatarFigure
              key={`${variant}-${state.index}`}
              variant={variant}
              levelNumber={state.index + 1}
              phaseIndex={state.index}
              progressPercent={Math.round(
                ((state.index + 1) / AVATAR_STATES.length) * 100,
              )}
              size="md"
              showLevelBadge={false}
            />
          )),
        )}
      </div>
    </div>
  );
}

export function LazyAvatarMatrix({
  forceFallback = false,
}: {
  forceFallback?: boolean;
}) {
  const [ref, visible] = useInViewport<HTMLDivElement>({
    enabled: !forceFallback,
  });

  return (
    <div ref={ref}>
      {visible && !forceFallback ? (
        <SceneErrorBoundary fallback={<MatrixFallback />}>
          <AvatarMatrixCanvas />
        </SceneErrorBoundary>
      ) : (
        <MatrixFallback />
      )}
    </div>
  );
}
