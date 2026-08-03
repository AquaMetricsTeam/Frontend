import { customFetch } from "@/services/customFetch";

export async function deleteExercise(
  id: number,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(`/exercises/${id}`, {
    method: "DELETE",
  });
}
