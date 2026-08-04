// ─── Domain Models ────────────────────────────────────────────────────────────

export interface PlanExercise {
  exerciseId: number;
  exerciseName?: string;
  sets: number;
  reps: number;
  duration: number;
  intensity?: number;
  notes?: string;
  orderIndex: number;
}

export interface TrainingPlan {
  id: number;
  title: string;
  description: string;
  estimatedDurationMinutes: number;
  isArchived: boolean;
  planExercises: PlanExercise[];
}

export interface TrainingPlanAssignment {
  id: number;
  trainingPlanId?: number;
  trainingPlanTitle?: string;
  assignedTo?: string;
  assignedToType?: number;
  status?: string;
  assignedAt?: string;
  athlete?: {
    athleteId: string;
    fullName: string;
    profilePictureUrl?: string | null;
  } | null;
  group?: {
    id: number;
    name: string;
    athleteCount?: number;
  } | null;
}

export interface TrainingSession {
  id: number;
  title: string;
  description?: string;
  trainingPlanId: number;
  trainingPlanTitle: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

// ─── Paginated Wrappers ────────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}

export type TrainingPlansPaginatedResponse = PaginatedResponse<TrainingPlan>;
export type SessionsPaginatedResponse = PaginatedResponse<TrainingSession>;

// ─── Request Payloads ──────────────────────────────────────────────────────────

export interface CreateTrainingPlanPayload {
  title: string;
  description: string;
  planExercises: Omit<PlanExercise, "exerciseName">[];
  assignment?: {
    groupIds: number[];
    athleteIds: string[];
  };
}

export interface CreateAssignmentPayload {
  trainingPlanId: number;
  groupIds: number[];
  athleteIds: string[];
}

export interface CreateTrainingSessionPayload {
  title: string;
  description?: string;
  trainingPlanId: number;
  sessionDate: string;
  startTime: string;
  endTime: string;
  location: string;
  notes?: string;
}

// ─── Fetch Params ──────────────────────────────────────────────────────────────

export interface FetchTrainingPlansParams {
  pageNumber?: number;
  pageSize?: number;
  search?: string;
  isArchived?: boolean;
}

export interface FetchSessionsParams {
  pageNumber?: number;
  pageSize?: number;
}
