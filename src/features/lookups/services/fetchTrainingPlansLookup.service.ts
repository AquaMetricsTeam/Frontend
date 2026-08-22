import { customFetch } from "@/services/customFetch";
import type { TrainingPlanLookupItem } from "../types/index";

export async function fetchTrainingPlansLookup(): Promise<ApiResponse<TrainingPlanLookupItem[]>> {
  return customFetch<ApiResponse<TrainingPlanLookupItem[]>>("/training-plans/look-up");
}
