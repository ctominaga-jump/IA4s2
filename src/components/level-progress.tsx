import { Trophy } from "lucide-react";

import { cn } from "@/lib/utils";
import type { LevelRow } from "@/lib/database.types";

interface LevelProgressProps {
  totalXp: number;
  current: LevelRow | null;
  next: LevelRow | null;
  progressPercent: number;
  xpForNext: number;
  className?: string;
}

export function LevelProgress({
  totalXp,
  current,
  next,
  progressPercent,
  xpForNext,
  className,
}: LevelProgressProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-lg bg-accent text-primary">
            <Trophy className="size-5" />
          </span>
          <div>
            <p className="text-sm text-muted-foreground">
              Nível {current?.number ?? 1}
            </p>
            <p className="font-semibold leading-tight">
              {current?.title ?? "Explorador"}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold">{totalXp}</p>
          <p className="text-xs text-muted-foreground">XP total</p>
        </div>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all"
          style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
        />
      </div>

      <p className="text-xs text-muted-foreground">
        {next
          ? `Faltam ${xpForNext} XP para o nível ${next.number} — ${next.title}.`
          : "Você alcançou o nível máximo. Continue evoluindo!"}
      </p>
    </div>
  );
}
