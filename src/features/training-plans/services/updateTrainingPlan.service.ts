import { customFetch } from "@/services/customFetch";
import type { CreateTrainingPlanPayload, TrainingPlan } from "../types/index";

export async function updateTrainingPlan(
  id: number,
  payload: Omit<CreateTrainingPlanPayload, "assignment">,
): Promise<ApiResponse<TrainingPlan>> {
  return customFetch<ApiResponse<TrainingPlan>>(`/training-plans/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
