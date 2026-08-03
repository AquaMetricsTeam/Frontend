import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteGroup } from "../services/deleteGroup.service";
import { GROUP_KEYS } from "../constants/queryKeys";

export function useDeleteGroup(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteGroup(id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.all });
      toast.success(response.message ?? "Group deleted successfully.");
      onSuccess?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to delete group.");
    },
  });
}
