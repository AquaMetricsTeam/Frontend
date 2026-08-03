import { useQuery } from "@tanstack/react-query";
import { fetchCoachAthletes } from "../services/fetchCoachAthletes.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";
import type { FetchAthletesParams } from "../types/index";

export function useCoachAthletes(params: FetchAthletesParams, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.coachList(params),
    queryFn: () => fetchCoachAthletes(params),
    enabled,
  });
}
