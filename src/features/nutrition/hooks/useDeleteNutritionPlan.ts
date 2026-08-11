import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteNutritionPlan } from "../services/deleteNutritionPlan.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";

export function useDeleteNutritionPlan(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteNutritionPlan(id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: NUTRITION_KEYS.plans() });
      toast.success(response.message ?? "Nutrition plan deleted successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to delete nutrition plan.");
    },
  });
}
