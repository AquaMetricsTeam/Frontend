import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../services/fetchExercises.service";
import { EXERCISE_KEYS } from "../constants/queryKeys";
import type { FetchExercisesParams } from "../types/index";

export function useExercises(params: FetchExercisesParams) {
  return useQuery({
    queryKey: EXERCISE_KEYS.list(params),
    queryFn: () => fetchExercises(params),
    staleTime: 0,
    gcTime: 0,
  });
}
