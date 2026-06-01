import { Badge } from "@/components/ui/badge";
import {
  MISSION_STATUS_LABEL,
  MISSION_STATUS_VARIANT,
  SUBMISSION_STATUS_LABEL,
  SUBMISSION_STATUS_VARIANT,
  type MissionStatus,
} from "@/lib/domain";
import type { SubmissionStatus } from "@/lib/database.types";

export function MissionStatusBadge({ status }: { status: MissionStatus }) {
  return (
    <Badge variant={MISSION_STATUS_VARIANT[status]}>
      {MISSION_STATUS_LABEL[status]}
    </Badge>
  );
}

export function SubmissionStatusBadge({
  status,
}: {
  status: SubmissionStatus;
}) {
  return (
    <Badge variant={SUBMISSION_STATUS_VARIANT[status]}>
      {SUBMISSION_STATUS_LABEL[status]}
    </Badge>
  );
}
