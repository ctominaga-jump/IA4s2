import { requireStudentContext } from "@/lib/auth/session";
import {
  getActiveLearningGoal,
  getAllLevels,
  getStudentMissionData,
  resolveLevelProgress,
} from "@/server/student-data";
import { getJourneyPhases } from "@/server/content";
import { buildJourneyMap, resolveCurrentPhaseIndex } from "@/lib/journey";
import { GoalCard } from "@/components/goal-card";
import { AvatarPicker } from "@/components/game/avatar-picker";
import { avatar3dEnabledInApp } from "@/lib/feature-flags";
import {
  ProfileView,
  type ProfileViewModel,
} from "@/components/game/profile-view";

export const dynamic = "force-dynamic";

export default async function StudentProfilePage() {
  const { appUser, studentProfile } = await requireStudentContext();

  const [goal, levels, missionData, phases] = await Promise.all([
    getActiveLearningGoal(studentProfile.active_learning_goal_id),
    getAllLevels(),
    getStudentMissionData(studentProfile.id),
    getJourneyPhases(),
  ]);

  const progress = resolveLevelProgress(studentProfile.total_xp, levels);
  const approvedCount = missionData.counts.approved;

  const journeyMap = buildJourneyMap(
    phases,
    missionData.items,
    (item) => item.mission.phase_id,
    (item) => item.status,
  );
  const currentPhaseIndex = resolveCurrentPhaseIndex(journeyMap);

  const vm: ProfileViewModel = {
    name: appUser.name,
    email: appUser.email,
    avatarVariant: studentProfile.avatar_variant,
    levelNumber: progress.current?.number ?? 1,
    levelTitle: progress.current?.title ?? "Explorador",
    nextLevelTitle: progress.next?.title ?? null,
    totalXp: studentProfile.total_xp,
    levelProgressPercent: progress.progressPercent,
    xpForNext: progress.xpForNext,
    currentPhaseIndex,
    approvedCount,
    totalMissions: missionData.total,
    approvedMissions: missionData.items
      .filter((item) => item.status === "approved")
      .map((item) => ({
        id: item.mission.id,
        title: item.mission.title,
        xpReward: item.mission.xp_reward,
      })),
    inProgressMissions: missionData.items
      .filter(
        (item) => item.status === "pending" || item.status === "rejected",
      )
      .map((item) => ({
        id: item.mission.id,
        title: item.mission.title,
        status: item.status as "pending" | "rejected",
      })),
    avatar3d: avatar3dEnabledInApp(),
  };

  return (
    <ProfileView
      vm={vm}
      goalSlot={<GoalCard goal={goal} />}
      avatarPickerSlot={<AvatarPicker current={studentProfile.avatar_variant} />}
    />
  );
}
