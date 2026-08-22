import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateProfileService } from "../services/updateProfile.service";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants/queryKeys";
import type { UpdateProfilePayload } from "../types/index";

export function useUpdateProfile(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => updateProfileService(payload),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Profile updated successfully");
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to update profile");
    },
  });
}
