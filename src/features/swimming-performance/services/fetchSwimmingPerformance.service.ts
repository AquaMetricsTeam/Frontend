import { customFetch } from "@/services/customFetch";
import type { SwimmingPerformanceDetailsResponse } from "../types";

export async function fetchSwimmingPerformance(
  id: number,
): Promise<ApiResponse<SwimmingPerformanceDetailsResponse>> {
  return customFetch<ApiResponse<SwimmingPerformanceDetailsResponse>>(
    `/swimming-performance/${id}`,
  );
}
