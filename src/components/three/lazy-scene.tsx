"use client";

import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import dynamic from "next/dynamic";

import { SceneFallback } from "@/components/three/scene-fallback";

/**
 * API publica do spike 3D. Garante que a cena NUNCA bloqueie navegacao ou
 * conteudo principal:
 *
 * 1. `dynamic(..., { ssr: false })` — o chunk do three.js sai do bundle do
 *    servidor e do First Load JS; so e baixado no client.
 * 2. mount-on-visible (IntersectionObserver) — o import dinamico so dispara
 *    quando o container entra (perto de) na viewport. Antes disso, e enquanto
 *    o chunk carrega, mostra o fallback estatico.
 * 3. ErrorBoundary — se o WebGL nao existir ou a cena lancar, cai para o
 *    fallback estatico em vez de quebrar a pagina.
 *
 * `forceFallback` permite renderizar apenas o estado estatico (preview/QA).
 */

const ProceduralScene = dynamic(
  () => import("@/components/three/procedural-scene").then((m) => m.ProceduralScene),
  { ssr: false, loading: () => <SceneFallback /> },
);

class SceneErrorBoundary extends Component<
  { children: ReactNode; fallback: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  // Silencioso por design: a falha de WebGL nao deve poluir o console do
  // usuario; o fallback ja comunica o estado.
  componentDidCatch() {}

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export function LazyScene({
  className,
  height = 360,
  forceFallback = false,
}: {
  className?: string;
  height?: number;
  forceFallback?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (forceFallback) return;
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [forceFallback]);

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
