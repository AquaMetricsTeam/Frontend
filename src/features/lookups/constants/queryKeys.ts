export const LOOKUP_QUERY_KEYS = {
  all: ["lookups"] as const,
  coaches: () => [...LOOKUP_QUERY_KEYS.all, "coaches"] as const,
};
