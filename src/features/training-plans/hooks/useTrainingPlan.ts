import { useQuery } from "@tanstack/react-query";
import { fetchTrainingPlan } from "../services/fetchTrainingPlan.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";

export function useTrainingPlan(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: TRAINING_PLAN_KEYS.detail(id),
    queryFn: () => fetchTrainingPlan(id),
    enabled: enabled && id > 0,
  });
}
