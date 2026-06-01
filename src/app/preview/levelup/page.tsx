import { notFound } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import {
  StudentCockpit,
  type CockpitViewModel,
} from "@/components/game/student-cockpit";
import { LevelUpCelebration } from "@/components/game/level-up-celebration";

export const dynamic = "force-dynamic";

/** Preview SEM auth da celebracao de level up (forceShow), apenas screenshot. */

const VM: CockpitViewModel = {
  firstName: "Marina",
  totalXp: 500,
  levelNumber: 4,
  levelTitle: "Construtor",
  nextLevelTitle: "Autonomia com IA",
  levelProgressPercent: 12,
  xpForNext: 300,
  avatarVariant: "nebula",
  approvedCount: 4,
  totalMissions: 5,
  overallPercent: 80,
  currentPhaseIndex: 4,
  counts: { not_started: 1, pending: 0, approved: 4, rejected: 0 },
  nextMission: {
    id: "preview-mission",
    title: "Use IA para aprender algo novo",
    description: "Escolha um tema e use IA como tutor para dar o primeiro passo.",
    xpReward: 100,
    status: "not_started",
  },
  allDone: false,
  recentFeedback: [],
  goal: null,
};

export default function LevelUpPreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <StudentGameShell
      userName="Marina Souza"
      totalXp={VM.totalXp}
      levelLabel={`Nv ${VM.levelNumber} · ${VM.levelTitle}`}
    >
      <LevelUpCelebration
        currentLevelNumber={VM.levelNumber}
        levelTitle={VM.levelTitle}
        forceShow
      />
      <StudentCockpit {...VM} />
    </StudentGameShell>
  );
}
