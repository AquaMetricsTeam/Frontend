import { customFetch } from "@/services/customFetch";

export async function restoreTrainingPlan(id: number): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(`/training-plans/${id}/restore`, {
    method: "PATCH",
  });
}
