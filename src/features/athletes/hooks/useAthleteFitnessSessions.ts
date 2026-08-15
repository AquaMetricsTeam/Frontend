import { useQuery } from "@tanstack/react-query";
import { fetchAthleteFitnessSessions } from "../services/fetchAthleteFitnessSessions.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";

export function useAthleteFitnessSessions(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.fitnessSessions(athleteId),
    queryFn: () => fetchAthleteFitnessSessions(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
