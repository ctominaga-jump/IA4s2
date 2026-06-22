import Link from "next/link";
import { ArrowRight, CheckCircle2, Clock, Inbox, XCircle } from "lucide-react";

import { requireTeacherContext } from "@/lib/auth/session";
import { getTeacherDashboard } from "@/server/teacher-data";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SubmissionStatusBadge } from "@/components/status-badge";
import { EmptyState } from "@/components/empty-state";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function TeacherDashboardPage() {
  const { appUser } = await requireTeacherContext();
  const { counts, recent } = await getTeacherDashboard();

  const firstName = appUser.name.split(" ")[0] ?? appUser.name;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">Ola, {firstName}!</h1>
          <p className="text-muted-foreground">
            Acompanhe e valide as entregas dos alunos.
          </p>
        </div>
        <Button asChild>
          <Link href="/professor/fila">
            Abrir fila de validação <ArrowRight />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <MetricCard
          label="Pendentes"
          value={counts.pending}
          icon={Clock}
          tone="warning"
          href="/professor/fila?status=pending"
        />
        <MetricCard
          label="Aprovadas"
          value={counts.approved}
          icon={CheckCircle2}
          tone="success"
          href="/professor/fila?status=approved"
        />
        <MetricCard
          label="Reprovadas"
          value={counts.rejected}
          icon={XCircle}
          tone="destructive"
          href="/professor/fila?status=rejected"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Entregas recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <EmptyState
              icon={Inbox}
              title="Nenhuma entrega ainda"
              description="Quando os alunos enviarem entregas, elas aparecerao aqui."
            />
          ) : (
            <ul className="divide-y">
              {recent.map((item) => (
                <li key={item.submission.id}>
                  <Link
                    href={`/professor/entregas/${item.submission.id}`}
                    className="flex items-center gap-3 py-3 hover:bg-accent/20"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-center gap-2 font-medium">
                        {item.studentName}
                        {item.isResubmission ? (
                          <Badge variant="outline">Reenvio</Badge>
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
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  tone,
  href,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  tone: "warning" | "success" | "destructive";
  href: string;
}) {
  const toneClasses = {
    warning: "bg-warning/10 text-warning",
    success: "bg-success/10 text-success",
    destructive: "bg-destructive/10 text-destructive",
  }[tone];

  return (
    <Link href={href}>
      <Card className="transition-colors hover:border-primary/40">
        <CardContent className="flex items-center justify-between pt-6">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold">{value}</p>
          </div>
          <span
            className={`flex size-11 items-center justify-center rounded-lg ${toneClasses}`}
          >
            <Icon className="size-6" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
