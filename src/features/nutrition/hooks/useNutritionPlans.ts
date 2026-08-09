import { useQuery } from "@tanstack/react-query";
import { getNutritionPlans } from "../services/getNutritionPlans.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { GetNutritionPlansParams } from "../types/index";

export function useNutritionPlans(params: GetNutritionPlansParams, enabled = true) {
  return useQuery({
    queryKey: NUTRITION_KEYS.planList(params),
    queryFn: () => getNutritionPlans(params),
    enabled,
  });
}
