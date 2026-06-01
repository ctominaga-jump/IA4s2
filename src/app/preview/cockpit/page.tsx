import { notFound } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import {
  StudentCockpit,
  type CockpitViewModel,
} from "@/components/game/student-cockpit";

export const dynamic = "force-dynamic";

/**
 * Rota de preview SEM autenticacao usada apenas para validacao visual por
 * screenshot (Visual Reviewer / QA). Renderiza o cockpit com dados ficticios,
 * sem tocar em Supabase, XP, review ou auth. Nunca disponivel em producao.
 */

const VM: CockpitViewModel = {
  firstName: "Marina",
  totalXp: 320,
  levelNumber: 3,
  levelTitle: "Praticante de IA",
  nextLevelTitle: "Construtor",
  levelProgressPercent: 64,
  xpForNext: 180,
  avatarVariant: "aurora",
  approvedCount: 3,
  totalMissions: 5,
  overallPercent: 60,
  currentPhaseIndex: 3,
  counts: { not_started: 1, pending: 1, approved: 3, rejected: 0 },
  nextMission: {
    id: "preview-mission",
    title: "Transforme um prompt fraco em um prompt forte",
    description:
      "Pegue um prompt generico e reescreva com objetivo, contexto, formato e criterios. Compare as duas respostas e justifique a melhor escolha.",
    xpReward: 80,
    status: "not_started",
  },
  allDone: false,
  recentFeedback: [
    {
      id: "fb-1",
      missionId: "m-1",
      missionTitle: "Compare duas respostas de IA",
      approved: true,
      comment:
        "Otima analise de criterios. Voce justificou bem por que a segunda resposta era mais confiavel. Continue assim.",
      createdAt: "28/05/2026 14:32",
    },
    {
      id: "fb-2",
      missionId: "m-2",
      missionTitle: "Crie uma playlist inteligente com IA",
      approved: true,
      comment:
        "Boa entrega. Na proxima, descreva o passo a passo do prompt que usou para gerar a lista.",
      createdAt: "26/05/2026 09:10",
    },
  ],
  goal: {
    title: "Usar IA para acelerar meus estudos de programacao",
    description:
      "Quero aprender a pesquisar, validar e prototipar com IA para evoluir mais rapido na faculdade.",
    categoryLabel: "Estudos",
  },
};

export default function CockpitPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <StudentGameShell
      userName="Marina Souza"
      totalXp={VM.totalXp}
      levelLabel={`Nv ${VM.levelNumber} · ${VM.levelTitle}`}
    >
      <StudentCockpit {...VM} />
    </StudentGameShell>
  );
}
