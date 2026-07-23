import { customFetch } from "@/services/customFetch";
import type { LoginPayload, LoginResponse } from "../types";

export async function loginService(
  payload: LoginPayload,
): Promise<ApiResponse<LoginResponse>> {
  return customFetch<ApiResponse<LoginResponse>>("/Auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
