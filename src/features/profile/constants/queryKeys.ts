export const PROFILE_QUERY_KEYS = {
  all: ["profile"] as const,
  details: () => [...PROFILE_QUERY_KEYS.all, "details"] as const,
};
