import { useQuery } from "@tanstack/react-query";
import { fetchTrainingRecordDetail } from "../services/fetchTrainingRecordDetail.service";
import { TRAINING_RECORD_KEYS } from "../constants/queryKeys";

export function useTrainingRecordDetail(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: TRAINING_RECORD_KEYS.detail(id),
    queryFn: () => fetchTrainingRecordDetail(id),
    enabled: enabled && id > 0,
  });
}
