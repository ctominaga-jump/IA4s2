import { requireStudentContext } from "@/lib/auth/session";
import {
  getActiveLearningGoal,
  getAllLevels,
  getStudentMissionData,
  resolveLevelProgress,
} from "@/server/student-data";
import { GoalCard } from "@/components/goal-card";
import { AvatarPicker } from "@/components/game/avatar-picker";
import {
  ProfileView,
  type ProfileViewModel,
} from "@/components/game/profile-view";

export const dynamic = "force-dynamic";

const JOURNEY_PHASE_COUNT = 7;

export default async function StudentProfilePage() {
  const { appUser, studentProfile } = await requireStudentContext();

  const [goal, levels, missionData] = await Promise.all([
    getActiveLearningGoal(studentProfile.active_learning_goal_id),
    getAllLevels(),
    getStudentMissionData(studentProfile.id),
  ]);

  const progress = resolveLevelProgress(studentProfile.total_xp, levels);
  const approvedCount = missionData.counts.approved;

  const currentPhaseIndex =
    missionData.total > 0
      ? Math.min(
          JOURNEY_PHASE_COUNT - 1,
          Math.floor((approvedCount / missionData.total) * JOURNEY_PHASE_COUNT),
        )
      : 0;

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
  };

  return (
    <ProfileView
      vm={vm}
      goalSlot={<GoalCard goal={goal} />}
      avatarPickerSlot={<AvatarPicker current={studentProfile.avatar_variant} />}
    />
  );
}
