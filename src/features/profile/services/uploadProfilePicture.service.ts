import { customFetch } from "@/services/customFetch";
import type { UploadProfilePictureResponse } from "../types/index";

export async function uploadProfilePictureService(
  file: File,
): Promise<ApiResponse<UploadProfilePictureResponse>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("profilePicture", file);

  return customFetch<ApiResponse<UploadProfilePictureResponse>>(
    "/profile/profile-picture",
    {
      method: "POST",
      body: formData,
    },
  );
}
