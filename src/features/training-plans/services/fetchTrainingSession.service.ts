import { customFetch } from "@/services/customFetch";
import type { TrainingSession } from "../types/index";

export async function fetchTrainingSession(id: number): Promise<ApiResponse<TrainingSession>> {
  return customFetch<ApiResponse<TrainingSession>>(`/training-sessions/${id}`);
}
