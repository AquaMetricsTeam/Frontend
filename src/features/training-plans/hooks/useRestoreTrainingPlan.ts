import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { restoreTrainingPlan } from "../services/restoreTrainingPlan.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";

export function useRestoreTrainingPlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: restoreTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLAN_KEYS.all });
      toast.success("Training plan restored");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to restore training plan");
    },
  });
}
