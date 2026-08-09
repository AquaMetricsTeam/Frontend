import { useQuery } from "@tanstack/react-query";
import { fetchSwimmingPerformancesByTrainingRecord } from "../services/fetchSwimmingPerformancesByTrainingRecord.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";

export function useSwimmingPerformancesByTrainingRecord(
  trainingRecordId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: SWIMMING_PERFORMANCE_KEYS.byTrainingRecord(trainingRecordId),
    queryFn: () =>
      fetchSwimmingPerformancesByTrainingRecord(trainingRecordId),
    enabled: enabled && trainingRecordId > 0,
  });
}
