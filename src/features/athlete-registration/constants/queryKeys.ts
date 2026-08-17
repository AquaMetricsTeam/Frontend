export const ATHLETE_REGISTRATION_QUERY_KEYS = {
  all: ["athlete-registration"] as const,
  pending: () => [...ATHLETE_REGISTRATION_QUERY_KEYS.all, "pending"] as const,
  detail: (athleteId: string) =>
    [...ATHLETE_REGISTRATION_QUERY_KEYS.all, "detail", athleteId] as const,
};
