"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group } from "three";

import type { AvatarRenderConfig } from "@/components/three/avatar/avatar-states";
import { AvatarModel } from "@/components/three/avatar/avatar-model";

/**
 * Avatar 3D de um estado, como scene-graph (sem `<Canvas>` próprio) — pode ser
 * usado isolado (EvolvingAvatar) ou em lote (strip de preview). A evolução é
 * PROCEDURAL: núcleo + casca wireframe + N anéis orbitais + partículas + coroa
 * (Boss). O núcleo central é o PLUG POINT: se `config.model` existir (GLB da
 * IDENTIDADE da variante), carrega o GLB dentro de `<Suspense>` (as camadas
 * procedurais permanecem ao redor); senão, usa o núcleo procedural.
 *
 * `animate=false` (reduced-motion) congela toda rotação/flutuação.
 */
export function ProceduralAvatar({
  config,
  animate,
  position = [0, 0, 0],
  scale = 1,
}: {
  config: AvatarRenderConfig;
  animate: boolean;
  position?: [number, number, number];
  scale?: number;
}) {
  const spin = useRef<Group>(null);
  const orbit = useRef<Group>(null);

  useFrame((_, delta) => {
    if (!animate) return;
    if (spin.current) spin.current.rotation.y += delta * 0.3;
    if (orbit.current) orbit.current.rotation.z += delta * 0.45;
  });

  const rings = Array.from({ length: config.rings }, (_, i) => i);

  return (
    <group position={position} scale={scale}>
      {/* Núcleo: GLB (plug point) ou procedural. */}
      <Float
        speed={animate ? 1.2 : 0}
        rotationIntensity={animate ? 0.4 : 0}
        floatIntensity={animate ? 0.5 : 0}
      >
        <group ref={spin}>
          {config.model ? (
            <Suspense fallback={<ProceduralCore config={config} animate={animate} />}>
              {/* scale/rotation do AvatarModelSource: ~1.9 de altura visual
                  (≈ diâmetro do núcleo procedural, anéis em r 1.25+ visíveis). */}
              <AvatarModel
                url={config.model.url}
                scale={config.model.scale}
                rotation={config.model.rotation}
              />
            </Suspense>
          ) : (
            <ProceduralCore config={config} animate={animate} />
          )}
        </group>
      </Float>

      {/* Anéis orbitais + partículas (camadas de evolução). */}
      <group ref={orbit}>
        {rings.map((i) => (
          <mesh key={i} rotation={[Math.PI / 2.4 + i * 0.5, i * 0.4, 0]}>
            <torusGeometry args={[1.25 + i * 0.2, 0.012, 8, 80]} />
            <meshBasicMaterial color={config.secondary} transparent opacity={0.4} />
          </mesh>
        ))}
      </group>

      <Sparkles
        count={config.particles}
        scale={3}
        size={2}
        speed={animate ? 0.4 : 0}
        color={config.secondary}
        opacity={0.7}
      />

      {config.crown ? <Crown color={config.accent} /> : null}
    </group>
  );
}

/** Núcleo procedural: icosaedro distorcido + casca wireframe. */
function ProceduralCore({
  config,
  animate,
}: {
  config: AvatarRenderConfig;
  animate: boolean;
}) {
  return (
    <group>
      <Icosahedron args={[0.9, 4]}>
        <MeshDistortMaterial
          color={config.accent}
          emissive={config.accent}
          emissiveIntensity={0.3}
          roughness={0.2}
          metalness={0.6}
          distort={animate ? config.distort : 0}
          speed={animate ? 1.4 : 0}
        />
      </Icosahedron>
      <Icosahedron args={[1.12, 1]}>
        <meshBasicMaterial color={config.secondary} wireframe transparent opacity={0.22} />
      </Icosahedron>
    </group>
  );
}

/** Coroa procedural do Boss Final: anel + pontas. */
function Crown({ color }: { color: string }) {
  const points = [0, 1, 2, 3, 4];
  return (
    <group position={[0, 1.15, 0]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.34, 0.03, 8, 40]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      {points.map((i) => {
        const a = (i / points.length) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * 0.34, 0.12, Math.sin(a) * 0.34]}>
            <coneGeometry args={[0.05, 0.16, 8]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} />
          </mesh>
        );
      })}
    </group>
  );
}
