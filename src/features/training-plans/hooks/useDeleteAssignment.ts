import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteAssignment } from "../services/deleteAssignment.service";
import { ASSIGNMENT_KEYS } from "../constants/queryKeys";

export function useDeleteAssignment(planId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAssignment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ASSIGNMENT_KEYS.all });
      toast.success("Assignment removed");
      onSuccess?.();
    },
    onError: () => {
      toast.error("Failed to remove assignment");
    },
  });
}
