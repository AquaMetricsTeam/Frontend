import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTrainingPlan } from "../services/createTrainingPlan.service";
import { TRAINING_PLAN_KEYS } from "../constants/queryKeys";
import { LOOKUP_QUERY_KEYS } from "@/features/lookups/constants/queryKeys";

export function useCreateTrainingPlan(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrainingPlan,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLAN_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: LOOKUP_QUERY_KEYS.availableAthletes(),
      });
      toast.success(data.message);
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
