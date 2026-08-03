import { customFetch } from "@/services/customFetch";
import type { UpdateGroupPayload, Group } from "../types/index";

export async function updateGroup(
  id: number,
  payload: UpdateGroupPayload,
): Promise<ApiResponse<Group>> {
  return customFetch<ApiResponse<Group>>(`/groups/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}
