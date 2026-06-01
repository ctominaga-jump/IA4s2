"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Float,
  Icosahedron,
  MeshDistortMaterial,
  Sparkles,
} from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Group } from "three";

/**
 * Cena procedural leve (spike 7B). 100% gerada em codigo, SEM assets externos
 * (sem GLB/HDR/texturas): nucleo low-poly com material distorcido, casca
 * wireframe e particulas. Objetivo do spike e provar o pipeline R3F, nao o
 * 3D definitivo de marca/avatar.
 *
 * Performance: dpr limitado a [1, 1.5]; quando `prefers-reduced-motion` esta
 * ativo, toda animacao para e o frameloop vira "demand" (renderiza uma vez e
 * fica ocioso, sem custo de CPU/GPU continuo).
 */

function Core({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);

  useFrame((_, delta) => {
    if (animate && group.current) {
      group.current.rotation.y += delta * 0.25;
    }
  });

  return (
    <group ref={group}>
      <Float
        speed={animate ? 1.4 : 0}
        rotationIntensity={animate ? 0.5 : 0}
        floatIntensity={animate ? 0.7 : 0}
      >
        <Icosahedron args={[1, 6]}>
          <MeshDistortMaterial
            color="#6D5DF7"
            emissive="#16D9E3"
            emissiveIntensity={0.28}
            roughness={0.25}
            metalness={0.55}
            distort={animate ? 0.32 : 0}
            speed={animate ? 1.6 : 0}
          />
        </Icosahedron>
        <Icosahedron args={[1.42, 1]}>
          <meshBasicMaterial
            color="#16D9E3"
            wireframe
            transparent
            opacity={0.22}
          />
        </Icosahedron>
      </Float>
      <Sparkles
        count={36}
        scale={6}
        size={2.4}
        speed={animate ? 0.4 : 0}
        color="#9CEBF0"
        opacity={0.7}
      />
    </group>
  );
}

export function ProceduralScene() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  return (
    <Canvas
      className="size-full"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 4.2], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[4, 3, 5]} intensity={90} color="#16D9E3" />
      <pointLight position={[-4, -2, 2]} intensity={60} color="#6D5DF7" />
      <Core animate={animate} />
    </Canvas>
  );
}
