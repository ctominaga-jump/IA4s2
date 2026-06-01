"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { PartyPopper, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { shouldCelebrateLevelUp } from "@/lib/avatar";

const STORAGE_KEY = "ia-last-seen-level";

/**
 * Celebra um level up de forma autocontida: compara o nivel atual com o
 * ultimo nivel visto (localStorage) e exibe uma celebracao uma unica vez,
 * sempre que o aluno sobe de nivel. Nao depende de banco nem de eventos.
 */
export function LevelUpCelebration({
  currentLevelNumber,
  levelTitle,
  forceShow = false,
}: {
  currentLevelNumber: number;
  levelTitle: string;
  forceShow?: boolean;
}) {
  const [show, setShow] = useState(forceShow);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (forceShow) return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const lastSeen = raw === null ? null : Number(raw);
      if (shouldCelebrateLevelUp(currentLevelNumber, lastSeen)) {
        setShow(true);
      }
      window.localStorage.setItem(STORAGE_KEY, String(currentLevelNumber));
    } catch {
      // Ambiente sem localStorage: simplesmente nao celebra.
    }
  }, [currentLevelNumber, forceShow]);

  return (
    <AnimatePresence>
      {show ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Voce subiu de nivel"
          className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            className="relative w-full max-w-sm overflow-hidden rounded-3xl border border-primary/30 bg-card p-7 text-center shadow-2xl"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.85, y: 8 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, scale: 1, y: 0 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={
              reduce
                ? { duration: 0.2 }
                : { type: "spring", stiffness: 320, damping: 22 }
            }
          >
            <motion.div
              aria-hidden
              className="pointer-events-none absolute -top-16 left-1/2 size-48 -translate-x-1/2 rounded-full bg-primary/25 blur-3xl"
              animate={reduce ? undefined : { opacity: [0.5, 0.9, 0.5] }}
              transition={
                reduce
                  ? undefined
                  : { duration: 3, ease: "easeInOut", repeat: Infinity }
              }
            />
            <button
              type="button"
              aria-label="Fechar"
              onClick={() => setShow(false)}
              className="absolute right-3 top-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="size-5" />
            </button>

            <div className="relative">
              <motion.div
                className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-[#16D9E3] text-white shadow-[0_0_30px_rgba(109,93,247,0.55)]"
                initial={reduce ? false : { rotate: -12, scale: 0.6 }}
                animate={reduce ? false : { rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 14, delay: 0.08 }}
              >
                <PartyPopper className="size-8" />
              </motion.div>
              <p className="mt-4 text-xs font-semibold uppercase tracking-[0.22em] text-[#9CEBF0]">
                Level up
              </p>
              <h2 className="mt-1 text-3xl font-bold tabular-nums">
                Nivel {currentLevelNumber}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Voce evoluiu para{" "}
                <span className="font-medium text-foreground">{levelTitle}</span>.
                Seu avatar tambem evoluiu.
              </p>
              <Button className="mt-5 w-full" onClick={() => setShow(false)}>
                Continuar jornada
              </Button>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
