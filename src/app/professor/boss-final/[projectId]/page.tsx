import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Crown,
  Target,
  User,
  XCircle,
} from "lucide-react";

import { requireTeacherContext } from "@/lib/auth/session";
import { getBossProjectDetail } from "@/server/boss-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { BOSS_STAGES } from "@/components/game/boss-stages";
import {
  BOSS_PROJECT_STATUS_LABEL,
  BOSS_PROJECT_STATUS_VARIANT,
  GOAL_CATEGORY_LABEL,
} from "@/lib/domain";
import { formatDateTime } from "@/lib/utils";
import { BossReviewForm } from "./boss-review-form";

export const dynamic = "force-dynamic";

export default async function BossProjectDetailPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  await requireTeacherContext();
  const { projectId } = await params;

  const detail = await getBossProjectDetail(projectId);
  if (!detail) notFound();

  const { project, studentName, goal } = detail;
  const isPending = project.status === "submitted";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Button
        variant="ghost"
        size="sm"
        asChild
        className="text-muted-foreground"
      >
        <Link href="/professor/boss-final">
          <ArrowLeft className="size-4" />
          Voltar para os projetos finais
        </Link>
      </Button>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-xl bg-warning/15 text-warning">
            <Crown className="size-5" />
          </span>
          <div>
            <h1 className="text-2xl font-bold">
              {project.title || "Projeto final"}
            </h1>
            <p className="text-sm text-muted-foreground">
              {project.submitted_at
                ? `Enviado em ${formatDateTime(project.submitted_at)}`
                : "Ainda nao enviado"}
            </p>
          </div>
        </div>
        <Badge variant={BOSS_PROJECT_STATUS_VARIANT[project.status]}>
          {BOSS_PROJECT_STATUS_LABEL[project.status]}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {BOSS_STAGES.map((stage) => {
            const Icon = stage.icon;
            return (
              <Card key={stage.key}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <Icon className="size-4 text-primary" />
                    Etapa {stage.number} · {stage.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-line rounded-lg bg-muted/40 p-4 text-sm leading-6">
                    {project[stage.key]?.trim() || "—"}
                  </p>
                </CardContent>
              </Card>
            );
          })}

          {/* Avaliacao */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Avaliacao</CardTitle>
            </CardHeader>
            <CardContent>
              {isPending ? (
                <BossReviewForm projectId={project.id} />
              ) : project.status === "draft" ? (
                <p className="text-sm text-muted-foreground">
                  O aluno ainda nao enviou este projeto para validacao.
                </p>
              ) : (
                <Alert
                  variant={
                    project.status === "approved" ? "success" : "destructive"
                  }
                >
                  {project.status === "approved" ? (
                    <CheckCircle2 />
                  ) : (
                    <XCircle />
                  )}
                  <AlertTitle>
                    {project.status === "approved"
                      ? "Projeto final aprovado"
                      : "Projeto reprovado — aluno pode reenviar"}
                  </AlertTitle>
                  <AlertDescription className="space-y-1">
                    <p>{project.feedback ?? "Sem comentario registrado."}</p>
                    {project.reviewed_at ? (
                      <p className="text-xs opacity-80">
                        Avaliado em {formatDateTime(project.reviewed_at)}
                      </p>
                    ) : null}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Painel lateral: aluno + objetivo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Aluno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="flex items-center gap-2 font-medium">
                <User className="size-4 text-muted-foreground" />
                {studentName}
              </p>
              {goal ? (
                <div className="rounded-lg bg-accent/40 p-3">
                  <p className="flex items-center gap-2 text-xs font-medium text-primary">
                    <Target className="size-3.5" />
                    Objetivo real
                  </p>
                  <p className="mt-1 font-medium">{goal.title}</p>
                  {goal.description ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {goal.description}
                    </p>
                  ) : null}
                  {goal.category ? (
                    <Badge variant="secondary" className="mt-2">
                      {GOAL_CATEGORY_LABEL[goal.category]}
                    </Badge>
                  ) : null}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  Este aluno ainda nao registrou um objetivo.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
