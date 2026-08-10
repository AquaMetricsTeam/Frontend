import { customFetch } from "@/services/customFetch";
import type {
  UpdateTrainingRecordPayload,
  TrainingRecordDetailsResponse,
} from "../types";

export async function updateTrainingRecord(
  id: number,
  payload: UpdateTrainingRecordPayload,
): Promise<ApiResponse<TrainingRecordDetailsResponse>> {
  return customFetch<ApiResponse<TrainingRecordDetailsResponse>>(
    `/training-record/${id}`,
    {
      method: "PUT",
      body: JSON.stringify(payload),
    },
  );
}
