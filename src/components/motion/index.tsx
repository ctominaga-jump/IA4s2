"use client";

/**
 * Motion primitives (Fase 7A).
 *
 * Wrappers client isolados sobre framer-motion. Server Components continuam
 * server e passam conteudo como `children`; estes wrappers so adicionam
 * opacity/transform. TODA primitive respeita `prefers-reduced-motion` via
 * `useReducedMotion()`: quando ativo, degrada para opacidade simples ou estado
 * final imediato, sem transform. Conteudo sempre presente no DOM.
 */

import {
  motion,
  useReducedMotion,
  type Transition,
  type Variants,
} from "framer-motion";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Classe-âncora para o fallback sem JS. framer-motion renderiza o estado
 * `initial` (opacity:0) inline no SSR; se o JS não hidratar (no-script ou
 * falha de chunk), o `<noscript>` global em app/layout.tsx força esta classe
 * a opacity:1, evitando conteúdo preso invisível na landing pública.
 */
const FALLBACK = "m-reveal";

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

/* ------------------------------------------------------------------ */
/* Appear: entrada on-mount (above-the-fold).                          */
/* ------------------------------------------------------------------ */
export function Appear({
  children,
  className,
  delay = 0,
  y = 14,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cx(FALLBACK, className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Reveal: entrada quando entra no viewport (below-the-fold), once.    */
/* ------------------------------------------------------------------ */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 18,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={cx(FALLBACK, className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Stagger: container que escalona a entrada dos filhos no viewport.   */
/* Use com <StaggerItem> para cada filho.                              */
/* ------------------------------------------------------------------ */
export function Stagger({
  children,
  className,
  gap = 0.08,
  delay = 0,
  onMount = false,
}: {
  children: ReactNode;
  className?: string;
  gap?: number;
  delay?: number;
  /** true = anima no mount (above-the-fold); false = ao entrar no viewport. */
  onMount?: boolean;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: {},
    show: {
      transition: { staggerChildren: reduce ? 0 : gap, delayChildren: delay },
    },
  };
  return (
    <motion.div
      className={className}
      variants={variants}
      initial="hidden"
      {...(onMount
        ? { animate: "show" }
        : { whileInView: "show", viewport: { once: true, margin: "-60px" } })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
  y = 16,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = useReducedMotion();
  const variants: Variants = {
    hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: EASE },
    },
  };
  return (
    <motion.div className={cx(FALLBACK, className)} variants={variants}>
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* HoverLift: realce de hover/tap para cartoes interativos.            */
/* Mantem o conteudo (Link/article) como filho.                        */
/* ------------------------------------------------------------------ */
export function HoverLift({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      whileHover={{ y: -3, scale: 1.012 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 380, damping: 26 }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* FloatLoop: flutuacao sutil e continua (elementos ilustrativos).     */
/* Reduced-motion: estatico.                                           */
/* ------------------------------------------------------------------ */
export function FloatLoop({
  children,
  className,
  distance = 8,
  duration = 6,
}: {
  children: ReactNode;
  className?: string;
  distance?: number;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -distance, 0] }}
      transition={{ duration, ease: "easeInOut", repeat: Infinity }}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Pop: entrada com spring (celebracao, unlock, badge).                */
/* ------------------------------------------------------------------ */
export function Pop({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const transition: Transition = reduce
    ? { duration: 0.2, delay }
    : { type: "spring", stiffness: 320, damping: 20, delay };
  return (
    <motion.div
      className={cx(FALLBACK, className)}
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
      animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* MotionBar: barra de progresso que anima o preenchimento ate `pct`.  */
/* Reduced-motion: largura final imediata.                             */
/* ------------------------------------------------------------------ */
export function MotionBar({
  pct,
  className,
  barClassName,
  delay = 0,
}: {
  pct: number;
  className?: string;
  barClassName?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const clamped = Math.min(100, Math.max(0, pct));
  return (
    <div className={className}>
      <motion.div
        className={barClassName}
        style={{ height: "100%" }}
        initial={reduce ? false : { width: 0 }}
        whileInView={{ width: `${clamped}%` }}
        viewport={{ once: true }}
        transition={
          reduce ? { duration: 0 } : { duration: 0.9, ease: EASE, delay }
        }
      />
    </div>
  );
}
