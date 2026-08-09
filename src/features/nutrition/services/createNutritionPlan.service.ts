import { customFetch } from "@/services/customFetch";
import type { CreateNutritionPlanPayload, NutritionPlan } from "../types/index";

export async function createNutritionPlan(
  payload: CreateNutritionPlanPayload,
): Promise<ApiResponse<NutritionPlan>> {
  return customFetch<ApiResponse<NutritionPlan>>(
    "/nutrition-plans",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
