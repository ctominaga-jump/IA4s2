"use client";

import dynamic from "next/dynamic";
import { Bot } from "lucide-react";

import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";
import { useInViewport } from "@/components/three/use-in-viewport";

/**
 * Nucleo 3D branded do card do hero (Fase 7B-final, Opcao 2).
 *
 * Integracao controlada: troca APENAS o disco do avatar do HeroCockpit pela
 * cena procedural; copy, CTAs, metricas e layout da 7A ficam intactos. O
 * fallback estatico (disco + icone Bot) tem a MESMA dimensao do disco e e
 * usado em: SSR, enquanto o chunk carrega, sem WebGL (ErrorBoundary) e antes
 * de a cena entrar na viewport. Se a cena nao puder rodar, o card volta a ser
 * exatamente o da 7A.
 */

const HeroCoreScene = dynamic(
  () => import("@/components/three/hero-core-scene").then((m) => m.HeroCoreScene),
  { ssr: false, loading: () => <CoreFallback /> },
);

/** Fallback estatico: o nucleo Bot da 7A, centralizado no disco. */
function CoreFallback() {
  return (
    <div className="flex size-24 items-center justify-center rounded-full border border-white/20 bg-[#141B2E] shadow-[0_0_42px_rgba(22,217,227,0.28)]">
      <Bot className="size-12 text-cyan-100" />
    </div>
  );
}

export function HeroAgentCore({ forceFallback = false }: { forceFallback?: boolean }) {
  const [ref, visible] = useInViewport<HTMLDivElement>({
    enabled: !forceFallback,
    rootMargin: "200px",
  });

  const showScene = visible && !forceFallback;

  return (
    <div
      ref={ref}
      className="relative mx-auto flex aspect-square w-full max-w-[180px] items-center justify-center overflow-hidden rounded-full border border-cyan-200/30 bg-[radial-gradient(circle,rgba(22,217,227,0.30),rgba(109,93,247,0.08)_58%,transparent_60%)]"
    >
      {showScene ? (
        <SceneErrorBoundary fallback={<CoreFallback />}>
          <div className="absolute inset-0">
            <HeroCoreScene />
          </div>
        </SceneErrorBoundary>
      ) : (
        <CoreFallback />
      )}
    </div>
  );
}
