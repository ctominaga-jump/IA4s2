import { requireStudentContext } from "@/lib/auth/session";
import { getStudentMissionData } from "@/server/student-data";
import { getBossProjectForStudent } from "@/server/boss-data";
import {
  BossFinalHub,
  type BossFinalViewModel,
} from "@/components/game/boss-final-hub";
import {
  BOSS_STAGES,
  countFilledStages,
  isBossProjectComplete,
} from "@/components/game/boss-stages";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BossFinalPage({
  searchParams,
}: {
  searchParams: Promise<{ enviado?: string }>;
}) {
  const { studentProfile } = await requireStudentContext();

  const [project, missionData, { enviado }] = await Promise.all([
    getBossProjectForStudent(studentProfile.id),
    getStudentMissionData(studentProfile.id),
    searchParams,
  ]);

  const approved = missionData.counts.approved;
  const total = missionData.total;

  const stages = Object.fromEntries(
    BOSS_STAGES.map((stage) => [stage.key, project?.[stage.key] ?? ""]),
  ) as BossFinalViewModel["stages"];

  const vm: BossFinalViewModel = {
    status: project?.status ?? "draft",
    title: project?.title ?? "",
    stages,
    feedback: project?.feedback ?? null,
    reviewedAt: project?.reviewed_at
      ? formatDateTime(project.reviewed_at)
      : null,
    submittedAt: project?.submitted_at
      ? formatDateTime(project.submitted_at)
      : null,
    filledCount: countFilledStages(project),
    isComplete: isBossProjectComplete(project),
    journeyApproved: approved,
    journeyTotal: total,
    journeyComplete: total > 0 && approved === total,
    justSubmitted: enviado === "1",
  };

  return <BossFinalHub {...vm} />;
}
