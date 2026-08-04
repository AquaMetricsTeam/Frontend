import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { archiveTrainingPlan } from "../services/archiveTrainingPlan.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";

export function useArchiveTrainingPlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: archiveTrainingPlan,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLAN_KEYS.all });
      toast.success("Training plan archived");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to archive training plan");
    },
  });
}
