import { useQuery } from "@tanstack/react-query";
import { fetchAthletePerformance } from "../services/fetchAthletePerformance.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";

export function useAthletePerformance(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.performance(athleteId),
    queryFn: () => fetchAthletePerformance(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
