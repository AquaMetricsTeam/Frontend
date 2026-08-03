import { customFetch } from "@/services/customFetch";
import type { CreateGroupPayload, Group } from "../types/index";

export async function createGroup(
  payload: CreateGroupPayload,
): Promise<ApiResponse<Group>> {
  return customFetch<ApiResponse<Group>>("/groups", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
