import { useQuery } from "@tanstack/react-query";
import { fetchExercisesLookup } from "../services/fetchExercisesLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";

export function useExercisesLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.exercises(),
    queryFn: fetchExercisesLookup,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
