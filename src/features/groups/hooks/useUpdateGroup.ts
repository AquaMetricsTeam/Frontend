import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateGroup } from "../services/updateGroup.service";
import { GROUP_KEYS } from "../constants/queryKeys";
import { LOOKUP_QUERY_KEYS } from "@/features/lookups/constants/queryKeys";
import type { UpdateGroupPayload } from "../types/index";

export function useUpdateGroup(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateGroupPayload }) =>
      updateGroup(id, payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.all });
      queryClient.invalidateQueries({ queryKey: LOOKUP_QUERY_KEYS.all });
      toast.success(response.message ?? "Group updated successfully.");
      onSuccess();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to update group.");
    },
  });
}
