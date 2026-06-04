"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial } from "@react-three/drei";
import { useReducedMotion } from "framer-motion";
import type { Group } from "three";

/**
 * Cena procedural BRANDED v1 (Fase 7B-final) para o nucleo do "agente" no card
 * do hero da landing. 100% procedural (sem GLB/HDR/textura): nucleo low-poly
 * distorcido + casca wireframe + anel orbital com nos (metafora de
 * skills/missoes em torno do agente). Paleta dual ciano (#16D9E3) + violeta
 * (#6D5DF7) alinhada a 04-visual-direction.
 *
 * Leve: dpr [1,1.5], geometria baixa, canvas pequeno. Com `prefers-reduced-motion`
 * para toda animacao continua e usa frameloop "demand" (1 frame, ocioso).
 */

function Agent({ animate }: { animate: boolean }) {
  const spin = useRef<Group>(null);
  const orbit = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    if (spin.current) spin.current.rotation.y += delta * 0.35;
    if (orbit.current) orbit.current.rotation.z += delta * 0.5;
  });

  const nodes = [0, 1, 2];

  return (
    <group>
      <Float
        speed={animate ? 1.2 : 0}
        rotationIntensity={animate ? 0.4 : 0}
        floatIntensity={animate ? 0.5 : 0}
      >
        <group ref={spin}>
          <Icosahedron args={[0.92, 4]}>
            <MeshDistortMaterial
              color="#6D5DF7"
              emissive="#16D9E3"
              emissiveIntensity={0.35}
              roughness={0.2}
              metalness={0.6}
              distort={animate ? 0.28 : 0}
              speed={animate ? 1.4 : 0}
            />
          </Icosahedron>
          <Icosahedron args={[1.18, 1]}>
            <meshBasicMaterial
              color="#16D9E3"
              wireframe
              transparent
              opacity={0.25}
            />
          </Icosahedron>
        </group>
      </Float>

      {/* Anel orbital + nos (skills/missoes ao redor do agente). */}
      <group ref={orbit}>
        <mesh rotation={[Math.PI / 2.6, 0, 0]}>
          <torusGeometry args={[1.5, 0.012, 8, 80]} />
          <meshBasicMaterial color="#16D9E3" transparent opacity={0.35} />
        </mesh>
        {nodes.map((i) => {
          const a = (i / nodes.length) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 1.5, Math.sin(a) * 1.5, 0]}>
              <sphereGeometry args={[0.07, 16, 16]} />
              <meshBasicMaterial color={i === 1 ? "#FFC857" : "#9B8CFF"} />
            </mesh>
          );
        })}
      </group>
    </group>
  );
}

export function HeroCoreScene() {
  const reduce = useReducedMotion();
  const animate = !reduce;

  return (
    <Canvas
      className="size-full"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 3.4], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      frameloop={animate ? "always" : "demand"}
    >
      <ambientLight intensity={0.7} />
      <pointLight position={[3, 2, 4]} intensity={55} color="#16D9E3" />
      <pointLight position={[-3, -1, 2]} intensity={42} color="#6D5DF7" />
      <Agent animate={animate} />
    </Canvas>
  );
}
