import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateNutritionPlan } from "../services/updateNutritionPlan.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { UpdateNutritionPlanPayload } from "../types/index";

export function useUpdateNutritionPlan(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateNutritionPlanPayload) =>
      updateNutritionPlan(payload),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_KEYS.plans() });
      queryClient.invalidateQueries({
        queryKey: NUTRITION_KEYS.planDetail(variables.id),
      });
      toast.success(response.message ?? "Nutrition plan updated successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to update nutrition plan.");
    },
  });
}
