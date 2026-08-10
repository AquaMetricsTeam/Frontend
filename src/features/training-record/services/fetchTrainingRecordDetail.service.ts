import { customFetch } from "@/services/customFetch";
import type { TrainingRecordDetailsResponse } from "../types";

export async function fetchTrainingRecordDetail(
  id: number,
): Promise<ApiResponse<TrainingRecordDetailsResponse>> {
  return customFetch<ApiResponse<TrainingRecordDetailsResponse>>(
    `/training-record/${id}`,
  );
}
