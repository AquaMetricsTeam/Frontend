import type {
  TrainingRecordResponse,
  TrainingRecordPaginatedResponse,
  TrainingRecordQueryParams,
  ExercisePerformanceRequest,
  ExercisePerformanceResponse,
} from "@/features/training-record/types";

// Re-export what fitness feature needs from training-record
export type {
  TrainingRecordResponse,
  TrainingRecordPaginatedResponse,
  TrainingRecordQueryParams,
  ExercisePerformanceRequest,
  ExercisePerformanceResponse,
};

// ─── Fitness-specific form types ──────────────────────────────────────────────

export interface FitnessRecordFilters {
  page: number;
  search: string;
  athleteId?: string;
  sessionCompleted?: boolean;
  injuryOccurred?: boolean;
  descending: boolean;
}
