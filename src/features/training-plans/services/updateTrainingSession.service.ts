import { customFetch } from "@/services/customFetch";
import type { CreateTrainingSessionPayload, TrainingSession } from "../types/index";

export async function updateTrainingSession(
  id: number,
  payload: CreateTrainingSessionPayload,
): Promise<ApiResponse<TrainingSession>> {
  return customFetch<ApiResponse<TrainingSession>>(`/training-sessions/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
