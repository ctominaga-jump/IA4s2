import {
  Compass,
  Crown,
  type LucideIcon,
  Network,
  PenTool,
  Sparkles,
  Target,
  Terminal,
  Workflow,
} from "lucide-react";

export interface PhaseMeta {
  name: string;
  icon: LucideIcon;
}

/**
 * Metadata visual das 8 fases narrativas (Despertar -> Boss Final).
 * A ORDEM e a fonte de verdade e deve casar com `journey_phases.number`
 * (database/seeds/0004_advanced_curriculum.sql). Nomes curtos para caberem
 * nos nos do mapa; `Operador IA` (fluxos) e `Op. Técnico` (ambiente tecnico)
 * usam icones distintos para nao se confundirem.
 */
export const PHASES: PhaseMeta[] = [
  { name: "Despertar", icon: Sparkles },
  { name: "Explorador", icon: Compass },
  { name: "Estrategista", icon: Target },
  { name: "Criador", icon: PenTool },
  { name: "Operador IA", icon: Workflow },
  { name: "Op. Técnico", icon: Terminal },
  { name: "Arquiteto", icon: Network },
  { name: "Boss Final", icon: Crown },
];
