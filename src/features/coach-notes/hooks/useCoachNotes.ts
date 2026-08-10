import { useQuery } from "@tanstack/react-query";
import { fetchCoachNotes } from "../services/fetchCoachNotes.service";
import { COACH_NOTES_KEYS } from "../constants/queryKeys";
import type { FetchCoachNotesParams } from "../types/index";

export function useCoachNotes(
  params: FetchCoachNotesParams,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: COACH_NOTES_KEYS.list(params),
    queryFn: () => fetchCoachNotes(params),
    enabled,
  });
}
