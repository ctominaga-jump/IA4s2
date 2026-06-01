import type {
  GoalCategory,
  SubmissionStatus,
  DeclaredLevel,
  MissionDifficulty,
  AvatarVariant,
  BossProjectStatus,
} from "@/lib/database.types";

// Status derivado de uma missao para um aluno (combina entrega + missao).
export type MissionStatus = "not_started" | "pending" | "approved" | "rejected";

export const MISSION_STATUS_LABEL: Record<MissionStatus, string> = {
  not_started: "Nao iniciada",
  pending: "Aguardando validacao",
  approved: "Aprovada",
  rejected: "Reprovada",
};

export const SUBMISSION_STATUS_LABEL: Record<SubmissionStatus, string> = {
  pending: "Pendente",
  approved: "Aprovada",
  rejected: "Reprovada",
};

export type StatusVariant =
  | "default"
  | "secondary"
  | "success"
  | "warning"
  | "destructive"
  | "muted"
  | "outline";

export const MISSION_STATUS_VARIANT: Record<MissionStatus, StatusVariant> = {
  not_started: "muted",
  pending: "warning",
  approved: "success",
  rejected: "destructive",
};

export const SUBMISSION_STATUS_VARIANT: Record<SubmissionStatus, StatusVariant> =
  {
    pending: "warning",
    approved: "success",
    rejected: "destructive",
  };

export const MISSION_DIFFICULTY_LABEL: Record<MissionDifficulty, string> = {
  easy: "Facil",
  medium: "Media",
  hard: "Dificil",
};

export const MISSION_DIFFICULTY_VARIANT: Record<
  MissionDifficulty,
  StatusVariant
> = {
  easy: "success",
  medium: "warning",
  hard: "destructive",
};

export const BOSS_PROJECT_STATUS_LABEL: Record<BossProjectStatus, string> = {
  draft: "Rascunho",
  submitted: "Aguardando validacao",
  approved: "Aprovado",
  rejected: "Revisar e reenviar",
};

export const BOSS_PROJECT_STATUS_VARIANT: Record<
  BossProjectStatus,
  StatusVariant
> = {
  draft: "muted",
  submitted: "warning",
  approved: "success",
  rejected: "destructive",
};

export const AVATAR_VARIANT_LABEL: Record<AvatarVariant, string> = {
  aurora: "Aurora",
  ember: "Brasa",
  verdant: "Verdejante",
  nebula: "Nebulosa",
};

export const AVATAR_VARIANT_OPTIONS: { value: AvatarVariant; label: string }[] =
  (Object.keys(AVATAR_VARIANT_LABEL) as AvatarVariant[]).map((value) => ({
    value,
    label: AVATAR_VARIANT_LABEL[value],
  }));

export const GOAL_CATEGORY_LABEL: Record<GoalCategory, string> = {
  study: "Estudo",
  career: "Carreira",
  business: "Negocio",
  creation: "Criacao",
  productivity: "Produtividade",
  personal: "Pessoal",
  other: "Outro",
};

export const GOAL_CATEGORY_OPTIONS: { value: GoalCategory; label: string }[] = (
  Object.keys(GOAL_CATEGORY_LABEL) as GoalCategory[]
).map((value) => ({ value, label: GOAL_CATEGORY_LABEL[value] }));

export const DECLARED_LEVEL_LABEL: Record<DeclaredLevel, string> = {
  beginner: "Iniciante",
  basic: "Basico",
  intermediate: "Intermediario",
};

export const DECLARED_LEVEL_OPTIONS: { value: DeclaredLevel; label: string }[] =
  (Object.keys(DECLARED_LEVEL_LABEL) as DeclaredLevel[]).map((value) => ({
    value,
    label: DECLARED_LEVEL_LABEL[value],
  }));

export const GOAL_EXAMPLES = [
  "Aprender ingles",
  "Criar um site",
  "Conseguir um emprego",
  "Passar em uma prova",
  "Abrir um negocio",
];
