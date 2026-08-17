import type { FetchExercisesParams } from "../types/index";

export const EXERCISE_KEYS = {
  all: ["exercises"] as const,
  list: (params: FetchExercisesParams) =>
    [...EXERCISE_KEYS.all, "list", params] as const,
  detail: (id: number) => [...EXERCISE_KEYS.all, "detail", id] as const,
} as const;
