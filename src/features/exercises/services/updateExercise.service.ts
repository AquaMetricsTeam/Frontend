import { customFetch } from "@/services/customFetch";
import type { UpdateExercisePayload, Exercise } from "../types/index";

export async function updateExercise(
  id: number,
  payload: UpdateExercisePayload,
): Promise<ApiResponse<Exercise>> {
  return customFetch<ApiResponse<Exercise>>(`/exercises/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
