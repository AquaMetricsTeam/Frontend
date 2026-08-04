import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTrainingPlan } from "../services/createTrainingPlan.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";

export function useCreateTrainingPlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLAN_KEYS.all });
      toast.success("Training plan created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create training plan");
    },
  });
}
