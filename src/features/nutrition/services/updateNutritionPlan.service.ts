import { customFetch } from "@/services/customFetch";
import type { UpdateNutritionPlanPayload, NutritionPlan } from "../types/index";

export async function updateNutritionPlan(
  payload: UpdateNutritionPlanPayload,
): Promise<ApiResponse<NutritionPlan>> {
  const { id, ...body } = payload;
  
  return customFetch<ApiResponse<NutritionPlan>>(
    `/nutrition-plans/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(body),
    },
  );
}
