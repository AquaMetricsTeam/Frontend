export const TRAINING_RECORD_KEYS = {
  all: ["training-record"] as const,
  lookup: () => [...TRAINING_RECORD_KEYS.all, "lookup"] as const,
  list: (filters: object) =>
    [...TRAINING_RECORD_KEYS.all, "list", filters] as const,
  detail: (id: number) =>
    [...TRAINING_RECORD_KEYS.all, "detail", id] as const,
};
