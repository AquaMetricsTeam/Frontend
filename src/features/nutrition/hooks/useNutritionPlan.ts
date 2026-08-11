import { useQuery } from "@tanstack/react-query";
import { getNutritionPlanById } from "../services/getNutritionPlanById.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";

export function useNutritionPlan(id: string, enabled = true) {
  return useQuery({
    queryKey: NUTRITION_KEYS.planDetail(id),
    queryFn: () => getNutritionPlanById(id),
    enabled,
  });
}
