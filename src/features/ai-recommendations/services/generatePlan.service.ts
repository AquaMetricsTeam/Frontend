import { customFetch } from "@/services/customFetch";
import type {
  GenerateAiPlanRequest,
  AiPlanResponse,
} from "../types/index";

export async function generatePlan(
  payload: GenerateAiPlanRequest,
  idempotencyKey: string,
): Promise<ApiResponse<AiPlanResponse>> {
  return customFetch<ApiResponse<AiPlanResponse>>(
    "/ai-recommendations/generate-plan",
    {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 120_000,
      idempotencyKey,
    },
  );
}
