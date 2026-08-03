import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeCoachAssignment } from "../services/removeCoachAssignment.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";
import type { RemoveCoachAssignmentPayload } from "../types/index";

export function useRemoveCoachAssignment(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RemoveCoachAssignmentPayload) =>
      removeCoachAssignment(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ATHLETE_QUERY_KEYS.all });
      toast.success(response.message ?? "Coach assignment removed successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to remove coach assignment.");
    },
  });
}
