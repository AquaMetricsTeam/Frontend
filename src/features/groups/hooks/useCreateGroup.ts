import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createGroup } from "../services/createGroup.service";
import { GROUP_KEYS } from "../constants/queryKeys";
import { LOOKUP_QUERY_KEYS } from "@/features/lookups/constants/queryKeys";
import type { CreateGroupPayload } from "../types/index";

export function useCreateGroup(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateGroupPayload) => createGroup(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: GROUP_KEYS.all });
      queryClient.invalidateQueries({ queryKey: LOOKUP_QUERY_KEYS.all });
      toast.success(response.message ?? "Group created successfully.");
      onSuccess();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to create group.");
    },
  });
}
