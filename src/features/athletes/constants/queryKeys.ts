import type { FetchAthletesParams } from "../types/index";

export const ATHLETE_QUERY_KEYS = {
  all: ["athletes"] as const,
  adminList: (params: FetchAthletesParams) =>
    [...ATHLETE_QUERY_KEYS.all, "admin", "list", params] as const,
  coachList: (params: FetchAthletesParams) =>
    [...ATHLETE_QUERY_KEYS.all, "coach", "list", params] as const,
};
