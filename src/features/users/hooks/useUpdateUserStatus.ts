import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateUserStatus } from "../services/updateUserStatus.service";
import { USER_KEYS } from "../constants/queryKeys";
import type { UpdateUserStatusPayload } from "../types/index";

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      userId,
      payload,
    }: {
      userId: string;
      payload: UpdateUserStatusPayload;
    }) => updateUserStatus(userId, payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: USER_KEYS.all });
      toast.success(response.message ?? "User status updated successfully.");
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to update user status.");
    },
  });
}
