import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createNutritionPlan } from "../services/createNutritionPlan.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { CreateNutritionPlanPayload } from "../types/index";

export function useCreateNutritionPlan(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNutritionPlanPayload) =>
      createNutritionPlan(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_KEYS.plans() });
      toast.success(response.message ?? "Nutrition plan created successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to create nutrition plan.");
    },
  });
}
