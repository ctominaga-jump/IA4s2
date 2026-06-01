import { Boxes } from "lucide-react";

/**
 * Fallback estatico OBRIGATORIO da cena 3D (spike 7B).
 *
 * Renderizado em tres situacoes:
 * - enquanto o chunk do three.js carrega (loading do dynamic import);
 * - quando o WebGL nao esta disponivel / a cena lanca erro (ErrorBoundary);
 * - quando se quer forcar o modo estatico (prefers-reduced-motion forte / preview).
 *
 * Componente puro, sem hooks e sem dependencia de three: funciona no SSR e como
 * placeholder leve. Visual alinhado ao dark premium (paleta de 04-visual-direction).
 */
export function SceneFallback() {
  return (
    <div
      aria-hidden
      className="relative grid size-full place-items-center overflow-hidden rounded-3xl border border-white/10 bg-[#0E1424]"
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(22,217,227,0.22),rgba(109,93,247,0.10)_45%,transparent_70%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(244,247,251,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,251,0.04)_1px,transparent_1px)] bg-[size:36px_36px] [mask-image:radial-gradient(circle_at_50%_45%,black,transparent_72%)]" />
      <div className="relative flex size-24 items-center justify-center rounded-full border border-white/15 bg-[#10172a] shadow-[0_0_48px_rgba(22,217,227,0.30)]">
        <Boxes className="size-11 text-cyan-100/90" />
      </div>
    </div>
  );
}
