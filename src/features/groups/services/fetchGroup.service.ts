import { customFetch } from "@/services/customFetch";
import type { Group } from "../types/index";

export async function fetchGroup(id: number): Promise<ApiResponse<Group>> {
  return customFetch<ApiResponse<Group>>(`/groups/${id}`);
}
