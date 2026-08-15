import { useQuery } from "@tanstack/react-query";
import { fetchAthleteTrainingPlans } from "../services/fetchAthleteTrainingPlans.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";

export function useAthleteTrainingPlans(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.trainingPlans(athleteId),
    queryFn: () => fetchAthleteTrainingPlans(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
