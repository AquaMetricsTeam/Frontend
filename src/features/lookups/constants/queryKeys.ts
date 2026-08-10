export const LOOKUP_QUERY_KEYS = {
  all: ["lookups"] as const,
  coaches: () => [...LOOKUP_QUERY_KEYS.all, "coaches"] as const,
  athletes: () => [...LOOKUP_QUERY_KEYS.all, "athletes"] as const,
  availableAthletes: () => [...LOOKUP_QUERY_KEYS.all, "available-athletes"] as const,
  groups: () => [...LOOKUP_QUERY_KEYS.all, "groups"] as const,
  exercises: () => [...LOOKUP_QUERY_KEYS.all, "exercises"] as const,
};
