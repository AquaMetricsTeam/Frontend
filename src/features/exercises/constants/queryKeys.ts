export const EXERCISE_KEYS = {
  all: ["exercises"] as const,
  list: (params: {
    page?: number;
    pageSize?: number;
    search?: string;
  }) => [...EXERCISE_KEYS.all, "list", params] as const,
  detail: (id: number) => [...EXERCISE_KEYS.all, "detail", id] as const,
} as const;
