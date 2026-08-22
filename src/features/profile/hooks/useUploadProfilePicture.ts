import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { uploadProfilePictureService } from "../services/uploadProfilePicture.service";
import { AUTH_QUERY_KEYS } from "@/features/auth/constants/queryKeys";

export function useUploadProfilePicture(onSuccessCallback?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadProfilePictureService(file),
    onSuccess: (res) => {
      toast.success(res?.message ?? "Profile picture updated successfully");
      queryClient.invalidateQueries({ queryKey: AUTH_QUERY_KEYS.me() });
      onSuccessCallback?.();
    },
    onError: (err: any) => {
      toast.error(err?.message ?? "Failed to upload profile picture");
    },
  });
}
