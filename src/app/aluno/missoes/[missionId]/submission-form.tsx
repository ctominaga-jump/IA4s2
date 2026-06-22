"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Loader2, Send } from "lucide-react";

import {
  submitMissionAction,
  type SubmissionFormState,
} from "@/server/submissions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

function SubmitButton({ isResubmission }: { isResubmission: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
      {isResubmission ? "Reenviar entrega" : "Enviar entrega"}
    </Button>
  );
}

export function SubmissionForm({
  missionId,
  isResubmission,
}: {
  missionId: string;
  isResubmission: boolean;
}) {
  const [state, formAction] = useActionState<SubmissionFormState, FormData>(
    submitMissionAction,
    {},
  );

  return (
    <form action={formAction} className="space-y-3">
      <input type="hidden" name="missionId" value={missionId} />
      {state.error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertDescription>{state.error}</AlertDescription>
        </Alert>
      ) : null}
      <div className="space-y-2">
        <Label htmlFor="content">Sua entrega</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Escreva aqui a sua resposta para a missão..."
          className="min-h-[200px]"
          required
        />
        <p className="text-xs text-muted-foreground">
          Sua entrega será enviada para validação de um professor.
        </p>
      </div>
      <SubmitButton isResubmission={isResubmission} />
    </form>
  );
}
