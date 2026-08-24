import { useQuery } from "@tanstack/react-query";
import { fetchExercisesLookup } from "../services/fetchExercisesLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";
import type { FetchExercisesLookupParams } from "../types/index";

export function useExercisesLookup(
  params?: FetchExercisesLookupParams,
  enabled: boolean = true
) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.exercises(params),
    queryFn: () => fetchExercisesLookup(params),
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
}
