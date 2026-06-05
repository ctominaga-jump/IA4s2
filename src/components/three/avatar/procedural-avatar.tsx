"use client";

import { Suspense, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, Icosahedron, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import type { Group } from "three";

import type { AvatarRenderConfig } from "@/components/three/avatar/avatar-states";
import { AvatarModel } from "@/components/three/avatar/avatar-model";
import { SceneErrorBoundary } from "@/components/three/scene-error-boundary";

/**
 * Avatar 3D de um estado, como scene-graph (sem `<Canvas>` próprio) — pode ser
 * usado isolado (EvolvingAvatar) ou em lote (strip/matriz de preview). A
 * evolução combina camadas PROCEDURAIS (anéis, partículas, coroa) com o
 * Evolution Kit da fase (`config.kitUrl`, GLB modular gerado por
 * `scripts/generate-evolution-kits.mjs`). O núcleo central é o PLUG POINT: se
 * `config.model` existir (GLB da IDENTIDADE da variante), carrega o GLB dentro
 * de `<Suspense>`; senão, usa o núcleo procedural.
 *
 * O kit é autorado no MESMO espaço do GLB base (Y-up, origem central, altura
 * 1.0), então entra no grupo de spin com a mesma escala/rotação do modelo —
 * acompanha rotação e flutuação. Harmonização: a coroa procedural do Boss é
 * suprimida quando o kit Boss Final está ativo (o kit já entrega halo +
 * coroa); rollback do kit (`kitUrl=null`) restaura a coroa procedural.
 *
 * `animate=false` (reduced-motion) congela toda rotação/flutuação.
 */
const KIT_FALLBACK_SCALE = 1.9; // núcleo procedural ~ altura visual do GLB base
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
          {/* Evolution Kit da fase: mesmo espaço/escala do base. Boundary
              próprio: se o GLB do kit falhar, SÓ o kit some — o avatar
              continua 3D (base + camadas procedurais), sem derrubar o card. */}
          {config.kitUrl ? (
            <SceneErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <AvatarModel
                  url={config.kitUrl}
                  scale={config.model?.scale ?? KIT_FALLBACK_SCALE}
                  rotation={config.model?.rotation ?? [0, 0, 0]}
                />
              </Suspense>
            </SceneErrorBoundary>
          ) : null}
        </group>
      </Float>

      {/* Anéis orbitais + partículas (camadas de evolução). Com kit ativo, os
          anéis procedurais recuam (opacidade menor) para o equipamento do kit
          ler como protagonista — harmonização da revisão UX. */}
      <group ref={orbit}>
        {rings.map((i) => (
          <mesh key={i} rotation={[Math.PI / 2.4 + i * 0.5, i * 0.4, 0]}>
            <torusGeometry args={[1.25 + i * 0.2, 0.012, 8, 80]} />
            <meshBasicMaterial
              color={config.secondary}
              transparent
              opacity={config.kitUrl ? 0.26 : 0.4}
            />
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

      {/* Coroa procedural só quando o Boss não tem kit (kit traz halo+coroa). */}
      {config.crown && !config.kitUrl ? <Crown color={config.accent} /> : null}
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
