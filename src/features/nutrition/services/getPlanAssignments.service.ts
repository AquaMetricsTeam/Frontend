import { customFetch } from "@/services/customFetch";
import type { GetPlanAssignmentsParams, NutritionPlanAssignment } from "../types/index";

export async function getPlanAssignments(
  nutritionPlanId: string,
  params: GetPlanAssignmentsParams,
): Promise<ApiResponse<NutritionPlanAssignment[]>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));

  return customFetch<ApiResponse<NutritionPlanAssignment[]>>(
    `/nutrition-plan-assignments/plan/${nutritionPlanId}?${query.toString()}`,
  );
}
