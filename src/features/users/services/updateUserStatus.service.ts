import { customFetch } from "@/services/customFetch";
import type { UpdateUserStatusPayload } from "../types/index";

export async function updateUserStatus(
  userId: string,
  payload: UpdateUserStatusPayload,
): Promise<ApiResponse<null>> {
  return customFetch<ApiResponse<null>>(`/Users/${userId}/status`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
