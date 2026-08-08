import { customFetch } from "@/services/customFetch";

export async function archiveTrainingPlan(id: number): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(`/training-plans/${id}/archive`, {
    method: "PATCH",
  });
}
