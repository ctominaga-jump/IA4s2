"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * PLUG POINT de asset real (GLB próprio/licenciado — local ou hospedado).
 *
 * Usado pelo `ProceduralAvatar` quando a IDENTIDADE da variante define um
 * modelo em `AVATAR_MODELS` (avatar-states.ts). É montado dentro de
 * `<Suspense>`; enquanto o GLB baixa (e em caso de identidade sem modelo),
 * o núcleo procedural assume — as camadas procedurais (aura/anéis/partículas)
 * continuam ao redor em ambos os casos.
 *
 * `rotation`/`scale` vêm do `AvatarModelSource`: compensam GLBs que ainda não
 * foram normalizados no Blender (ex.: Brasa/Verdejante/Nebulosa em Z-up).
 *
 * Nota: GLBs comprimidos com DRACO/meshopt fazem o drei buscar o decoder (por
 * padrão de um CDN). Para evitar dependência de CDN externo, hospede o decoder
 * localmente ao plugar assets comprimidos.
 */
export function AvatarModel({
  url,
  scale = 1,
  rotation = [0, 0, 0],
}: {
  url: string;
  scale?: number;
  rotation?: [number, number, number];
}) {
  const { scene } = useGLTF(url);
  // useGLTF cacheia a MESMA cena por URL e um objeto Three.js só tem um parent:
  // sem clone, vários canvases (ex.: preview com 7 estados) "roubam" o modelo
  // uns dos outros. O clone compartilha geometria/texturas (sem custo de GPU).
  const instance = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={instance} scale={scale} rotation={rotation} />;
}

/** Preload opcional de um asset (ex.: o próximo estado provável). */
export function preloadAvatar(url: string) {
  useGLTF.preload(url);
}
