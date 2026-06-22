import { notFound } from "next/navigation";
import { Boxes, FlaskConical, Gauge, ShieldCheck } from "lucide-react";

import { LazyScene } from "@/components/three/lazy-scene";

export const dynamic = "force-dynamic";

/**
 * Preview SEM autenticação do spike 3D (Fase 7B-spike). Isolado: nao toca
 * landing, cockpit, auth, XP, server, review nem banco. Disponível apenas
 * fora de produção. `?fallback=1` força o estado estático (para QA/print do
 * fallback sem depender de WebGL no ambiente).
 */

const notes = [
  {
    icon: ShieldCheck,
    title: "Fallback obrigatório",
    body: "Sem WebGL ou em erro, a cena cai para um placeholder estático on-brand.",
  },
  {
    icon: Gauge,
    title: "Sob demanda",
    body: "O chunk do three.js só baixa quando a cena entra na viewport (ssr:false + IntersectionObserver).",
  },
  {
    icon: FlaskConical,
    title: "Procedural",
    body: "Geometria gerada em codigo, sem assets externos (GLB/HDR/textura).",
  },
];

export default async function Scene3DPreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ fallback?: string }>;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { fallback } = await searchParams;
  const forceFallback = fallback === "1" || fallback === "true";

  return (
    <div className="min-h-screen bg-[#070A12] text-white">
      <div className="container py-12 md:py-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-1.5 text-sm font-medium text-cyan-100">
          <Boxes className="size-4 text-cyan-200" />
          Spike 7B - cena procedural leve
        </span>
        <h1 className="mt-5 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
          Pipeline 3D isolado, com fallback e sem bloquear conteúdo.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-300">
          Está página renderiza por completo no servidor. A cena 3D é um
          componente client carregado sob demanda; este texto e os cartões
          abaixo aparecem independente de o WebGL existir ou de a cena terminar
          de carregar.
        </p>

        {/* Conteúdo principal ANTES da cena: prova que nada espera o 3D. */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {notes.map((n) => (
            <article
              key={n.title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"
            >
              <div className="flex size-10 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <n.icon className="size-5" />
              </div>
              <h2 className="mt-3 font-semibold">{n.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-400">{n.body}</p>
            </article>
          ))}
        </div>

        {/* A cena (ou seu fallback). Altura fixa: sem CLS quando o 3D monta. */}
        <div className="mt-8">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
            {forceFallback ? "Fallback estático (forçado)" : "Cena procedural"}
          </p>
          <LazyScene
            height={460}
            forceFallback={forceFallback}
            className="overflow-hidden rounded-3xl"
          />
        </div>

        {/* Conteúdo DEPOIS da cena: continua acessivel/rolavel normalmente. */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <h2 className="font-semibold">O que este spike valida</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-300">
            <li>three + @react-three/fiber + @react-three/drei sob React 19.</li>
            <li>dynamic import com ssr:false (chunk fora do First Load JS).</li>
            <li>fallback estático obrigatório em loading e em erro de WebGL.</li>
            <li>prefers-reduced-motion para a cena (sem animacao continua).</li>
            <li>impacto de bundle medido no build, isolado a está rota.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
