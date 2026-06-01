// Tipos do banco do MVP. Mantidos manualmente conforme database/data-model.md
// e as migrations em database/migrations. Quando o projeto amadurecer, podem
// ser substituidos por tipos gerados via `supabase gen types typescript`.

export type UserRole = "student" | "teacher";
export type UserStatus = "active" | "inactive";
export type DeclaredLevel = "beginner" | "basic" | "intermediate";
export type GoalCategory =
  | "study"
  | "career"
  | "business"
  | "creation"
  | "productivity"
  | "personal"
  | "other";
export type GoalStatus = "active" | "paused" | "completed" | "archived";
export type ContentStatus = "draft" | "published" | "archived";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type FeedbackDecision = "approved" | "rejected";
export type XpReason = "mission_approved" | "manual_adjustment";
export type MissionDifficulty = "easy" | "medium" | "hard";
export type AvatarVariant = "aurora" | "ember" | "verdant" | "nebula";
export type BossProjectStatus = "draft" | "submitted" | "approved" | "rejected";

// NOTA: estes tipos sao `type` (e nao `interface`) de proposito. Em checagens
// condicionais de `extends Record<string, unknown>` (usadas pelo supabase-js
// para validar o `Database`), interfaces NAO satisfazem a restricao porque podem
// sofrer augmentation; type aliases recebem a index signature implicita.
type Timestamps = {
  created_at: string;
  updated_at: string;
};

export type UserRow = Timestamps & {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  last_login_at: string | null;
};

export type StudentProfileRow = Timestamps & {
  id: string;
  user_id: string;
  declared_level: DeclaredLevel | null;
  total_xp: number;
  current_level_id: string | null;
  active_learning_goal_id: string | null;
  onboarding_completed_at: string | null;
  avatar_variant: AvatarVariant;
};

export type TeacherProfileRow = Timestamps & {
  id: string;
  user_id: string;
  bio: string | null;
  area: string | null;
};

export type LearningGoalRow = Timestamps & {
  id: string;
  student_profile_id: string;
  title: string;
  description: string | null;
  category: GoalCategory | null;
  status: GoalStatus;
};

export type CourseRow = Timestamps & {
  id: string;
  title: string;
  description: string;
  status: ContentStatus;
  teacher_profile_id: string | null;
};

export type ModuleRow = Timestamps & {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
  status: ContentStatus;
};

export type JourneyPhaseRow = Timestamps & {
  id: string;
  number: number;
  slug: string;
  name: string;
  tagline: string;
};

export type MissionRow = Timestamps & {
  id: string;
  module_id: string;
  title: string;
  description: string;
  learning_objective: string;
  instructions: string;
  expected_submission: string;
  xp_reward: number;
  position: number;
  status: ContentStatus;
  phase_id: string | null;
  difficulty: MissionDifficulty;
  estimated_minutes: number;
  acceptance_criteria: string | null;
};

export type SubmissionRow = Timestamps & {
  id: string;
  student_profile_id: string;
  mission_id: string;
  content: string;
  status: SubmissionStatus;
  attempt_number: number;
  submitted_at: string;
  reviewed_at: string | null;
};

export type FeedbackRow = Timestamps & {
  id: string;
  submission_id: string;
  teacher_profile_id: string;
  decision: FeedbackDecision;
  comment: string;
};

export type BossProjectRow = Timestamps & {
  id: string;
  student_profile_id: string;
  title: string | null;
  problem: string | null;
  solution: string | null;
  architecture: string | null;
  prototype: string | null;
  validation: string | null;
  status: BossProjectStatus;
  reviewer_teacher_profile_id: string | null;
  feedback: string | null;
  submitted_at: string | null;
  reviewed_at: string | null;
};

export type LevelRow = Timestamps & {
  id: string;
  number: number;
  title: string;
  min_xp: number;
  max_xp: number | null;
};

export type XpTransactionRow = {
  id: string;
  student_profile_id: string;
  mission_id: string | null;
  submission_id: string | null;
  amount: number;
  reason: XpReason;
  created_at: string;
};

type TableConfig<Row, Insert, Update> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export interface Database {
  public: {
    Views: Record<string, never>;
    Tables: {
      users: TableConfig<
        UserRow,
        Pick<UserRow, "auth_user_id" | "name" | "email" | "role"> &
          Partial<UserRow>,
        Partial<UserRow>
      >;
      student_profiles: TableConfig<
        StudentProfileRow,
        Pick<StudentProfileRow, "user_id"> & Partial<StudentProfileRow>,
        Partial<StudentProfileRow>
      >;
      teacher_profiles: TableConfig<
        TeacherProfileRow,
        Pick<TeacherProfileRow, "user_id"> & Partial<TeacherProfileRow>,
        Partial<TeacherProfileRow>
      >;
      learning_goals: TableConfig<
        LearningGoalRow,
        Pick<LearningGoalRow, "student_profile_id" | "title"> &
          Partial<LearningGoalRow>,
        Partial<LearningGoalRow>
      >;
      courses: TableConfig<CourseRow, Partial<CourseRow>, Partial<CourseRow>>;
      modules: TableConfig<ModuleRow, Partial<ModuleRow>, Partial<ModuleRow>>;
      journey_phases: TableConfig<
        JourneyPhaseRow,
        Partial<JourneyPhaseRow>,
        Partial<JourneyPhaseRow>
      >;
      missions: TableConfig<
        MissionRow,
        Partial<MissionRow>,
        Partial<MissionRow>
      >;
      submissions: TableConfig<
        SubmissionRow,
        Pick<SubmissionRow, "student_profile_id" | "mission_id" | "content"> &
          Partial<SubmissionRow>,
        Partial<SubmissionRow>
      >;
      feedback: TableConfig<
        FeedbackRow,
        Pick<
          FeedbackRow,
          "submission_id" | "teacher_profile_id" | "decision" | "comment"
        > &
          Partial<FeedbackRow>,
        Partial<FeedbackRow>
      >;
      boss_projects: TableConfig<
        BossProjectRow,
        Pick<BossProjectRow, "student_profile_id"> & Partial<BossProjectRow>,
        Partial<BossProjectRow>
      >;
      levels: TableConfig<LevelRow, Partial<LevelRow>, Partial<LevelRow>>;
      xp_transactions: TableConfig<
        XpTransactionRow,
        Partial<XpTransactionRow>,
        Partial<XpTransactionRow>
      >;
    };
    Functions: {
      review_submission: {
        Args: {
          p_submission_id: string;
          p_teacher_profile_id: string;
          p_decision: FeedbackDecision;
          p_comment: string;
        };
        Returns: ReviewSubmissionResult;
      };
      level_for_xp: {
        Args: { p_xp: number };
        Returns: string;
      };
      submit_boss_project: {
        Args: { p_project_id: string; p_student_profile_id: string };
        Returns: { project_id: string; status: BossProjectStatus };
      };
      review_boss_project: {
        Args: {
          p_project_id: string;
          p_teacher_profile_id: string;
          p_decision: FeedbackDecision;
          p_comment: string;
        };
        Returns: { project_id: string; decision: FeedbackDecision };
      };
    };
  };
}

export interface ReviewSubmissionResult {
  submission_id: string;
  decision: FeedbackDecision;
  xp_awarded: number;
  total_xp: number;
  level_number: number | null;
  level_title: string | null;
}
