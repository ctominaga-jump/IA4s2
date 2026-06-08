"use client";

import { Canvas } from "@react-three/fiber";
import { useReducedMotion } from "framer-motion";

import { ProceduralAvatar } from "@/components/three/avatar/procedural-avatar";
import {
  AVATAR_IDENTITIES,
  AVATAR_STATES,
  resolvedAvatarStateForPhase,
} from "@/components/three/avatar/avatar-states";
import type { AvatarVariant } from "@/lib/database.types";

/**
 * Matriz 4 identidades x 8 estados num ÚNICO `<Canvas>` (1 contexto WebGL).
 *
 * 28 canvases estourariam o limite de contextos do browser (~16); como o
 * `ProceduralAvatar` é scene-graph puro (sem canvas próprio, com
 * `position`/`scale` para uso em lote), a matriz inteira cabe num contexto.
 * Geometria/texturas dos GLBs são compartilhadas entre células (useGLTF cache
 * + clone). Reduced motion congela rotação/flutuação e usa frameloop demand.
 */

const VARIANTS: AvatarVariant[] = ["aurora", "ember", "verdant", "nebula"];
const COLS = AVATAR_STATES.length; // 8 fases
const ROWS = VARIANTS.length; // 4 identidades
const CELL_X = 2.5;
const CELL_Y = 2.9;
const AVATAR_SCALE = 0.62;

export function AvatarMatrixCanvas() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  return (
    <div className="relative">
      {/* Cabeçalho de colunas (fases) — alinhamento aproximado às células. */}
      <div
        className="grid text-center text-[11px] font-medium text-slate-300"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
      >
        {AVATAR_STATES.map((s) => (
          <span key={s.index}>{s.name}</span>
        ))}
      </div>
      <div className="relative" style={{ aspectRatio: `${COLS * CELL_X} / ${ROWS * CELL_Y}` }}>
        {/* Rótulos de linha (identidades). */}
        <div className="absolute -left-2 top-0 flex h-full -translate-x-full flex-col justify-around text-right text-[11px] font-medium text-slate-300">
          {VARIANTS.map((v) => (
            <span key={v}>{AVATAR_IDENTITIES[v].label.replace("Agente ", "")}</span>
          ))}
        </div>
        <Canvas
          className="size-full"
          dpr={[1, 1.5]}
          camera={{ position: [0, 0, 13.2], fov: 50 }}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          frameloop={animate ? "always" : "demand"}
        >
          <ambientLight intensity={0.75} />
          <directionalLight position={[4, 6, 8]} intensity={2.2} />
          <pointLight position={[-6, -2, 6]} intensity={60} color="#6D5DF7" />
          <pointLight position={[6, 2, 6]} intensity={60} color="#16D9E3" />
          {VARIANTS.map((variant, row) =>
            AVATAR_STATES.map((state, col) => (
              <ProceduralAvatar
                key={`${variant}-${state.index}`}
                config={resolvedAvatarStateForPhase(state.index, variant)}
                animate={animate}
                position={[
                  (col - (COLS - 1) / 2) * CELL_X,
                  ((ROWS - 1) / 2 - row) * CELL_Y,
                  0,
                ]}
                scale={AVATAR_SCALE}
              />
            )),
          )}
        </Canvas>
      </div>
    </div>
  );
}
