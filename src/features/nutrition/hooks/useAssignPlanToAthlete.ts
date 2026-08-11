import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignPlanToAthlete } from "../services/assignPlanToAthlete.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { AssignPlanToAthletePayload } from "../types/index";

export function useAssignPlanToAthlete(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignPlanToAthletePayload) =>
      assignPlanToAthlete(payload),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: NUTRITION_KEYS.assignmentsByPlan(String(variables.nutritionPlanId)),
      });
      toast.success(
        response.message ?? "Nutrition plan assigned to athlete successfully.",
      );
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(
        error?.message ?? "Failed to assign nutrition plan to athlete.",
      );
    },
  });
}
