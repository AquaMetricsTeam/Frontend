import { useQuery } from "@tanstack/react-query";
import { getAthleteCurrentTrainingPlan } from "../services/getAthleteCurrentTrainingPlan.service";
import { AI_KEYS } from "../constants/queryKeys";

export function useCurrentTrainingPlan(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: AI_KEYS.athleteCurrentPlan(athleteId, "training"),
    queryFn: () => getAthleteCurrentTrainingPlan(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
