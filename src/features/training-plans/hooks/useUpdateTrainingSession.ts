import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateTrainingSession } from "../services/updateTrainingSession.service";
import { SESSION_KEYS } from "../constants/queryKeys";
import type { CreateTrainingSessionPayload } from "../types/index";

export function useUpdateTrainingSession(id: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTrainingSessionPayload) =>
      updateTrainingSession(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SESSION_KEYS.all });
      toast.success("Training session updated successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to update training session");
    },
  });
}
