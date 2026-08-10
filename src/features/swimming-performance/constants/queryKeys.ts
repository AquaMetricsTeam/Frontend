export const SWIMMING_PERFORMANCE_KEYS = {
  all: ["swimming-performance"] as const,
  list: (filters: object) =>
    [...SWIMMING_PERFORMANCE_KEYS.all, "list", filters] as const,
  detail: (id: number) =>
    [...SWIMMING_PERFORMANCE_KEYS.all, "detail", id] as const,
  byTrainingRecord: (trainingRecordId: number) =>
    [
      ...SWIMMING_PERFORMANCE_KEYS.all,
      "byTrainingRecord",
      trainingRecordId,
    ] as const,
};
