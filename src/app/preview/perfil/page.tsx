import { notFound } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import { GoalCard } from "@/components/goal-card";
import { AvatarPicker } from "@/components/game/avatar-picker";
import {
  ProfileView,
  type ProfileViewModel,
} from "@/components/game/profile-view";
import type { LearningGoalRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

/** Preview SEM autenticacao do perfil/identidade, apenas para screenshot. */

const VM: ProfileViewModel = {
  name: "Marina Souza",
  email: "marina@example.com",
  avatarVariant: "aurora",
  levelNumber: 3,
  levelTitle: "Praticante de IA",
  nextLevelTitle: "Construtor",
  totalXp: 320,
  levelProgressPercent: 64,
  xpForNext: 180,
  currentPhaseIndex: 3,
  approvedCount: 3,
  totalMissions: 5,
  approvedMissions: [
    { id: "m1", title: "Crie um prompt claro", xpReward: 50 },
    { id: "m2", title: "Resolva uma tarefa real com IA", xpReward: 60 },
    { id: "m3", title: "Revise e melhore um texto com IA", xpReward: 70 },
  ],
  inProgressMissions: [
    { id: "m4", title: "Planeje um objetivo em passos", status: "pending" },
  ],
};

const GOAL: LearningGoalRow = {
  id: "goal-preview",
  student_profile_id: "sp-preview",
  title: "Usar IA para acelerar meus estudos de programacao",
  description:
    "Quero aprender a pesquisar, validar e prototipar com IA para evoluir mais rapido na faculdade.",
  category: "study",
  status: "active",
  created_at: "2026-05-20T12:00:00.000Z",
  updated_at: "2026-05-20T12:00:00.000Z",
};

export default function ProfilePreviewPage() {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  return (
    <StudentGameShell
      userName={VM.name}
      totalXp={VM.totalXp}
      levelLabel={`Nv ${VM.levelNumber} · ${VM.levelTitle}`}
    >
      <ProfileView
        vm={VM}
        goalSlot={<GoalCard goal={GOAL} />}
        avatarPickerSlot={<AvatarPicker current={VM.avatarVariant} />}
      />
    </StudentGameShell>
  );
}
