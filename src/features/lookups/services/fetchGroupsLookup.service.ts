import { customFetch } from "@/services/customFetch";
import type { GroupLookupItem } from "../types/index";

export async function fetchGroupsLookup(): Promise<
  ApiResponse<GroupLookupItem[]>
> {
  return customFetch<ApiResponse<GroupLookupItem[]>>("/groups/groups-lookup");
}
