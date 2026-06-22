"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, CheckCircle2, Loader2, XCircle } from "lucide-react";

import { reviewSubmissionAction, type ReviewFormState } from "@/server/reviews";
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
        : "Confirmar aprovacao"}
    </Button>
  );
}

export function ReviewForm({
  submissionId,
  xpReward,
}: {
  submissionId: string;
  xpReward: number;
}) {
  const [state, formAction] = useActionState<ReviewFormState, FormData>(
    reviewSubmissionAction,
    {},
  );
  const [decision, setDecision] = useState<Decision | null>(null);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="submissionId" value={submissionId} />
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
            hint={`Concede ${xpReward} XP ao aluno (uma unica vez).`}
            activeClass="border-success bg-success/10 text-success"
          />
          <DecisionOption
            value="rejected"
            active={decision === "rejected"}
            onSelect={setDecision}
            icon={<XCircle className="size-5" />}
            label="Reprovar"
            hint="Libera o reenvio da entrega pelo aluno."
            activeClass="border-destructive bg-destructive/10 text-destructive"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="comment">Feedback (obrigatório)</Label>
        <Textarea
          id="comment"
          name="comment"
          placeholder="Explique o que ficou bom e o que pode melhorar. Seja claro e incentive o próximo passo."
          className="min-h-[140px]"
          required
        />
        <p className="text-xs text-muted-foreground">
          O feedback é obrigatório tanto para aprovar quanto para reprovar é
          ficará visível para o aluno.
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
