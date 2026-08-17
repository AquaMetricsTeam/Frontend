import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { rejectAthleteRegistration } from "../services/rejectAthleteRegistration.service";
import { ATHLETE_REGISTRATION_QUERY_KEYS } from "../constants/queryKeys";

export function useRejectAthleteRegistration(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (athleteId: string) => rejectAthleteRegistration(athleteId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ATHLETE_REGISTRATION_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ["athletes"] });
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success(response.message ?? "Athlete registration rejected successfully.");
      onSuccessCallback?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to reject athlete registration.");
    },
  });
}
