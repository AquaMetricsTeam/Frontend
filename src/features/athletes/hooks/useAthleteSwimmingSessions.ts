import { useQuery } from "@tanstack/react-query";
import { fetchAthleteSwimmingSessions } from "../services/fetchAthleteSwimmingSessions.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";

export function useAthleteSwimmingSessions(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.swimmingSessions(athleteId),
    queryFn: () => fetchAthleteSwimmingSessions(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
