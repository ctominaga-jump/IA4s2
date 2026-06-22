"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import { AlertCircle, Check, Loader2, Pencil, Target, X } from "lucide-react";

import { updateGoalAction, type GoalFormState } from "@/server/learning-goals";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { GOAL_CATEGORY_LABEL, GOAL_CATEGORY_OPTIONS } from "@/lib/domain";
import type { GoalCategory, LearningGoalRow } from "@/lib/database.types";

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Check />}
      Salvar
    </Button>
  );
}

export function GoalCard({ goal }: { goal: LearningGoalRow | null }) {
  const [editing, setEditing] = useState(false);
  const [state, formAction] = useActionState<GoalFormState, FormData>(
    async (prev, formData) => {
      const result = await updateGoalAction(prev, formData);
      if (result.success) setEditing(false);
      return result;
    },
    {},
  );

  if (!goal) {
    return (
      <Card className="border-dashed">
        <CardHeader className="flex-row items-center gap-2 space-y-0">
          <Target className="size-5 text-primary" />
          <CardTitle className="text-base">Seu objetivo real</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Você ainda não registrou um objetivo. Defina o que você quer
            alcançar para dar contexto a sua jornada.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex items-center gap-2">
          <Target className="size-5 text-primary" />
          <CardTitle className="text-base">Seu objetivo real</CardTitle>
        </div>
        {!editing ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(true)}
            className="text-muted-foreground"
          >
            <Pencil className="size-4" />
            Editar
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditing(false)}
            className="text-muted-foreground"
          >
            <X className="size-4" />
            Cancelar
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {!editing ? (
          <div className="space-y-2">
            <p className="text-lg font-medium">{goal.title}</p>
            {goal.description ? (
              <p className="text-sm text-muted-foreground">
                {goal.description}
              </p>
            ) : null}
            {goal.category ? (
              <Badge variant="secondary">
                {GOAL_CATEGORY_LABEL[goal.category]}
              </Badge>
            ) : null}
          </div>
        ) : (
          <form action={formAction} className="space-y-3">
            {state.error ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            ) : null}
            <div className="space-y-2">
              <Label htmlFor="goal-title">Objetivo</Label>
              <Input
                id="goal-title"
                name="title"
                defaultValue={goal.title}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-description">Descrição (opcional)</Label>
              <Textarea
                id="goal-description"
                name="description"
                defaultValue={goal.description ?? ""}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="goal-category">Categoria (opcional)</Label>
              <select
                id="goal-category"
                name="category"
                defaultValue={(goal.category as GoalCategory | null) ?? ""}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="">Selecione</option>
                {GOAL_CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <SaveButton />
          </form>
        )}
      </CardContent>
    </Card>
  );
}
