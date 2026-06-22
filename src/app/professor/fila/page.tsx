import Link from "next/link";
import { CheckCircle2, Inbox } from "lucide-react";

import { requireTeacherContext } from "@/lib/auth/session";
import { getValidationQueue } from "@/server/teacher-data";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubmissionStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn, formatDateTime } from "@/lib/utils";
import type { SubmissionStatus } from "@/lib/database.types";

export const dynamic = "force-dynamic";

const FILTERS: { value: SubmissionStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pendentes" },
  { value: "approved", label: "Aprovadas" },
  { value: "rejected", label: "Reprovadas" },
  { value: "all", label: "Todas" },
];

function isStatus(value: string | undefined): value is SubmissionStatus {
  return value === "pending" || value === "approved" || value === "rejected";
}

export default async function QueuePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; avaliada?: string }>;
}) {
  await requireTeacherContext();
  const { status, avaliada } = await searchParams;

  const filter = isStatus(status) ? status : undefined;
  const active = filter ?? "all";
  const items = await getValidationQueue(filter);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Fila de validação</h1>
        <p className="text-muted-foreground">
          Entregas pendentes aparecem primeiro. Abra uma entrega para avaliar.
        </p>
      </div>

      {avaliada ? (
        <Alert variant="success">
          <CheckCircle2 />
          <AlertDescription>
            Avaliação registrada com sucesso.
          </AlertDescription>
        </Alert>
      ) : null}

      <div className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <Link
            key={f.value}
            href={
              f.value === "all"
                ? "/professor/fila"
                : `/professor/fila?status=${f.value}`
            }
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
              active === f.value
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input hover:bg-accent",
            )}
          >
            {f.label}
          </Link>
        ))}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="Nenhuma entrega neste filtro"
          description={
            active === "pending"
              ? "Não há entregas pendentes. Tudo em dia por aqui!"
              : "Nenhuma entrega encontrada para o filtro selecionado."
          }
        />
      ) : (
        <Card>
          <CardContent className="p-0">
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.submission.id}>
                  <Link
                    href={`/professor/entregas/${item.submission.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-accent/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 font-medium">
                        {item.studentName}
                        {item.isResubmission ? (
                          <Badge variant="outline">
                            Reenvio (tentativa {item.submission.attempt_number})
                          </Badge>
                        ) : null}
                      </p>
                      <p className="line-clamp-1 text-sm text-muted-foreground">
                        {item.missionTitle}
                      </p>
                    </div>
                    <span className="hidden text-xs text-muted-foreground sm:block">
                      {formatDateTime(item.submission.submitted_at)}
                    </span>
                    <SubmissionStatusBadge status={item.submission.status} />
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
