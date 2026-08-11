import { customFetch } from "@/services/customFetch";
import type { GetNutritionPlansParams, NutritionPlansPaginatedResponse } from "../types/index";

export async function getNutritionPlans(
  params: GetNutritionPlansParams,
): Promise<ApiResponse<NutritionPlansPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);

  return customFetch<ApiResponse<NutritionPlansPaginatedResponse>>(
    `/nutrition-plans?${query.toString()}`,
  );
}
