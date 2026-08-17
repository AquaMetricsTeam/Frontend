export const DASHBOARD_QUERY_KEYS = {
  all: ["dashboard"] as const,
  admin: () => [...DASHBOARD_QUERY_KEYS.all, "admin"] as const,
  coach: () => [...DASHBOARD_QUERY_KEYS.all, "coach"] as const,
};
