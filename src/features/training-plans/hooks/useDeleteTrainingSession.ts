import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteTrainingSession } from "../services/deleteTrainingSession.service";
import { SESSION_KEYS } from "../constants/queryKeys";

export function useDeleteTrainingSession(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteTrainingSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all });
      toast.success("Training session deleted");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to delete training session");
    },
  });
}
