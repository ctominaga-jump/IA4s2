import Link from "next/link";
import {
  ArrowRight,
  Bot,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Compass,
  FlaskConical,
  MessageSquareText,
  Network,
  Rocket,
  ShieldCheck,
  Sparkles,
  Target,
  TerminalSquare,
  Trophy,
  Workflow,
  Zap,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Appear, Reveal, Stagger, StaggerItem } from "@/components/motion";
import { HeroAgentCore } from "@/components/three/hero-core";
import { dashboardPathForRole, getSessionUser } from "@/lib/auth/session";

export const dynamic = "force-dynamic";

const phaseRows = [
  {
    name: "Despertar",
    title: "Entenda IA no mundo real",
    description: "Primeiras missoes para usar IA em tarefas concretas.",
    icon: Sparkles,
    tone: "from-cyan-300 to-violet-300",
  },
  {
    name: "Explorador",
    title: "Converse melhor com IA",
    description: "Prompts basicos, pesquisa e validacao de respostas.",
    icon: Compass,
    tone: "from-emerald-300 to-cyan-300",
  },
  {
    name: "Estrategista",
    title: "Domine contexto e criterio",
    description: "Objetivo, formato, restricoes e comparacao de respostas.",
    icon: BrainCircuit,
    tone: "from-violet-300 to-fuchsia-300",
  },
  {
    name: "Criador",
    title: "Construa pequenos projetos",
    description: "Ideias, fluxos, prototipos e documentacao guiada por IA.",
    icon: FlaskConical,
    tone: "from-amber-200 to-cyan-300",
  },
  {
    name: "Operador de IA",
    title: "Opere fluxos com IA",
    description:
      "Monte e reutilize fluxos de trabalho com IA nas ferramentas do seu dia a dia.",
    icon: Workflow,
    tone: "from-cyan-300 to-emerald-300",
  },
  {
    name: "Operador Tecnico",
    title: "Pilote IA no ambiente tecnico",
    description:
      "Use terminal e editor de forma guiada, com a IA de copiloto, sem virar programador.",
    icon: TerminalSquare,
    tone: "from-emerald-300 to-violet-300",
  },
  {
    name: "Arquiteto de Agentes",
    title: "Desenhe agentes e cadeias",
    description:
      "Planeje objetivos, papeis, etapas e limites de agentes de IA no papel.",
    icon: Network,
    tone: "from-violet-300 to-cyan-300",
  },
  {
    name: "Boss Final",
    title: "Crie seu produto com IA",
    description: "Problema, solucao, arquitetura, prototipo e validacao.",
    icon: Rocket,
    tone: "from-amber-200 to-violet-300",
  },
];

const valuePillars = [
  {
    icon: Target,
    title: "Missoes praticas",
    description:
      "Cada etapa termina com uma entrega concreta, conectada ao objetivo do aluno.",
  },
  {
    icon: MessageSquareText,
    title: "Feedback humano",
    description:
      "O professor valida a missao, orienta melhorias e mantem a jornada confiavel.",
  },
  {
    icon: Trophy,
    title: "XP, niveis e conquistas",
    description:
      "Progresso visivel transforma aprendizado em evolucao, sem perder rigor.",
  },
  {
    icon: Bot,
    title: "Boss Final",
    description:
      "A trilha culmina na criacao de um produto com IA, apresentavel e validado.",
  },
];

export default async function HomePage() {
  const session = await getSessionUser();
  const primaryHref = session
    ? dashboardPathForRole(session.appUser.role)
    : "/cadastro";

  return (
    <div className="min-h-screen overflow-hidden bg-[#070A12] text-white">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(22,217,227,0.22),transparent_32%),radial-gradient(circle_at_78%_10%,rgba(109,93,247,0.24),transparent_30%),linear-gradient(180deg,#070A12_0%,#0B1020_48%,#070A12_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(244,247,251,0.045)_1px,transparent_1px),linear-gradient(90deg,rgba(244,247,251,0.045)_1px,transparent_1px)] bg-[size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_78%)]" />
      </div>

      <header className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex size-9 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-200 shadow-[0_0_24px_rgba(22,217,227,0.24)]">
            <Sparkles className="size-5" />
          </span>
          <span>IA para Vida Real</span>
        </Link>
        <nav className="flex items-center gap-2">
          {session ? (
            <Button
              asChild
              className="bg-white text-[#070A12] hover:bg-cyan-100"
            >
              <Link href={dashboardPathForRole(session.appUser.role)}>
                Ir para o portal <ArrowRight />
              </Link>
            </Button>
          ) : (
            <>
              <Button
                variant="ghost"
                asChild
                className="text-slate-200 hover:bg-white/10 hover:text-white"
              >
                <Link href="/login">Entrar</Link>
              </Button>
              <Button
                asChild
                className="bg-white text-[#070A12] hover:bg-cyan-100"
              >
                <Link href="/cadastro">Iniciar jornada</Link>
              </Button>
            </>
          )}
        </nav>
      </header>

      <main className="flex-1">
        <section className="container grid min-h-[calc(100vh-4rem)] items-center gap-10 py-10 lg:grid-cols-[1fr_0.9fr] lg:py-16">
          <Appear className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-1.5 text-sm font-medium text-cyan-100">
              <Zap className="size-4 text-cyan-200" />
              Uma jornada gamificada ate seu produto com IA
            </span>
            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-white md:text-6xl">
              Desbloqueie sua evolucao em IA, missao por missao.
            </h1>
            <p className="mt-5 max-w-2xl text-balance text-lg leading-8 text-slate-300">
              Voce nao esta entrando em um curso comum. Esta iniciando uma
              trilha de evolucao com XP, niveis, feedback humano e um Boss
              Final: criar um produto real com IA.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button
                size="lg"
                asChild
                className="bg-cyan-200 text-[#07111f] hover:bg-cyan-100"
              >
                <Link href={primaryHref}>
                  {session ? "Continuar jornada" : "Iniciar jornada"}
                  <ArrowRight />
                </Link>
              </Button>
              {!session ? (
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                >
                  <Link href="/login">Ja tenho conta</Link>
                </Button>
              ) : null}
            </div>

            <div className="mt-8 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <ProofPoint value="8 fases" label="do despertar ao Boss Final" />
              <ProofPoint value="XP real" label="ganho por missao aprovada" />
              <ProofPoint value="Mentoria" label="feedback humano no loop" />
            </div>
          </Appear>

          <Appear delay={0.15}>
            <HeroCockpit />
          </Appear>
        </section>

        <section className="container py-12">
          <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
                Do zero ao produto
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                Uma trilha de evolucao com fases claras
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-slate-300">
              Cada fase ensina uma habilidade pratica de IA e prepara o aluno
              para o proximo desbloqueio.
            </p>
          </div>

          <Stagger
            className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8"
            gap={0.06}
          >
            {phaseRows.map((phase, index) => (
              <StaggerItem key={phase.name} className="h-full">
              <article
                className="group relative h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-2xl shadow-black/20 transition-colors hover:border-cyan-300/30"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1 bg-gradient-to-r ${phase.tone}`}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400">
                    Fase {index + 1}
                  </span>
                  {index < phaseRows.length - 1 ? (
                    <ChevronRight className="size-4 text-slate-500" />
                  ) : (
                    <Trophy className="size-4 text-amber-200" />
                  )}
                </div>
                <div className="mt-5 flex size-10 items-center justify-center rounded-xl border border-white/10 bg-white/10">
                  <phase.icon className="size-5 text-cyan-100" />
                </div>
                <h3 className="mt-4 font-semibold text-white">{phase.name}</h3>
                <p className="mt-2 text-sm font-medium text-slate-200">
                  {phase.title}
                </p>
                <p className="mt-2 text-sm leading-6 text-slate-400">
                  {phase.description}
                </p>
              </article>
              </StaggerItem>
            ))}
          </Stagger>
        </section>

        <Stagger className="container grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-4">
          {valuePillars.map((pillar) => (
            <StaggerItem key={pillar.title} className="h-full">
            <article
              className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/10"
            >
              <div className="flex size-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-100">
                <pillar.icon className="size-5" />
              </div>
              <h3 className="mt-5 font-semibold text-white">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                {pillar.description}
              </p>
            </article>
            </StaggerItem>
          ))}
        </Stagger>

        <section className="container pb-16 pt-8">
          <Reveal className="overflow-hidden rounded-3xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 via-violet-400/10 to-white/[0.03] p-6 text-center shadow-[0_0_60px_rgba(22,217,227,0.12)] md:p-10">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-cyan-200">
              Boss Final
            </p>
            <h2 className="mx-auto mt-3 max-w-2xl text-3xl font-bold tracking-tight md:text-4xl">
              Aprenda IA criando algo que pode ser apresentado.
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-slate-300">
              A jornada termina com problema, solucao, arquitetura, prototipo e
              validacao. O resultado nao e so certificado: e produto.
            </p>
            <Button
              size="lg"
              asChild
              className="mt-7 bg-white text-[#070A12] hover:bg-cyan-100"
            >
              <Link href={primaryHref}>
                {session ? "Abrir portal" : "Comecar agora"}
                <ArrowRight />
              </Link>
            </Button>
          </Reveal>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="container py-6 text-center text-sm text-slate-500">
          IA para Vida Real - evolucao pratica em IA, validada por missoes.
        </div>
      </footer>
    </div>
  );
}

function ProofPoint({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
      <p className="font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}

function HeroCockpit() {
  return (
    <div className="relative mx-auto w-full max-w-xl">
      <div className="absolute -inset-8 rounded-full bg-cyan-300/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#0E1424]/90 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.45)]">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-200">
              Cockpit do aluno
            </p>
            <p className="mt-1 text-lg font-semibold">Agente em evolucao</p>
          </div>
          <span className="rounded-full border border-emerald-300/30 bg-emerald-300/10 px-3 py-1 text-xs font-medium text-emerald-200">
            Nivel 04
          </span>
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
            <HeroAgentCore />
            <div className="mt-4 rounded-xl bg-black/20 p-3">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>XP para proxima fase</span>
                <span>72%</span>
              </div>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[72%] rounded-full bg-gradient-to-r from-cyan-200 to-emerald-300" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="size-4 text-emerald-200" />
                Proxima missao
              </div>
              <p className="mt-2 text-sm text-slate-300">
                Desenhar a arquitetura do primeiro agente de IA.
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs text-amber-100">
                <Zap className="size-3.5" />
                +120 XP ao aprovar
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <MiniMetric label="Missoes" value="18/27" />
              <MiniMetric label="Badges" value="06" />
            </div>

            <div className="rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <CheckCircle2 className="size-4 text-violet-100" />
                Rota ate o Boss Final
              </div>
              <div className="mt-4 flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((item) => (
                  <div
                    key={item}
                    className="h-2 flex-1 rounded-full bg-gradient-to-r from-cyan-200 to-violet-300"
                  />
                ))}
                <div className="h-2 flex-1 rounded-full bg-white/15" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4">
      <p className="text-2xl font-bold tabular-nums text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-400">{label}</p>
    </div>
  );
}
