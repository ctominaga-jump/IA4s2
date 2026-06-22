"use client";

import { useActionState, useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Loader2,
  Sparkles,
  XCircle,
} from "lucide-react";

import { reviewSubmissionAction, type ReviewFormState } from "@/server/reviews";
import { suggestEvaluationAction } from "@/server/ai-evaluation";
import type { AiSuggestion } from "@/lib/ai/evaluation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";

type Decision = "approved" | "rejected";

const CONFIDENCE_LABEL: Record<AiSuggestion["confidence"], string> = {
  alta: "confiança alta",
  media: "confiança média",
  baixa: "confiança baixa",
};

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
        : "Confirmar aprovação"}
    </Button>
  );
}

export function ReviewForm({
  submissionId,
  xpReward,
  aiEnabled = false,
}: {
  submissionId: string;
  xpReward: number;
  aiEnabled?: boolean;
}) {
  const [state, formAction] = useActionState<ReviewFormState, FormData>(
    reviewSubmissionAction,
    {},
  );
  const [decision, setDecision] = useState<Decision | null>(null);
  const [comment, setComment] = useState("");

  const [aiPending, startAi] = useTransition();
  const [aiError, setAiError] = useState<string | null>(null);
  const [suggestion, setSuggestion] = useState<AiSuggestion | null>(null);

  function handleSuggest() {
    setAiError(null);
    startAi(async () => {
      const result = await suggestEvaluationAction(submissionId);
      if (result.error || !result.suggestion) {
        setAiError(result.error ?? "Não foi possível gerar a sugestão.");
        return;
      }
      setSuggestion(result.suggestion);
      setDecision(result.suggestion.decision);
      setComment(result.suggestion.comment);
    });
  }

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="submissionId" value={submissionId} />
      {decision ? (
        <input type="hidden" name="decision" value={decision} />
      ) : null}

      {aiEnabled ? (
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={handleSuggest}
            disabled={aiPending}
            className="w-full sm:w-auto"
          >
            {aiPending ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Sparkles className="size-4" />
            )}
            Gerar sugestão com IA
          </Button>
          {suggestion ? (
            <Alert>
              <Sparkles className="size-4" />
              <AlertDescription>
                Sugestão da IA ({CONFIDENCE_LABEL[suggestion.confidence]}):{" "}
                <span className="font-medium">
                  {suggestion.decision === "approved" ? "aprovar" : "reprovar"}
                </span>
                . Revise e ajuste antes de confirmar — a decisão é sua.
              </AlertDescription>
            </Alert>
          ) : null}
          {aiError ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{aiError}</AlertDescription>
            </Alert>
          ) : null}
        </div>
      ) : null}

      {state.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}

      <div className="space-y-2">
        <Label>Decisão</Label>
        <div className="grid gap-3 sm:grid-cols-2">
          <DecisionOption
            value="approved"
            active={decision === "approved"}
            onSelect={setDecision}
            icon={<CheckCircle2 className="size-5" />}
            label="Aprovar"
            hint={`Concede ${xpReward} XP ao aluno (uma única vez).`}
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
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Explique o que ficou bom e o que pode melhorar. Seja claro e incentive o próximo passo."
          className="min-h-[140px]"
          required
        />
        <p className="text-xs text-muted-foreground">
          O feedback é obrigatório tanto para aprovar quanto para reprovar e
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
