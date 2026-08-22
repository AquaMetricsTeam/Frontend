import { useQuery } from "@tanstack/react-query";
import { fetchTrainingPlansLookup } from "../services/fetchTrainingPlansLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";

export function useTrainingPlansLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.trainingPlans(),
    queryFn: fetchTrainingPlansLookup,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
