import { requireStudentContext } from "@/lib/auth/session";
import {
  getActiveLearningGoal,
  getStudentMissionData,
} from "@/server/student-data";
import { getJourneyPhases } from "@/server/content";
import {
  JourneyBoard,
  type JourneyBoardViewModel,
} from "@/components/game/journey-board";
import { buildJourneyMap } from "@/lib/journey";

export const dynamic = "force-dynamic";

export default async function JourneyPage() {
  const { studentProfile } = await requireStudentContext();
  const [missionData, phases, goal] = await Promise.all([
    getStudentMissionData(studentProfile.id),
    getJourneyPhases(),
    getActiveLearningGoal(studentProfile.active_learning_goal_id),
  ]);

  const { groups } = buildJourneyMap(
    phases,
    missionData.items,
    (item) => item.mission.phase_id,
    (item) => item.status,
  );

  const approved = missionData.counts.approved;
  const overallPercent =
    missionData.total > 0
      ? Math.round((approved / missionData.total) * 100)
      : 0;

  const vm: JourneyBoardViewModel = {
    courseTitle: missionData.courseTitle ?? "Sua jornada",
    courseDescription: missionData.courseDescription,
    goalTitle: goal?.title ?? null,
    overallApproved: approved,
    overallTotal: missionData.total,
    overallPercent,
    phases: groups.map((group) => ({
      number: group.phase.number,
      name: group.phase.name,
      tagline: group.phase.tagline,
      state: group.state,
      total: group.total,
      approved: group.approved,
      percent: group.percent,
      isBoss: group.phase.slug === "boss-final",
      missions: group.missions.map((item) => ({
        id: item.mission.id,
        title: item.mission.title,
        description: item.mission.description,
        status: item.status,
        xpReward: item.mission.xp_reward,
        difficulty: item.mission.difficulty,
        estimatedMinutes: item.mission.estimated_minutes,
      })),
    })),
  };

  return <JourneyBoard {...vm} />;
}
