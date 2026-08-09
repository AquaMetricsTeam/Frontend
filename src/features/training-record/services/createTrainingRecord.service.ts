import { customFetch } from "@/services/customFetch";
import type {
  CreateTrainingRecordPayload,
  TrainingRecordDetailsResponse,
} from "../types";

export async function createTrainingRecord(
  payload: CreateTrainingRecordPayload,
): Promise<ApiResponse<TrainingRecordDetailsResponse>> {
  return customFetch<ApiResponse<TrainingRecordDetailsResponse>>(
    "/training-record",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
