import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  History,
  Target,
  User,
  XCircle,
  Zap,
} from "lucide-react";

import { requireTeacherContext } from "@/lib/auth/session";
import { aiEvaluationEnabled } from "@/lib/feature-flags";
import { getSubmissionDetail } from "@/server/teacher-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { SubmissionStatusBadge } from "@/components/status-badge";
import { GOAL_CATEGORY_LABEL } from "@/lib/domain";
import { ReviewForm } from "./review-form";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ submissionId: string }>;
}) {
  await requireTeacherContext();
  const { submissionId } = await params;

  const detail = await getSubmissionDetail(submissionId);
  if (!detail) notFound();

  const { submission, mission, student, feedback, previousAttempts } = detail;
  const alreadyReviewed = submission.status !== "pending";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button variant="ghost" size="sm" asChild className="text-muted-foreground">
        <Link href="/professor/fila">
          <ArrowLeft className="size-4" />
          Voltar para a fila
        </Link>
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">
            {mission?.title ?? "Entrega"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Tentativa {submission.attempt_number} · enviada em{" "}
            {formatDateTime(submission.submitted_at)}
          </p>
        </div>
        <SubmissionStatusBadge status={submission.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {/* Resposta do aluno — elemento central */}
          <Card className="border-primary/30">
            <CardHeader>
              <CardTitle className="text-base">Resposta do aluno</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-line rounded-lg bg-muted/40 p-4 text-sm">
                {submission.content}
              </p>
            </CardContent>
          </Card>

          {/* Contexto da missao */}
          {mission ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Contexto da missão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="font-medium">Objetivo de aprendizagem</p>
                  <p className="text-muted-foreground">
                    {mission.learning_objective}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Instrucoes</p>
                  <p className="whitespace-pre-line text-muted-foreground">
                    {mission.instructions}
                  </p>
                </div>
                <div>
                  <p className="font-medium">Entrega esperada</p>
                  <p className="text-muted-foreground">
                    {mission.expected_submission}
                  </p>
                </div>
                {mission.acceptance_criteria ? (
                  <div className="rounded-lg border border-primary/30 bg-primary/5 p-3">
                    <p className="flex items-center gap-2 font-medium text-primary">
                      <CheckCircle2 className="size-4" />
                      Critério de aprovacao
                    </p>
                    <p className="mt-1 text-muted-foreground">
                      {mission.acceptance_criteria}
                    </p>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ) : null}

          {/* Tentativas anteriores */}
          {previousAttempts.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <History className="size-4 text-muted-foreground" />
                  Tentativas anteriores ({previousAttempts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {previousAttempts.map(({ submission: prev, feedback: fb }) => (
                  <div key={prev.id} className="rounded-lg border p-3 text-sm">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="font-medium">
                        Tentativa {prev.attempt_number}
                      </span>
                      <SubmissionStatusBadge status={prev.status} />
                    </div>
                    <p className="whitespace-pre-line text-muted-foreground">
                      {prev.content}
                    </p>
                    {fb ? (
                      <p className="mt-2 rounded bg-muted/50 p-2 text-xs">
                        <span className="font-medium">Feedback:</span>{" "}
                        {fb.comment}
                      </p>
                    ) : null}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {/* Avaliação */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avaliação</CardTitle>
            </CardHeader>
            <CardContent>
              {alreadyReviewed ? (
                <Alert
                  variant={
                    submission.status === "approved" ? "success" : "destructive"
                  }
                >
                  {submission.status === "approved" ? (
                    <CheckCircle2 />
                  ) : (
                    <XCircle />
                  )}
                  <AlertTitle>
                    {submission.status === "approved"
                      ? "Entrega aprovada"
                      : "Entrega reprovada"}
                  </AlertTitle>
                  <AlertDescription className="space-y-1">
                    <p>{feedback?.comment ?? "Sem comentário registrado."}</p>
                    {submission.reviewed_at ? (
                      <p className="text-xs opacity-80">
                        Avaliada em {formatDateTime(submission.reviewed_at)}
                      </p>
                    ) : null}
                  </AlertDescription>
                </Alert>
              ) : (
                <ReviewForm
                  submissionId={submission.id}
                  xpReward={mission?.xp_reward ?? 0}
                  aiEnabled={aiEvaluationEnabled()}
                />
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel lateral: aluno + objetivo + XP */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aluno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <User className="size-4 text-muted-foreground" />
                {student.name}
              </p>
              {student.goal ? (
                <div className="rounded-lg bg-accent/40 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Target className="size-3.5" />
                    Objetivo real
                  </p>
                  <p className="mt-1 font-medium">{student.goal.title}</p>
                  {student.goal.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {student.goal.description}
                    </p>
                  ) : null}
                  {student.goal.category ? (
                    <Badge variant="secondary" className="mt-2">
                      {GOAL_CATEGORY_LABEL[student.goal.category]}
                    </Badge>
                  ) : null}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Este aluno ainda não registrou um objetivo.
                </p>
              )}
            </CardContent>
          </Card>

          {mission ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recompensa</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="secondary" className="gap-1 text-sm">
                  <Zap className="size-4" />
                  {mission.xp_reward} XP na aprovacao
                </Badge>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                  <Clock className="size-3" />
                  O XP e concedido apenas uma vez por missão.
                </p>
              </CardContent>
            </Card>
          ) : null}
        </div>
      </div>
    </div>
  );
}
