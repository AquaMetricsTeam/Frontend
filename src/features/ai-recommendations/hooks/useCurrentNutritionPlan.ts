import { useQuery } from "@tanstack/react-query";
import { getAthleteCurrentNutritionPlan } from "../services/getAthleteCurrentNutritionPlan.service";
import { AI_KEYS } from "../constants/queryKeys";

export function useCurrentNutritionPlan(athleteId: string, enabled = true) {
  return useQuery({
    queryKey: AI_KEYS.athleteCurrentPlan(athleteId, "nutrition"),
    queryFn: () => getAthleteCurrentNutritionPlan(athleteId),
    enabled: Boolean(athleteId) && enabled,
  });
}
