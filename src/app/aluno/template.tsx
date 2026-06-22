"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * Transicao leve entre rotas do aluno (Fase 7A). O `template.tsx` remonta a
 * cada navegacao, entao um fade curto de opacidade da continuidade entre
 * Cockpit, Jornada, Boss Final e Progresso. So afeta opacidade; o shell
 * (header/nav) permanece estático. Respeita `prefers-reduced-motion`.
 */
export default function StudentTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <>{children}</>;
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
