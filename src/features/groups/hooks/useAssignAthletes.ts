import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { assignAthletes } from "../services/assignAthletes.service";
import { GROUP_KEYS } from "../constants/queryKeys";
import type { AssignAthletesPayload } from "../types/index";

export function useAssignAthletes(groupId: number, onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AssignAthletesPayload) =>
      assignAthletes(groupId, payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.members(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.availableAthletes });
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.list({}) });
      toast.success(response.message ?? "Athletes assigned successfully.");
      onSuccess?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to assign athletes.");
    },
  });
}
