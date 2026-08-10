import type { FetchCoachNotesParams } from "../types/index";

export const COACH_NOTES_KEYS = {
  all: ["coach-notes"] as const,
  lists: () => [...COACH_NOTES_KEYS.all, "list"] as const,
  list: (params: FetchCoachNotesParams) =>
    [...COACH_NOTES_KEYS.lists(), params] as const,
  byAthlete: (athleteId: string) =>
    [...COACH_NOTES_KEYS.all, "athlete", athleteId] as const,
  details: () => [...COACH_NOTES_KEYS.all, "detail"] as const,
  detail: (id: string | number) =>
    [...COACH_NOTES_KEYS.details(), id] as const,
};
