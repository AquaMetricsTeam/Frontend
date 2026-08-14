// ─── Domain Models ────────────────────────────────────────────────────────────

export interface PlanExercise {
  planExerciseId?: number;
  id?: number; // fallback alias for planExerciseId
  exerciseId: number;
  exerciseName?: string | null;
  sets: number;
  reps: number;
  duration: number; // in minutes
  restSeconds?: number;
  intensity?: number | string | null;
  notes?: string | null;
  orderIndex: number;
}

export interface TrainingPlan {
  id: number;
  title: string;
  description: string;
  estimatedDurationMinutes?: number;
  isArchived: boolean;
  planExercises: PlanExercise[];
}

export function calculatePlanDuration(plan: Partial<TrainingPlan>): number {
  if (typeof plan.estimatedDurationMinutes === "number" && plan.estimatedDurationMinutes > 0) {
    return plan.estimatedDurationMinutes;
  }
  return (
    plan.planExercises?.reduce((sum, ex) => sum + (Number(ex?.duration) || 0), 0) ?? 0
  );
}

export const AssignedToType = {
  Group: 1,
  Athlete: 2,
} as const;
export type AssignedToType =
  (typeof AssignedToType)[keyof typeof AssignedToType];

export const AttendanceStatusEnum = {
  Present: 1,
  Absent: 2,
  Late: 3,
  Excused: 4,
} as const;
export type AttendanceStatusEnum =
  (typeof AttendanceStatusEnum)[keyof typeof AttendanceStatusEnum];

export interface AttendanceRecord {
  id?: number;
  athleteId: string;
  athleteName: string;
  status: AttendanceStatusEnum | number;
  recordedAt?: string;
  recordedById?: string;
  recordedByName?: string;
}

export interface MarkAttendancePayload {
  trainingSessionId: number;
  attendance: {
    athleteId: string;
    status: number;
  }[];
}

export interface TrainingPlanAssignment {
  id: number;
  trainingPlanId?: number;
  trainingPlanTitle?: string;
  assignedTo?: string;
  assignedToType?: AssignedToType | number;
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

export interface SessionAthlete {
  athleteId: string;
  fullName: string;
  groupId?: number | null;
  groupName?: string | null;
  profilePictureUrl?: string | null;
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
  groupNames?: string[];
  athletes?: SessionAthlete[];
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
