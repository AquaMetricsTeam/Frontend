import { customFetch } from "@/services/customFetch";
import type { CreateUserPayload } from "../types/index";

export async function createUser(
  payload: CreateUserPayload,
): Promise<ApiResponse<null>> {
  return customFetch<ApiResponse<null>>("/Users/Create", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
