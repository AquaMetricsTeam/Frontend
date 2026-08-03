import { customFetch } from "@/services/customFetch";
import type { AssignAthletesPayload } from "../types/index";

export async function assignAthletes(
  groupId: number,
  payload: AssignAthletesPayload,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(`/groups/${groupId}/athletes`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
