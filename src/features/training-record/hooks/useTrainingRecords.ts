import { useQuery } from "@tanstack/react-query";
import { fetchTrainingRecords } from "../services/fetchTrainingRecords.service";
import { TRAINING_RECORD_KEYS } from "../constants/queryKeys";
import type { TrainingRecordQueryParams } from "../types";

export function useTrainingRecords(params: TrainingRecordQueryParams = {}) {
  return useQuery({
    queryKey: TRAINING_RECORD_KEYS.list(params),
    queryFn: () => fetchTrainingRecords(params),
  });
}
