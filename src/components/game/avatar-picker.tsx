"use client";

import { useActionState } from "react";
import { Check, Loader2 } from "lucide-react";

import {
  updateAvatarVariantAction,
  type AvatarFormState,
} from "@/server/avatar";
import { AVATAR_VARIANT_OPTIONS } from "@/lib/domain";
import { cn } from "@/lib/utils";
import type { AvatarVariant } from "@/lib/database.types";

const SWATCH: Record<AvatarVariant, string> = {
  aurora: "from-[#16D9E3] to-[#6D5DF7]",
  ember: "from-[#FFC857] to-[#FF5C7A]",
  verdant: "from-[#3EE58F] to-[#16D9E3]",
  nebula: "from-[#6D5DF7] to-[#FF5C7A]",
};

export function AvatarPicker({ current }: { current: AvatarVariant }) {
  const [state, formAction, pending] = useActionState<
    AvatarFormState,
    FormData
  >((prev, formData) => updateAvatarVariantAction(prev, formData), {});

  return (
    <form action={formAction}>
      <div className="mb-3 flex items-center gap-2">
        <p className="text-sm font-medium">Estilo do avatar</p>
        {pending ? (
          <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
        ) : null}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {AVATAR_VARIANT_OPTIONS.map((opt) => {
          const active = opt.value === current;
          return (
            <button
              key={opt.value}
              type="submit"
              name="variant"
              value={opt.value}
              disabled={pending}
              aria-pressed={active}
              className={cn(
                "relative rounded-2xl border p-2.5 transition-colors disabled:opacity-60",
                active
                  ? "border-primary bg-primary/10 ring-1 ring-primary/40"
                  : "border-border bg-background/40 hover:border-primary/40",
              )}
            >
              <span
                className={cn(
                  "mx-auto block size-9 rounded-full bg-gradient-to-br shadow-[0_0_16px_rgba(109,93,247,0.35)]",
                  SWATCH[opt.value],
                )}
              />
              <span className="mt-1.5 block text-[11px] font-medium text-muted-foreground">
                {opt.label}
              </span>
              {active ? (
                <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="size-2.5" />
                </span>
              ) : null}
            </button>
          );
        })}
      </div>
      {state.error ? (
        <p className="mt-2 text-xs text-destructive">{state.error}</p>
      ) : null}
    </form>
  );
}
