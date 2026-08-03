import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { removeAthlete } from "../services/removeAthlete.service";
import { GROUP_KEYS } from "../constants/queryKeys";
import type { GroupMember } from "../types/index";

export function useRemoveAthlete(groupId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (athleteId: string) => removeAthlete(groupId, athleteId),

    onMutate: async (athleteId) => {
      await queryClient.cancelQueries({
        queryKey: GROUP_KEYS.members(groupId),
      });

      const previous = queryClient.getQueryData<ApiResponse<GroupMember[]>>(
        GROUP_KEYS.members(groupId),
      );

      queryClient.setQueryData<ApiResponse<GroupMember[]>>(
        GROUP_KEYS.members(groupId),
        (old) => {
          if (!old?.data) return old;
          return {
            ...old,
            data: old.data.filter((m) => m.athleteId !== athleteId),
          };
        },
      );

      return { previous };
    },

    onError: (error: { message?: string }, _athleteId, context) => {
      if (context?.previous) {
        queryClient.setQueryData(GROUP_KEYS.members(groupId), context.previous);
      }
      toast.error(error?.message ?? "Failed to remove athlete.");
    },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.members(groupId) });
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.availableAthletes });
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.list({}) });
      toast.success(response.message ?? "Athlete removed successfully.");
    },
  });
}
