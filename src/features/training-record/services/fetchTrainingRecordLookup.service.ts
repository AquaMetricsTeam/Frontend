import { customFetch } from "@/services/customFetch";
import type { TrainingRecordLookup } from "../types";

export async function fetchTrainingRecordLookup(): Promise<
  ApiResponse<TrainingRecordLookup[]>
> {
  return customFetch<ApiResponse<TrainingRecordLookup[]>>(
    "/training-record/Lookup",
  );
}
