import { customFetch } from "@/services/customFetch";
import type { SwimmingPerformance } from "../types";

export async function fetchSwimmingPerformancesByTrainingRecord(
  trainingRecordId: number,
): Promise<ApiResponse<SwimmingPerformance[]>> {
  return customFetch<ApiResponse<SwimmingPerformance[]>>(
    `/swimming-performance/Training-Record/${trainingRecordId}`,
  );
}
