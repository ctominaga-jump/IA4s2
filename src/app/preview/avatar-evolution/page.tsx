import Link from "next/link";
import { notFound } from "next/navigation";
import { Boxes } from "lucide-react";

import { EvolvingAvatar } from "@/components/three/avatar/lazy-avatar";
import { LazyAvatarMatrix } from "@/components/three/avatar/lazy-avatar-matrix";
import {
  AVATAR_IDENTITIES,
  AVATAR_KITS,
  AVATAR_MODELS,
  AVATAR_STATES,
} from "@/components/three/avatar/avatar-states";
import { cn } from "@/lib/utils";
import type { AvatarVariant } from "@/lib/database.types";

export const dynamic = "force-dynamic";

/**
 * Preview sem autenticacao dos avatares 3D reais. Mostra a separacao:
 * IDENTIDADE = GLB por variante (AVATAR_MODELS), EVOLUCAO = camadas
 * procedurais por fase (AVATAR_STATES) + Evolution Kit por variante/fase
 * (AVATAR_KITS) e a matriz 4x7 completa. Guardado em producao.
 *
 * Query params: `?variant=` seleciona a identidade do strip de evolucao;
 * `?fallback=1` forca o AvatarFigure 2D (rollback).
 */

const VARIANTS: AvatarVariant[] = ["aurora", "ember", "verdant", "nebula"];

/** Peso/maturidade do GLB por variante (ver visual-reviews/avatar-*-glb.md). */
const MODEL_BADGES: Record<AvatarVariant, string> = {
  aurora: "~752 KB - producao",
  ember: "~1,5 MB - intermediario",
  verdant: "~1,9 MB - intermediario",
  nebula: "~1,6 MB - intermediario",
};

/** Fase usada nos cards de identidade (2 aneis, sem coroa). */
const IDENTITY_PHASE_INDEX = 3;

export default async function AvatarEvolutionPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ fallback?: string; variant?: string }>;
}) {
  // Guardado em producao, EXCETO com ENABLE_PREVIEW_ROUTES=1 (env de runtime
  // no host) para validar os avatares online. Rollback: remover a env var.
  if (
    process.env.NODE_ENV === "production" &&
    process.env.ENABLE_PREVIEW_ROUTES !== "1"
  ) {
    notFound();
  }

  const { fallback, variant } = await searchParams;
  const forceFallback = fallback === "1" || fallback === "true";
  const stripVariant: AvatarVariant = VARIANTS.includes(variant as AvatarVariant)
    ? (variant as AvatarVariant)
    : "aurora";

  const linkFor = (v: AvatarVariant) =>
    `/preview/avatar-evolution?variant=${v}${forceFallback ? "&fallback=1" : ""}`;

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="container py-12 md:py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-1.5 text-sm font-medium text-cyan-100">
          <Boxes className="size-4 text-cyan-200" />
          Avatares 3D reais - identidade por GLB + evolucao procedural
        </span>
        <h1 className="mt-5 max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          4 identidades com GLB proprio, 7 estados com Evolution Kits.
        </h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          A identidade do avatar e o modelo base: cada variante (Aurora, Brasa,
          Verdejante e Nebulosa) carrega seu proprio GLB de{" "}
          <code className="text-cyan-200">/assets/3d</code>. A evolucao por fase
          combina camadas procedurais (aura, aneis, particulas) com um{" "}
          <strong className="text-white">Evolution Kit</strong> modular por
          variante/fase: acessorios, placas, halos, badges e wireframes que se
          somam ao base sem substitui-lo. Sem WebGL/JS, cai para o avatar 2D de
          mesma dimensao.
        </p>
        <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-cyan-200">
          {forceFallback ? "Modo fallback (AvatarFigure 2D)" : "Modo 3D (GLB por identidade)"}
        </p>

        {/* Secao 1: identidades (1 GLB por variante, mesma fase). */}
        <h2 className="mt-10 text-lg font-semibold text-white">
          Identidades - GLB por variante
        </h2>
        <div className="mt-4 grid grid-cols-2 gap-5 lg:grid-cols-4">
          {VARIANTS.map((v) => {
            const identity = AVATAR_IDENTITIES[v];
            const model = AVATAR_MODELS[v];
            return (
              <article
                key={v}
                className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-4"
              >
                <EvolvingAvatar
                  variant={v}
                  levelNumber={IDENTITY_PHASE_INDEX + 1}
                  phaseIndex={IDENTITY_PHASE_INDEX}
                  progressPercent={60}
                  size="md"
                  forceFallback={forceFallback}
                />
                <p className="mt-3 text-sm font-semibold text-white">
                  {identity.label}
                </p>
                <p className="text-[11px] text-slate-400">
                  {model ? model.url.split("/").pop() : "nucleo procedural"}
                </p>
                <p className="text-[11px] font-medium text-cyan-100">
                  {MODEL_BADGES[v]}
                </p>
              </article>
            );
          })}
        </div>

        {/* Secao 2: evolucao procedural da identidade selecionada. */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-white">
            Evolucao por fase - {AVATAR_IDENTITIES[stripVariant].label}
          </h2>
          <nav className="flex flex-wrap gap-2" aria-label="Selecionar identidade">
            {VARIANTS.map((v) => (
              <Link
                key={v}
                href={linkFor(v)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  v === stripVariant
                    ? "border-cyan-300/60 bg-cyan-300/15 text-cyan-100"
                    : "border-white/10 bg-white/[0.04] text-slate-300 hover:border-white/25",
                )}
              >
                {AVATAR_IDENTITIES[v].label.replace("Agente ", "")}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-7">
          {AVATAR_STATES.map((state) => (
            <article
              key={state.index}
              className="flex flex-col items-center rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <EvolvingAvatar
                variant={stripVariant}
                levelNumber={state.index + 1}
                phaseIndex={state.index}
                progressPercent={Math.round(
                  ((state.index + 1) / AVATAR_STATES.length) * 100,
                )}
                size="md"
                forceFallback={forceFallback}
              />
              <p className="mt-3 text-sm font-semibold text-white">{state.name}</p>
              <p className="text-[11px] text-slate-400">
                Estado {state.index + 1} - {state.rings} aneis -{" "}
                {state.particles} part.
              </p>
              <p className="text-[11px] font-medium text-cyan-100">
                {AVATAR_KITS[stripVariant][state.index]
                  ? `kit: ${AVATAR_KITS[stripVariant][state.index]?.split("-kit-").pop()?.replace(".glb", "")}`
                  : "sem kit (base)"}
              </p>
            </article>
          ))}
        </div>

        {/* Secao 3: matriz 4x7 (1 unico canvas WebGL). */}
        <h2 className="mt-12 text-lg font-semibold text-white">
          Matriz 4 identidades x 7 estados
        </h2>
        <p className="mt-1 max-w-3xl text-sm text-slate-400">
          Visao completa num unico contexto WebGL (28 canvases estourariam o
          limite do browser). Util para comparar maturidade visual entre fases
          e checar que nenhum avatar vira recolor de outro.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4 pl-16">
          {/* min-w: células legíveis no mobile via scroll horizontal. */}
          <div className="min-w-[820px]">
            <LazyAvatarMatrix forceFallback={forceFallback} />
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6 text-sm leading-6 text-slate-300">
          <h2 className="font-semibold text-white">
            Plug points, rollback e ressalvas
          </h2>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>
              <code className="text-cyan-200">AVATAR_MODELS</code> em{" "}
              <code className="text-cyan-200">avatar-states.ts</code> mapeia
              identidade -&gt; GLB (url, escala, rotacao).{" "}
              <code className="text-cyan-200">AVATAR_STATES</code> mantem as
              camadas procedurais por fase.{" "}
              <code className="text-cyan-200">AVATAR_KITS</code> mapeia
              variante + fase -&gt; Evolution Kit (GLB modular, lazy).
            </li>
            <li>
              Rollback por variante: entrada <code className="text-cyan-200">null</code>{" "}
              em <code className="text-cyan-200">AVATAR_MODELS</code> volta ao
              nucleo procedural. Rollback por variante/fase: entrada{" "}
              <code className="text-cyan-200">null</code> em{" "}
              <code className="text-cyan-200">AVATAR_KITS</code> volta a fase
              sem kit (a coroa procedural do Boss reaparece).{" "}
              <code className="text-cyan-200">?fallback=1</code> forca o
              AvatarFigure 2D.
            </li>
            <li>
              Kits gerados por <code className="text-cyan-200">scripts/generate-evolution-kits.mjs</code>{" "}
              (24 GLBs, ~0,75 MB no total, 7-71 KB cada) e auditados por{" "}
              <code className="text-cyan-200">scripts/inspect-kits.mjs</code>.
            </li>
            <li>
              Ressalva de producao: Brasa, Verdejante e Nebulosa estao em
              otimizacao intermediaria (~1,5-2 MB, 37k-47k tris). Validos para
              preview; producao mobile exige nova passada no Blender
              (alvo 15k-30k tris).
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
