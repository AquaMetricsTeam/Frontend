import { customFetch } from "@/services/customFetch";
import type {
  UpdateSwimmingPerformancePayload,
  SwimmingPerformanceDetailsResponse,
} from "../types";

export async function updateSwimmingPerformance(
  id: number,
  payload: UpdateSwimmingPerformancePayload,
): Promise<ApiResponse<SwimmingPerformanceDetailsResponse>> {
  return customFetch<ApiResponse<SwimmingPerformanceDetailsResponse>>(
    `/swimming-performance/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}
