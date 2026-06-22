import { notFound } from "next/navigation";

import { StudentGameShell } from "@/components/game/student-game-shell";
import { GoalCard } from "@/components/goal-card";
import { AvatarPicker } from "@/components/game/avatar-picker";
import {
  ProfileView,
  type ProfileViewModel,
} from "@/components/game/profile-view";
import type { AvatarVariant, LearningGoalRow } from "@/lib/database.types";

export const dynamic = "force-dynamic";

/**
 * Preview SEM autenticação do perfil/identidade, apenas para screenshot.
 * `?variant=` troca a identidade; `?fallback=1` força o AvatarFigure 2D.
 */

const VARIANTS: AvatarVariant[] = ["aurora", "ember", "verdant", "nebula"];

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
  title: "Usar IA para acelerar meus estudos de programação",
  description:
    "Quero aprender a pesquisar, validar e prototipar com IA para evoluir mais rápido na faculdade.",
  category: "study",
  status: "active",
  created_at: "2026-05-20T12:00:00.000Z",
  updated_at: "2026-05-20T12:00:00.000Z",
};

export default async function ProfilePreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ variant?: string; fallback?: string }>;
}) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { variant, fallback } = await searchParams;
  const avatarVariant: AvatarVariant = VARIANTS.includes(
    variant as AvatarVariant,
  )
    ? (variant as AvatarVariant)
    : VM.avatarVariant;
  const vm: ProfileViewModel = {
    ...VM,
    avatarVariant,
    avatar3d: !(fallback === "1" || fallback === "true"),
  };

  return (
    <StudentGameShell
      userName={vm.name}
      totalXp={vm.totalXp}
      levelLabel={`Nv ${vm.levelNumber} · ${vm.levelTitle}`}
    >
      <ProfileView
        vm={vm}
        goalSlot={<GoalCard goal={GOAL} />}
        avatarPickerSlot={<AvatarPicker current={vm.avatarVariant} />}
      />
    </StudentGameShell>
  );
}
