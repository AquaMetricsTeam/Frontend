import { customFetch } from "@/services/customFetch";
import type { GroupMember } from "../types/index";

export async function fetchGroupMembers(
  groupId: number,
): Promise<ApiResponse<GroupMember[]>> {
  return customFetch<ApiResponse<GroupMember[]>>(`/groups/${groupId}/athletes`);
}
