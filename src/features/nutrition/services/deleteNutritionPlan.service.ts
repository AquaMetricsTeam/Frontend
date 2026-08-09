import { customFetch } from "@/services/customFetch";

export async function deleteNutritionPlan(id: string): Promise<ApiResponse<void>> {
  return customFetch<ApiResponse<void>>(
    `/nutrition-plans/${id}`,
    {
      method: "DELETE",
    },
  );
}
