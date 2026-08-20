import { customFetch } from "@/services/customFetch";
import type {
  RecommendationReviewRequest,
  AiRecommendationResponse,
} from "../types/index";

export async function reviewRecommendation(
  id: number,
  payload: RecommendationReviewRequest,
): Promise<ApiResponse<AiRecommendationResponse>> {
  return customFetch<ApiResponse<AiRecommendationResponse>>(
    `/ai-recommendations/${id}/review`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
