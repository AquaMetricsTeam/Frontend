import { useQuery } from "@tanstack/react-query";
import { fetchExercisePerformancesByTrainingRecord } from "../services/fetchExercisePerformancesByTrainingRecord.service";

export const EXERCISE_PERFORMANCE_KEYS = {
  all: ["exercise-performance"] as const,
  byTrainingRecord: (trainingRecordId: number) =>
    [...EXERCISE_PERFORMANCE_KEYS.all, "by-training-record", trainingRecordId] as const,
};

export function useExercisePerformancesByTrainingRecord(
  trainingRecordId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: EXERCISE_PERFORMANCE_KEYS.byTrainingRecord(trainingRecordId),
    queryFn: () => fetchExercisePerformancesByTrainingRecord(trainingRecordId),
    enabled: enabled && trainingRecordId > 0,
  });
}
