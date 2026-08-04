import { customFetch } from "@/services/customFetch";
import type { TrainingPlan } from "../types/index";

export async function fetchTrainingPlan(id: number): Promise<ApiResponse<TrainingPlan>> {
  return customFetch<ApiResponse<TrainingPlan>>(`/training-plans/${id}`);
}
