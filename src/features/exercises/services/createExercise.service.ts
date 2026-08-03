import { customFetch } from "@/services/customFetch";
import type { CreateExercisePayload, Exercise } from "../types/index";

export async function createExercise(
  payload: CreateExercisePayload,
): Promise<ApiResponse<Exercise>> {
  return customFetch<ApiResponse<Exercise>>("/exercises", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
