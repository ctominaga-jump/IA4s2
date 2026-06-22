"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, ArrowRight, Loader2 } from "lucide-react";

import {
  completeOnboardingAction,
  type GoalFormState,
} from "@/server/learning-goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DECLARED_LEVEL_OPTIONS,
  GOAL_CATEGORY_OPTIONS,
  GOAL_EXAMPLES,
} from "@/lib/domain";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : null}
      Concluir e ver minhas missoes
      <ArrowRight />
    </Button>
  );
}

export function OnboardingForm() {
  const [state, formAction] = useActionState<GoalFormState, FormData>(
    completeOnboardingAction,
    {},
  );

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="space-y-5 pt-6">
          {state.error ? (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{state.error}</AlertDescription>
            </Alert>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="title">Qual e o seu objetivo realá</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex.: aprender ingles para o trabalho"
              required
            />
            <p className="text-xs text-muted-foreground">
              Exemplos: {GOAL_EXAMPLES.join(", ")}.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Quer detalhar um pouco? (opcional)
            </Label>
            <Textarea
              id="description"
              name="description"
              placeholder="O que você quer alcançar e por que isso importa para você."
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="category">Categoria (opcional)</Label>
              <select
                id="category"
                name="category"
                defaultValue=""
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecione</option>
                {GOAL_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="declared_level">
                Como você se sente hoje? (opcional)
              </Label>
              <select
                id="declared_level"
                name="declared_level"
                defaultValue=""
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecione</option>
                {DECLARED_LEVEL_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <p className="rounded-lg bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
            Seu objetivo aparece como contexto na sua jornada. No momento, as
            missões sao as mesmas para todos — não geramos trilha automatica.
          </p>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
