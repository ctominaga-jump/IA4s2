"use client";

import dynamic from "next/dynamic";

import { SceneFallback } from "@/components/three/scene-fallback";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { useInViewport } from "@/components/three/use-in-viewport";

/**
 * API publica do spike 3D. Garante que a cena NUNCA bloqueie navegacao ou
 * conteúdo principal:
 *
 * 1. `dynamic(..., { ssr: false })` — o chunk do three.js sai do First Load JS;
 *    s? e baixado no client.
 * 2. mount-on-visible (useInViewport) — o import dinamico s? dispara quando o
 *    container entra (perto de) na viewport. Antes disso, e enquanto o chunk
 *    carrega, mostra o fallback estático.
 * 3. SceneErrorBoundary — sem WebGL / em erro, cai para o fallback estático.
 *
 * `forceFallback` renderiza apenas o estado estático (preview/QA).
 */

const ProceduralScene = dynamic(
  () => import("@/components/three/procedural-scene").then((m) => m.ProceduralScene),
  { ssr: false, loading: () => <SceneFallback /> },
);

export function LazyScene({
  className,
  height = 360,
  forceFallback = false,
}: {
  className?: string;
  height?: number;
  forceFallback?: boolean;
}) {
  const [ref, visible] = useInViewport<HTMLDivElement>({
    enabled: !forceFallback,
    rootMargin: "200px",
  });

  return (
    <div ref={ref} className={className} style={{ height }}>
      {visible && !forceFallback ? (
        <SceneErrorBoundary fallback={<SceneFallback />}>
          <ProceduralScene />
        </SceneErrorBoundary>
      ) : (
        <SceneFallback />
      )}
    </div>
  );
}
