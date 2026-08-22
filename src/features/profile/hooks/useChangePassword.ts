import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { changePasswordService } from "../services/changePassword.service";
import type { ChangePasswordPayload } from "../types/index";

export function useChangePassword(onSuccessCallback?: () => void) {
  return useMutation({
    mutationFn: (payload: ChangePasswordPayload) => changePasswordService(payload),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Password changed successfully");
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to change password");
    },
  });
}
