import type { SwimmingDrillRequest } from "@/features/swimming-performance/types";
export {
  InjuryBodyPart,
  InjuryType,
  INJURY_BODY_PART_OPTIONS,
  INJURY_TYPE_OPTIONS,
  getInjuryBodyPartLabel,
  getInjuryTypeLabel,
} from "../constants/injury";
import type { InjuryBodyPart, InjuryType } from "../constants/injury";

// ─── Enums ────────────────────────────────────────────────────────────────────

export const PerformanceStatus = {
  Completed: 1,
  PartiallyCompleted: 2,
  Skipped: 3,
  Modified: 4,
} as const;
export type PerformanceStatus =
  (typeof PerformanceStatus)[keyof typeof PerformanceStatus];

// ─── Exercise Performance ─────────────────────────────────────────────────────

export interface ExercisePerformanceRequest {
  planExerciseId: number;
  completedSets: number;
  completedReps: number;
  completedDuration?: number | null;
  weightUsed?: number | null;
  rpe?: number | null;
  status: PerformanceStatus;
  coachComment?: string | null;
}

export interface ExercisePerformanceResponse {
  id: number;
  planExerciseId: number;
  exerciseId: number;
  exerciseTitle: string;
  plannedSets: number;
  plannedReps: number;
  plannedDuration: number;
  plannedRestSeconds?: number | null;
  completedSets: number;
  completedReps: number;
  completedDuration?: number | null;
  weightUsed?: number | null;
  rpe?: number | null;
  status: PerformanceStatus;
  coachComment?: string | null;
}

// ─── Training Record ──────────────────────────────────────────────────────────

export interface TrainingRecordLookup {
  id: number;
  athleteId: string;
  athleteName: string;
  trainingSessionId: number;
  sessionDate: string;
  sessionTitle: string;
  performanceRating: number;
}

export interface TrainingRecordResponse {
  id: number;
  athleteId: string;
  athleteName: string;
  trainingSessionId: number;
  sessionDate: string;
  sessionTitle: string;
  performanceRating: number;
  fatigueLevel: number;
  sessionCompleted: boolean;
  injuryOccurred: boolean;
  injuryType?: InjuryType | null;
  injuryBodyPart?: InjuryBodyPart | null;
  injuryComment?: string | null;
}

export interface TrainingRecordDetailsResponse {
  id: number;
  athleteId: string;
  athleteName: string;
  trainingSessionId: number;
  sessionTitle: string;
  sessionDate: string;
  performanceRating: number;
  fatigueLevel: number;
  sessionCompleted: boolean;
  injuryOccurred: boolean;
  injuryType?: InjuryType | null;
  injuryBodyPart?: InjuryBodyPart | null;
  injuryComment?: string | null;
  overallComment?: string | null;
  exercisePerformances: ExercisePerformanceResponse[];
}

// ─── Payloads ─────────────────────────────────────────────────────────────────

export interface CreateTrainingRecordPayload {
  athleteId: string;
  trainingSessionId: number;
  performanceRating: number;
  fatigueLevel: number;
  sessionCompleted: boolean;
  injuryOccurred: boolean;
  injuryType?: InjuryType | null;
  injuryBodyPart?: InjuryBodyPart | null;
  injuryComment?: string | null;
  overallComment?: string | null;
  exercisePerformances: ExercisePerformanceRequest[];
  swimmingPerformances: SwimmingDrillRequest[];
}

export interface UpdateTrainingRecordPayload {
  performanceRating: number;
  fatigueLevel: number;
  sessionCompleted: boolean;
  injuryOccurred: boolean;
  injuryType?: InjuryType | null;
  injuryBodyPart?: InjuryBodyPart | null;
  injuryComment?: string | null;
  overallComment?: string | null;
  exercisePerformances: ExercisePerformanceRequest[];
}

// ─── Query Params ─────────────────────────────────────────────────────────────

export interface TrainingRecordQueryParams {
  pageIndex?: number;
  pageSize?: number;
  athleteId?: string;
  trainingSessionId?: number;
  injuryOccurred?: boolean;
  sessionCompleted?: boolean;
  minPerformanceRating?: number;
  maxPerformanceRating?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
  descending?: boolean;
}

export interface TrainingRecordPaginatedResponse {
  items: TrainingRecordResponse[];
  pageIndex: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
}
