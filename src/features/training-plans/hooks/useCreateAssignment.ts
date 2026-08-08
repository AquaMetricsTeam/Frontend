import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createAssignment } from "../services/createAssignment.service";
import { ASSIGNMENT_KEYS } from "../constants/queryKeys";

export function useCreateAssignment(_planId?: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("Training plan assigned successfully");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to assign training plan");
    },
  });
}
