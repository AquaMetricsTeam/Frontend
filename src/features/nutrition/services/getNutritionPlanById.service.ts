import { customFetch } from "@/services/customFetch";
import type { NutritionPlan } from "../types/index";

export async function getNutritionPlanById(
  id: string,
): Promise<ApiResponse<NutritionPlan>> {
  return customFetch<ApiResponse<NutritionPlan>>(
    `/nutrition-plans/${id}`,
  );
}
