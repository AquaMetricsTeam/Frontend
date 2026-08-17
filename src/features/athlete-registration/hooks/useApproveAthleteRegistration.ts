import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveAthleteRegistration } from "../services/approveAthleteRegistration.service";
import { ATHLETE_REGISTRATION_QUERY_KEYS } from "../constants/queryKeys";

export function useApproveAthleteRegistration(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (athleteId: string) => approveAthleteRegistration(athleteId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ATHLETE_REGISTRATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message ?? "Athlete registration approved successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to approve athlete registration.");
    },
  });
}
