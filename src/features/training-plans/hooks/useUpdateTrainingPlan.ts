import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTrainingPlan } from "../services/updateTrainingPlan.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";

export function useUpdateTrainingPlan(id: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Parameters<typeof updateTrainingPlan>[1]) =>
      updateTrainingPlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLAN_KEYS.all });
      toast.success("Training plan updated successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update training plan");
    },
  });
}
