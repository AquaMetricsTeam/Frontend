import { customFetch } from "@/services/customFetch";
import type { AthleteLookupItem } from "../types/index";

export async function fetchAthletesLookup(): Promise<ApiResponse<AthleteLookupItem[]>> {
  const res = await customFetch<ApiResponse<AthleteLookupItem[]>>("/groups/available-athletes");
  if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
    return res;
  }
  return customFetch<ApiResponse<AthleteLookupItem[]>>("/users/athletes-lookup");
}
