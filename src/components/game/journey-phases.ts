import {
  Boxes,
  Compass,
  Crown,
  type LucideIcon,
  PenTool,
  Sparkles,
  Target,
  Terminal,
} from "lucide-react";

export interface PhaseMeta {
  name: string;
  icon: LucideIcon;
}

/** Metadata visual das 7 fases narrativas (Despertar -> Boss Final). */
export const PHASES: PhaseMeta[] = [
  { name: "Despertar", icon: Sparkles },
  { name: "Explorador", icon: Compass },
  { name: "Estrategista", icon: Target },
  { name: "Criador", icon: PenTool },
  { name: "Operador", icon: Terminal },
  { name: "Arquiteto", icon: Boxes },
  { name: "Boss Final", icon: Crown },
];
