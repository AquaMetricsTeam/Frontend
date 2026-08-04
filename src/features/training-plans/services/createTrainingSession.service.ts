import { customFetch } from "@/services/customFetch";
import type { CreateTrainingSessionPayload, TrainingSession } from "../types/index";

export async function createTrainingSession(
  payload: CreateTrainingSessionPayload,
): Promise<ApiResponse<TrainingSession>> {
  return customFetch<ApiResponse<TrainingSession>>("/training-sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
