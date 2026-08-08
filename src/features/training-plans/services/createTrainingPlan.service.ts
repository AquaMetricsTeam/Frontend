import { customFetch } from "@/services/customFetch";
import type { CreateTrainingPlanPayload, TrainingPlan } from "../types/index";

export async function createTrainingPlan(
  payload: CreateTrainingPlanPayload,
): Promise<ApiResponse<TrainingPlan>> {
  return customFetch<ApiResponse<TrainingPlan>>("/training-plans", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
