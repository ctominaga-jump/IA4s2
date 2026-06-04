"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Mount-on-visible: dispara `visible=true` quando o elemento (quase) entra na
 * viewport e desconecta o observer. Base do nao-bloqueio das cenas 3D — o
 * import dinamico so ocorre quando o container aparece. `enabled=false` mantem
 * o elemento sempre no estado inicial (usado para forcar fallback).
 */
export function useInViewport<T extends Element>({
  rootMargin = "200px",
  enabled = true,
}: { rootMargin?: string; enabled?: boolean } = {}) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!enabled) return;
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
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, enabled]);

  return [ref, visible] as const;
}
