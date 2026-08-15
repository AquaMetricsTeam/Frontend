import { useQuery } from "@tanstack/react-query";
import { fetchAthleteOverview } from "../services/fetchAthleteOverview.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";

export function useAthleteOverview(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.overview(athleteId),
    queryFn: () => fetchAthleteOverview(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
