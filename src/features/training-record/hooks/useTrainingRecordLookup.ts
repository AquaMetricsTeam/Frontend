import { useQuery } from "@tanstack/react-query";
import { fetchTrainingRecordLookup } from "../services/fetchTrainingRecordLookup.service";
import { TRAINING_RECORD_KEYS } from "../constants/queryKeys";

export function useTrainingRecordLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: TRAINING_RECORD_KEYS.lookup(),
    queryFn: fetchTrainingRecordLookup,
    enabled,
    staleTime: 2 * 60 * 1000,
  });
}
