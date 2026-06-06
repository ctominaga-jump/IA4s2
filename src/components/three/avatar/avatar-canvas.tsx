"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

import { ProceduralAvatar } from "@/components/three/avatar/procedural-avatar";
import { resolvedAvatarStateForPhase } from "@/components/three/avatar/avatar-states";
import type { AvatarVariant } from "@/lib/database.types";

/**
 * `<Canvas>` de um único avatar (1 contexto WebGL). Resolve o estado pelo índice
 * de fase e respeita `prefers-reduced-motion` (sem animação contínua →
 * frameloop "demand"). É o conteúdo carregado sob demanda por `EvolvingAvatar`.
 */
export function AvatarCanvas({
  phaseIndex,
  variant,
}: {
  phaseIndex: number;
  variant: AvatarVariant;
}) {
  const reduce = useReducedMotion();
  const animate = !reduce;
  const config = resolvedAvatarStateForPhase(phaseIndex, variant);

  return (
    <Canvas
      className="size-full"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.6], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 2, 4]} intensity={55} color={config.accent} />
      <pointLight position={[-3, -1, 2]} intensity={42} color={config.secondary} />
      {/* Key + fill neutras só para o asset GLB (material escuro/texturizado);
          o núcleo procedural emissivo dispensa e mantém o look original.
          Fill frontal-baixa: levanta identidades escuras (Aurora/Nebulosa)
          sobre cards escuros do app — ajuste da revisão UX da fase 17. */}
      {config.model ? (
        <>
          <directionalLight position={[2, 3, 5]} intensity={3.2} />
          <directionalLight position={[0, -1, 4]} intensity={1.2} />
        </>
      ) : null}
      <ProceduralAvatar config={config} animate={animate} />
    </Canvas>
  );
}
