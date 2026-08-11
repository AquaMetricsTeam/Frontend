import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignPlanToGroup } from "../services/assignPlanToGroup.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { AssignPlanToGroupPayload } from "../types/index";

export function useAssignPlanToGroup(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignPlanToGroupPayload) =>
      assignPlanToGroup(payload),

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: NUTRITION_KEYS.assignmentsByPlan(variables.nutritionPlanId),
      });
      toast.success(
        response.message ?? "Nutrition plan assigned to group successfully.",
      );
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(
        error?.message ?? "Failed to assign nutrition plan to group.",
      );
    },
  });
}
