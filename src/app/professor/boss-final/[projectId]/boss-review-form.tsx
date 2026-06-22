"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";

import {
  reviewBossProjectAction,
  type BossReviewFormState,
} from "@/server/boss-projects";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Decision = "approved" | "rejected";

function ConfirmButton({ decision }: { decision: Decision | null }) {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending || !decision}
      variant={decision === "rejected" ? "destructive" : "success"}
      className="w-full sm:w-auto"
    >
      {pending ? <Loader2 className="animate-spin" /> : null}
      {decision === "rejected"
        ? "Confirmar reprovação"
        : "Aprovar projeto final"}
    </Button>
  );
}

export function BossReviewForm({ projectId }: { projectId: string }) {
  const [state, formAction] = useActionState<BossReviewFormState, FormData>(
    reviewBossProjectAction,
    {},
  );
  const [decision, setDecision] = useState<Decision | null>(null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="projectId" value={projectId} />
      {decision ? (
        <input type="hidden" name="decision" value={decision} />
      ) : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label>Decisao</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <DecisionOption
            value="approved"
            active={decision === "approved"}
            onSelect={setDecision}
            icon={<CheckCircle2 className="size-5" />}
            label="Aprovar"
            hint="Conclui a jornada do aluno com o produto final."
            activeClass="border-success bg-success/10 text-success"
          />
          <DecisionOption
            value="rejected"
            active={decision === "rejected"}
            onSelect={setDecision}
            icon={<XCircle className="size-5" />}
            label="Reprovar"
            hint="Libera o aluno para ajustar e reenviar."
            activeClass="border-destructive bg-destructive/10 text-destructive"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Feedback (obrigatório)</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Destaque a clareza do problema, a viabilidade da solução, a arquitetura e a evidência de validação. Oriente o próximo passo."
          className="min-h-[140px]"
          required
        />
        <p className="text-xs text-muted-foreground">
          O feedback fica visível para o aluno na página do Boss Final.
        </p>
      </div>

      <ConfirmButton decision={decision} />
    </form>
  );
}

function DecisionOption({
  value,
  active,
  onSelect,
  icon,
  label,
  hint,
  activeClass,
}: {
  value: Decision;
  active: boolean;
  onSelect: (d: Decision) => void;
  icon: React.ReactNode;
  label: string;
  hint: string;
  activeClass: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      aria-pressed={active}
      className={cn(
        "flex flex-col gap-1 rounded-lg border p-4 text-left transition-colors",
        active ? activeClass : "border-input hover:bg-muted",
      )}
    >
      <span className="flex items-center gap-2 font-medium">
        {icon}
        {label}
      </span>
      <span className="text-xs text-muted-foreground">{hint}</span>
    </button>
  );
}
