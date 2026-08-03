import { useQuery } from "@tanstack/react-query";
import { fetchExercises } from "../services/fetchExercises.service";
import { EXERCISE_KEYS } from "../constants/queryKeys";
import type { FetchExercisesParams } from "../types/index";

export function useExercises(params: FetchExercisesParams) {
  const { page = 1, pageSize = 10, search } = params;

  return useQuery({
    queryKey: EXERCISE_KEYS.list({ page, pageSize, search }),
    queryFn: () => fetchExercises({ page, pageSize, search }),
  });
}
