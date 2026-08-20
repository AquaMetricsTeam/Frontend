import { customFetch } from "@/services/customFetch";
import type { AiRecommendationResponse } from "../types/index";

export async function getRecommendation(
  id: number,
): Promise<ApiResponse<AiRecommendationResponse>> {
  return customFetch<ApiResponse<AiRecommendationResponse>>(
    `/ai-recommendations/${id}`,
  );
}
