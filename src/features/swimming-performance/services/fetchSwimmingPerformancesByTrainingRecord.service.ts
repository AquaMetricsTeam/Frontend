import { customFetch } from "@/services/customFetch";
import type { SwimmingPerformanceResponse } from "../types";

export async function fetchSwimmingPerformancesByTrainingRecord(
  trainingRecordId: number,
): Promise<ApiResponse<SwimmingPerformanceResponse[]>> {
  return customFetch<ApiResponse<SwimmingPerformanceResponse[]>>(
    `/swimming-performance/training-record/${trainingRecordId}`,
  );
}
