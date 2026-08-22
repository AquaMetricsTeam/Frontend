import type { FetchExercisesLookupParams } from "../types/index";

export const LOOKUP_QUERY_KEYS = {
  all: ["lookups"] as const,
  coaches: () => [...LOOKUP_QUERY_KEYS.all, "coaches"] as const,
  athletes: () => [...LOOKUP_QUERY_KEYS.all, "athletes"] as const,
  availableAthletes: () => [...LOOKUP_QUERY_KEYS.all, "available-athletes"] as const,
  groups: () => [...LOOKUP_QUERY_KEYS.all, "groups"] as const,
  exercises: (params?: FetchExercisesLookupParams) =>
    [...LOOKUP_QUERY_KEYS.all, "exercises", params] as const,
  trainingPlans: () => [...LOOKUP_QUERY_KEYS.all, "training-plans"] as const,
};
