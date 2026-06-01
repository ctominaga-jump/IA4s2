import Link from "next/link";
import { Crown } from "lucide-react";

import { requireTeacherContext } from "@/lib/auth/session";
import { getBossProjectQueue } from "@/server/boss-data";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2 } from "lucide-react";
import {
  BOSS_PROJECT_STATUS_LABEL,
  BOSS_PROJECT_STATUS_VARIANT,
} from "@/lib/domain";
import { countFilledStages } from "@/components/game/boss-stages";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function BossQueuePage({
  searchParams,
}: {
  searchParams: Promise<{ avaliada?: string }>;
}) {
  await requireTeacherContext();
  const { avaliada } = await searchParams;
  const items = await getBossProjectQueue();

  const pending = items.filter((i) => i.project.status === "submitted").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <Crown className="size-6 text-warning" />
          Projetos finais
        </h1>
        <p className="text-muted-foreground">
          {pending > 0
            ? `${pending} projeto(s) aguardando validacao.`
            : "Projetos finais enviados pelos alunos aparecem aqui."}
        </p>
      </div>

      {avaliada ? (
        <Alert variant="success">
          <CheckCircle2 />
          <AlertDescription>Avaliacao registrada com sucesso.</AlertDescription>
        </Alert>
      ) : null}

      {items.length === 0 ? (
        <EmptyState
          icon={Crown}
          title="Nenhum projeto final ainda"
          description="Quando um aluno enviar o Boss Final, ele aparecera nesta fila para validacao."
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {items.map(({ project, studentName }) => (
                <li key={project.id}>
                  <Link
                    href={`/professor/boss-final/${project.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{studentName}</p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {project.title || "Projeto final"} ·{" "}
                        {countFilledStages(project)}/5 etapas
                      </p>
                    </div>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {project.submitted_at
                        ? formatDateTime(project.submitted_at)
                        : ""}
                    </span>
                    <Badge variant={BOSS_PROJECT_STATUS_VARIANT[project.status]}>
                      {BOSS_PROJECT_STATUS_LABEL[project.status]}
                    </Badge>
                  </Link>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
