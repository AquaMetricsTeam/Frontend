// Centralised query key factory for the auth feature
export const AUTH_QUERY_KEYS = {
  me: () => ["auth", "me"] as const,
} as const;
