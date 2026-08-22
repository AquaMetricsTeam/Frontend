import { customFetch } from "@/services/customFetch";
import type { ChangePasswordPayload } from "../types/index";

export async function changePasswordService(
  payload: ChangePasswordPayload,
): Promise<ApiResponse<null>> {
  return customFetch<ApiResponse<null>>("/profile/change-password", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
