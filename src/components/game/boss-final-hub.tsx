"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";
import {
  AlertCircle,
  CheckCircle2,
  Crown,
  Loader2,
  Lock,
  RotateCcw,
  Save,
  Send,
  Sparkles,
} from "lucide-react";

import {
  saveBossDraftAction,
  submitBossProjectAction,
  type BossDraftFormState,
} from "@/server/boss-projects";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { BOSS_STAGES } from "@/components/game/boss-stages";
import {
  BOSS_PROJECT_STATUS_LABEL,
  BOSS_PROJECT_STATUS_VARIANT,
} from "@/lib/domain";
import type { BossProjectStatus } from "@/lib/database.types";
import { cn } from "@/lib/utils";

export interface BossFinalViewModel {
  status: BossProjectStatus;
  title: string;
  stages: Record<(typeof BOSS_STAGES)[number]["key"], string>;
  feedback: string | null;
  reviewedAt: string | null;
  submittedAt: string | null;
  filledCount: number;
  isComplete: boolean;
  journeyApproved: number;
  journeyTotal: number;
  journeyComplete: boolean;
  justSubmitted: boolean;
}

export function BossFinalHub(vm: BossFinalViewModel) {
  const readOnly = vm.status === "submitted" || vm.status === "approved";

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <BossHeader vm={vm} />

      {vm.justSubmitted ? (
        <Alert variant="success">
          <CheckCircle2 />
          <AlertTitle>Projeto enviado para validação!</AlertTitle>
          <AlertDescription>
            Um professor vai avaliar seu produto final. Você verá o resultado
            aqui.
          </AlertDescription>
        </Alert>
      ) : null}

      {vm.status === "approved" ? (
        <Alert variant="success">
          <Crown />
          <AlertTitle>Projeto final aprovado! Você concluiu a jornada.</AlertTitle>
          <AlertDescription className="space-y-1">
            {vm.feedback ? <p>{vm.feedback}</p> : null}
            {vm.reviewedAt ? (
              <p className="text-xs opacity-80">Avaliado em {vm.reviewedAt}</p>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {vm.status === "rejected" && vm.feedback ? (
        <Alert variant="destructive">
          <RotateCcw />
          <AlertTitle>Quase lá — ajuste e reenvie</AlertTitle>
          <AlertDescription className="space-y-1">
            <p>{vm.feedback}</p>
            {vm.reviewedAt ? (
              <p className="text-xs opacity-80">Avaliado em {vm.reviewedAt}</p>
            ) : null}
          </AlertDescription>
        </Alert>
      ) : null}

      {!vm.journeyComplete && vm.status !== "approved" ? (
        <div className="flex items-start gap-3 rounded-2xl border border-warning/30 bg-warning/5 px-4 py-3 text-sm">
          <Sparkles className="mt-0.5 size-4 shrink-0 text-warning" />
          <p className="text-muted-foreground">
            Você ja pode esbocar seu projeto agora.{" "}
            <span className="font-medium text-foreground">
              {vm.journeyApproved}/{vm.journeyTotal} missões aprovadas
            </span>{" "}
            — conclua a jornada para deixar seu Boss Final ainda mais forte.
          </p>
        </div>
      ) : null}

      {readOnly ? (
        <BossReadOnly vm={vm} />
      ) : (
        <BossEditor vm={vm} />
      )}
    </div>
  );
}

function BossHeader({ vm }: { vm: BossFinalViewModel }) {
  const pct = Math.round((vm.filledCount / BOSS_STAGES.length) * 100);
  return (
    <header className="relative overflow-hidden rounded-3xl border border-warning/30 bg-card/80 p-5 md:p-6">
      <div className="pointer-events-none absolute -right-10 -top-14 size-44 rounded-full bg-warning/15 blur-3xl" />
      <div className="relative">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-warning/40 bg-warning/10 px-3 py-1 text-xs font-medium text-warning">
            <Crown className="size-3.5" />
            Boss Final
          </span>
          <Badge variant={BOSS_PROJECT_STATUS_VARIANT[vm.status]}>
            {BOSS_PROJECT_STATUS_LABEL[vm.status]}
          </Badge>
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight md:text-3xl">
          Seu produto com IA
        </h1>
        <p className="mt-1.5 max-w-xl text-sm leading-6 text-muted-foreground">
          O grande desafio da jornada: transforme tudo o que aprendeu em um
          produto real com IA — do problema a validação com pessoas.
        </p>

        <div className="mt-5">
          <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
            <span>Etapas preenchidas</span>
            <span className="tabular-nums">
              {vm.filledCount}/{BOSS_STAGES.length} · {pct}%
            </span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-warning via-primary to-success transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

function BossReadOnly({ vm }: { vm: BossFinalViewModel }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border bg-card/60 p-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Produto
        </p>
        <h2 className="mt-1 text-xl font-bold">{vm.title || "Sem título"}</h2>
      </div>
      <ol className="space-y-3">
        {BOSS_STAGES.map((stage) => {
          const Icon = stage.icon;
          return (
            <li
              key={stage.key}
              className="rounded-2xl border border-border bg-card/60 p-5"
            >
              <div className="flex items-center gap-2">
                <span className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Icon className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    Etapa {stage.number}
                  </p>
                  <p className="font-semibold leading-tight">{stage.label}</p>
                </div>
              </div>
              <p className="mt-3 whitespace-pre-line text-sm leading-6 text-muted-foreground">
                {vm.stages[stage.key] || "—"}
              </p>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="outline" disabled={pending}>
      {pending ? <Loader2 className="animate-spin" /> : <Save />}
      Salvar rascunho
    </Button>
  );
}

function SubmitButton({ disabled }: { disabled: boolean }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" variant="success" disabled={pending || disabled}>
      {pending ? <Loader2 className="animate-spin" /> : <Send />}
      Enviar para validação
    </Button>
  );
}

function BossEditor({ vm }: { vm: BossFinalViewModel }) {
  const [saveState, saveAction] = useActionState<BossDraftFormState, FormData>(
    saveBossDraftAction,
    {},
  );
  const [submitState, submitAction] = useActionState<
    BossDraftFormState,
    FormData
  >(submitBossProjectAction, {});

  // Espelha localmente o estado de completude para habilitar o envio sem
  // depender de salvar primeiro nesta sessão (a fonte de verdade e o servidor).
  const [title, setTitle] = useState(vm.title);
  const [stageValues, setStageValues] = useState<Record<string, string>>(
    Object.fromEntries(BOSS_STAGES.map((s) => [s.key, vm.stages[s.key]])),
  );

  const localFilled = BOSS_STAGES.filter(
    (s) => (stageValues[s.key] ?? "").trim().length > 0,
  ).length;
  const localComplete =
    title.trim().length > 0 && localFilled === BOSS_STAGES.length;
  // Só habilita o envio quando o conteúdo completo já foi salvo (sem edições
  // pendentes). Compara com o que o servidor tem.
  const dirty =
    title !== vm.title ||
    BOSS_STAGES.some((s) => (stageValues[s.key] ?? "") !== vm.stages[s.key]);
  const canSubmit = vm.isComplete && !dirty;

  return (
    <div className="space-y-5">
      {/* Formulario das etapas (salva rascunho) */}
      <form action={saveAction} className="space-y-4">
        {saveState.error ? (
          <Alert variant="destructive">
            <AlertCircle />
            <AlertDescription>{saveState.error}</AlertDescription>
          </Alert>
        ) : null}
        {saveState.saved ? (
          <Alert variant="success">
            <CheckCircle2 />
            <AlertDescription>Rascunho salvo.</AlertDescription>
          </Alert>
        ) : null}

        <div className="rounded-2xl border border-border bg-card/60 p-5">
          <Label htmlFor="title">Nome do produto</Label>
          <Input
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ex.: Atende Facil — assistente de respostas para pequenos negocios"
            maxLength={140}
            className="mt-2"
          />
        </div>

        <ol className="space-y-3">
          {BOSS_STAGES.map((stage) => {
            const Icon = stage.icon;
            const filled = (stageValues[stage.key] ?? "").trim().length > 0;
            return (
              <li
                key={stage.key}
                className={cn(
                  "rounded-2xl border bg-card/60 p-5",
                  filled ? "border-success/30" : "border-border",
                )}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-lg",
                      filled
                        ? "bg-success/15 text-success"
                        : "bg-primary/15 text-primary",
                    )}
                  >
                    {filled ? (
                      <CheckCircle2 className="size-4" />
                    ) : (
                      <Icon className="size-4" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                      Etapa {stage.number} · {stage.summary}
                    </p>
                    <Label
                      htmlFor={stage.key}
                      className="text-base font-semibold"
                    >
                      {stage.label}
                    </Label>
                  </div>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {stage.prompt}
                </p>
                <Textarea
                  id={stage.key}
                  name={stage.key}
                  value={stageValues[stage.key] ?? ""}
                  onChange={(e) =>
                    setStageValues((prev) => ({
                      ...prev,
                      [stage.key]: e.target.value,
                    }))
                  }
                  placeholder={stage.placeholder}
                  className="mt-3 min-h-[120px]"
                />
              </li>
            );
          })}
        </ol>

        <div className="flex flex-wrap items-center gap-3">
          <SaveButton />
          <p className="text-xs text-muted-foreground">
            {localComplete
              ? dirty
                ? "Salve o rascunho para liberar o envio."
                : "Tudo pronto! Você já pode enviar para validação."
              : `Preencha o título e as 5 etapas (${localFilled}/${BOSS_STAGES.length}).`}
          </p>
        </div>
      </form>

      {/* Envio para validação (form separado: usa o que já foi salvo) */}
      <form
        action={submitAction}
        className="flex flex-col gap-3 rounded-2xl border border-border bg-background/40 p-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-start gap-2 text-sm text-muted-foreground">
          {canSubmit ? (
            <Send className="mt-0.5 size-4 shrink-0 text-success" />
          ) : (
            <Lock className="mt-0.5 size-4 shrink-0" />
          )}
          <span>
            {vm.status === "rejected"
              ? "Ajustou com base no feedback? Reenvie para uma nova avaliação."
              : "Quando o projeto estiver completo e salvo, envie para a validação do professor."}
          </span>
        </div>
        {submitState.error ? (
          <Alert variant="destructive" className="sm:max-w-xs">
            <AlertCircle />
            <AlertDescription>{submitState.error}</AlertDescription>
          </Alert>
        ) : null}
        <SubmitButton disabled={!canSubmit} />
      </form>
    </div>
  );
}
