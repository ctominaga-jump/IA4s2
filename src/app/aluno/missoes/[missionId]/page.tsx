import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  ListChecks,
  MessageSquareText,
  RotateCcw,
  Target,
  Timer,
  Trophy,
  Zap,
} from "lucide-react";

import { requireStudentContext } from "@/lib/auth/session";
import {
  getActiveLearningGoal,
  getMissionStateForStudent,
} from "@/server/student-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MissionStatusBadge } from "@/components/status-badge";
import { SubmissionForm } from "./submission-form";
import { formatDateTime } from "@/lib/utils";
import {
  MISSION_DIFFICULTY_LABEL,
  MISSION_DIFFICULTY_VARIANT,
} from "@/lib/domain";

export const dynamic = "force-dynamic";

export default async function MissionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ missionId: string }>;
  searchParams: Promise<{ enviada?: string }>;
}) {
  const { missionId } = await params;
  const { studentProfile } = await requireStudentContext();

  const [state, goal, { enviada }] = await Promise.all([
    getMissionStateForStudent(studentProfile.id, missionId),
    getActiveLearningGoal(studentProfile.active_learning_goal_id),
    searchParams,
  ]);

  if (!state) notFound();

  const { mission, status, latestSubmission, latestFeedback } = state;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
        <Link href="/aluno/missoes">
          <ArrowLeft className="size-4" />
          Voltar para a jornada
        </Link>
      </Button>

      {enviada ? (
        <Alert variant="success">
          <CheckCircle2 />
          <AlertTitle>Entrega enviada!</AlertTitle>
          <AlertDescription>
            Sua entrega está aguardando validação de um professor. Você verá o
            feedback aqui.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <MissionStatusBadge status={status} />
          <Badge variant={MISSION_DIFFICULTY_VARIANT[mission.difficulty]}>
            {MISSION_DIFFICULTY_LABEL[mission.difficulty]}
          </Badge>
          <Badge variant="muted" className="gap-1">
            <Timer className="size-3" />
            {mission.estimated_minutes} min
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Zap className="size-3" />
            {mission.xp_reward} XP
          </Badge>
        </div>
        <h1 className="text-2xl font-bold">{mission.title}</h1>
        <p className="text-muted-foreground">{mission.description}</p>
      </div>

      {goal ? (
        <div className="flex items-center gap-2 rounded-lg border bg-accent/40 px-4 py-3 text-sm">
          <Target className="size-4 shrink-0 text-primary" />
          <span>
            Lembre-se do seu objetivo:{" "}
            <span className="font-medium text-foreground">{goal.title}</span>
          </span>
        </div>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="size-4 text-primary" />
            Objetivo de aprendizagem
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm">{mission.learning_objective}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="size-4 text-primary" />
            Instrucoes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <p className="whitespace-pre-line">{mission.instructions}</p>
          <div className="rounded-lg bg-muted/50 p-4">
            <p className="font-medium">O que você deve entregar</p>
            <p className="mt-1 text-muted-foreground">
              {mission.expected_submission}
            </p>
          </div>
        </CardContent>
      </Card>

      {mission.acceptance_criteria ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Trophy className="size-4 text-primary" />
              Critério de aceite
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {mission.acceptance_criteria}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Feedback recebido */}
      {latestFeedback ? (
        <Alert variant={latestFeedback.decision === "approved" ? "success" : "destructive"}>
          {latestFeedback.decision === "approved" ? (
            <CheckCircle2 />
          ) : (
            <RotateCcw />
          )}
          <AlertTitle>
            {latestFeedback.decision === "approved"
              ? "Missão aprovada!"
              : "Entrega reprovada — veja como melhorar"}
          </AlertTitle>
          <AlertDescription className="space-y-1">
            <p>{latestFeedback.comment}</p>
            <p className="text-xs opacity-80">
              Avaliada em {formatDateTime(latestFeedback.created_at)}
            </p>
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Ultima entrega enviada */}
      {latestSubmission ? (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MessageSquareText className="size-4 text-primary" />
              Sua ultima entrega (tentativa {latestSubmission.attempt_number})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="whitespace-pre-line rounded-lg bg-muted/40 p-3 text-sm">
              {latestSubmission.content}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="size-3" />
              Enviada em {formatDateTime(latestSubmission.submitted_at)}
            </p>
          </CardContent>
        </Card>
      ) : null}

      {/* Area de acao conforme status */}
      <Card>
        <CardContent className="pt-6">
          {status === "approved" ? (
            <div className="flex items-center gap-3 text-sm">
              <CheckCircle2 className="size-5 text-success" />
              <p>
                Esta missão já foi aprovada e não aceita novo envio. Você ganhou{" "}
                <span className="font-medium">{mission.xp_reward} XP</span>.
              </p>
            </div>
          ) : status === "pending" ? (
            <div className="flex items-center gap-3 text-sm">
              <Clock className="size-5 text-warning" />
              <p>
                Sua entrega está aguardando validação. Você poderá reenviar
                apenas se ela for reprovada.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm font-medium">
                {status === "rejected"
                  ? "Revise com base no feedback e reenvie sua entrega."
                  : "Pronto para começar? Escreva e envie sua entrega."}
              </p>
              <SubmissionForm
                missionId={mission.id}
                isResubmission={status === "rejected"}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
