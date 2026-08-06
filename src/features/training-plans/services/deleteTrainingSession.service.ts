import { customFetch } from "@/services/customFetch";

export async function deleteTrainingSession(id: number): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(`/training-sessions/${id}`, {
    method: "DELETE",
  });
}
