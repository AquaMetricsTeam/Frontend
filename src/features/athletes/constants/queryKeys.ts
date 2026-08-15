import type { FetchAthletesParams } from "../types/index";

export const ATHLETE_QUERY_KEYS = {
  all: ["athletes"] as const,
  adminList: (params: FetchAthletesParams) =>
    [...ATHLETE_QUERY_KEYS.all, "admin", "list", params] as const,
  coachList: (params: FetchAthletesParams) =>
    [...ATHLETE_QUERY_KEYS.all, "coach", "list", params] as const,
  overview: (athleteId: string) =>
    [...ATHLETE_QUERY_KEYS.all, "overview", athleteId] as const,
  swimmingSessions: (athleteId: string) =>
    [...ATHLETE_QUERY_KEYS.all, "swimmingSessions", athleteId] as const,
  fitnessSessions: (athleteId: string) =>
    [...ATHLETE_QUERY_KEYS.all, "fitnessSessions", athleteId] as const,
  trainingPlans: (athleteId: string) =>
    [...ATHLETE_QUERY_KEYS.all, "trainingPlans", athleteId] as const,
  performance: (athleteId: string) =>
    [...ATHLETE_QUERY_KEYS.all, "performance", athleteId] as const,
};

