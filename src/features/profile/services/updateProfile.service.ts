import { customFetch } from "@/services/customFetch";
import type { UpdateProfilePayload } from "../types/index";

export async function updateProfileService(
  payload: UpdateProfilePayload,
): Promise<ApiResponse<null>> {
  return customFetch<ApiResponse<null>>("/profile", {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
