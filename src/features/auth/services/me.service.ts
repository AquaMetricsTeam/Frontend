import { customFetch } from "@/services/customFetch";
import type { AuthUser } from "../types";

export async function getMeService(): Promise<ApiResponse<AuthUser>> {
  return customFetch<ApiResponse<AuthUser>>("/Auth/me");
}
