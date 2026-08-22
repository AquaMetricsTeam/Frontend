import { customFetch } from "@/services/customFetch";
import type { TrainingSession } from "../types/index";

export async function fetchTrainingSession(
  id: number,
  isPresent: boolean = false,
): Promise<ApiResponse<TrainingSession>> {
  const query = new URLSearchParams();
  if (isPresent) query.set("isPresent", "true");
  const qs = query.toString();
  return customFetch<ApiResponse<TrainingSession>>(
    `/training-sessions/${id}${qs ? `?${qs}` : ""}`,
  );
}
