import { customFetch } from "@/services/customFetch";
import type { RefreshPayload, LoginResponse } from "../types";

export async function refreshTokenService(
  payload: RefreshPayload,
): Promise<ApiResponse<LoginResponse>> {
  return customFetch<ApiResponse<LoginResponse>>("/Auth/refresh", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
