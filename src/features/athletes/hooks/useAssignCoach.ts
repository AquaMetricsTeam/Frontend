import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignCoach } from "../services/assignCoach.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";
import type { AssignCoachPayload } from "../types/index";

export function useAssignCoach(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignCoachPayload) => assignCoach(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ATHLETE_QUERY_KEYS.all });
      toast.success(response.message ?? "Coach assigned successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to assign coach.");
    },
  });
}
