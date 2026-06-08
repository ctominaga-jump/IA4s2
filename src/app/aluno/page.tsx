import { requireStudentContext } from "@/lib/auth/session";
import {
  getActiveLearningGoal,
  getAllLevels,
  getStudentMissionData,
  resolveLevelProgress,
} from "@/server/student-data";
import { getJourneyPhases } from "@/server/content";
import { buildJourneyMap, resolveCurrentPhaseIndex } from "@/lib/journey";
import {
  StudentCockpit,
  type CockpitViewModel,
} from "@/components/game/student-cockpit";
import { GOAL_CATEGORY_LABEL } from "@/lib/domain";
import { avatar3dEnabledInApp } from "@/lib/feature-flags";
import { formatDateTime } from "@/lib/utils";
import type { GoalCategory } from "@/lib/database.types";

export const dynamic = "force-dynamic";

export default async function StudentDashboardPage() {
  const { appUser, studentProfile } = await requireStudentContext();

  const [goal, levels, missionData, phases] = await Promise.all([
    getActiveLearningGoal(studentProfile.active_learning_goal_id),
    getAllLevels(),
    getStudentMissionData(studentProfile.id),
    getJourneyPhases(),
  ]);

  const progress = resolveLevelProgress(studentProfile.total_xp, levels);
  const firstName = appUser.name.split(" ")[0] ?? appUser.name;

  const nextMission =
    missionData.items.find((item) => item.status === "rejected") ??
    missionData.items.find((item) => item.status === "not_started") ??
    null;

  const approvedCount = missionData.counts.approved;
  const overallPercent =
    missionData.total > 0
      ? Math.round((approvedCount / missionData.total) * 100)
      : 0;

  const journeyMap = buildJourneyMap(
    phases,
    missionData.items,
    (item) => item.mission.phase_id,
    (item) => item.status,
  );
  const currentPhaseIndex = resolveCurrentPhaseIndex(journeyMap);

  const recentFeedback = missionData.items
    .filter((item) => item.latestFeedback)
    .sort(
      (a, b) =>
        new Date(b.latestFeedback!.created_at).getTime() -
        new Date(a.latestFeedback!.created_at).getTime(),
    )
    .slice(0, 3);

  const vm: CockpitViewModel = {
    firstName,
    totalXp: studentProfile.total_xp,
    levelNumber: progress.current?.number ?? 1,
    levelTitle: progress.current?.title ?? "Explorador",
    nextLevelTitle: progress.next?.title ?? null,
    levelProgressPercent: progress.progressPercent,
    xpForNext: progress.xpForNext,
    avatarVariant: studentProfile.avatar_variant,
    approvedCount,
    totalMissions: missionData.total,
    overallPercent,
    currentPhaseIndex,
    counts: missionData.counts,
    nextMission: nextMission
      ? {
          id: nextMission.mission.id,
          title: nextMission.mission.title,
          description: nextMission.mission.description,
          xpReward: nextMission.mission.xp_reward,
          status: nextMission.status,
        }
      : null,
    allDone: approvedCount === missionData.total && missionData.total > 0,
    recentFeedback: recentFeedback.map((item) => ({
      id: item.latestFeedback!.id,
      missionId: item.mission.id,
      missionTitle: item.mission.title,
      approved: item.latestFeedback!.decision === "approved",
      comment: item.latestFeedback!.comment,
      createdAt: formatDateTime(item.latestFeedback!.created_at),
    })),
    goal: goal
      ? {
          title: goal.title,
          description: goal.description,
          categoryLabel: goal.category
            ? GOAL_CATEGORY_LABEL[goal.category as GoalCategory]
            : null,
        }
      : null,
    avatar3d: avatar3dEnabledInApp(),
  };

  return <StudentCockpit {...vm} />;
}
