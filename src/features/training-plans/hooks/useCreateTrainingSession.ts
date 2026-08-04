import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createTrainingSession } from "../services/createTrainingSession.service";
import { SESSION_KEYS } from "../constants/queryKeys";

export function useCreateTrainingSession(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all });
      toast.success("Training session created successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to create training session");
    },
  });
}
