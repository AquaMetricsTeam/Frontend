import { customFetch } from "@/services/customFetch";
import type { ExercisePerformanceResponse } from "@/features/training-record/types";

export async function fetchExercisePerformancesByTrainingRecord(
  trainingRecordId: number,
): Promise<ApiResponse<ExercisePerformanceResponse[]>> {
  return customFetch<ApiResponse<ExercisePerformanceResponse[]>>(
    `/Exercise-Performance/training-record/${trainingRecordId}`,
  );
}
