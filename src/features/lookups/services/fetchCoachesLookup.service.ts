import { customFetch } from "@/services/customFetch";
import type { CoachLookupItem } from "../types/index";

export async function fetchCoachesLookup(): Promise<ApiResponse<CoachLookupItem[]>> {
  return customFetch<ApiResponse<CoachLookupItem[]>>(
    `/users/coaches-lookup`,
  );
}
