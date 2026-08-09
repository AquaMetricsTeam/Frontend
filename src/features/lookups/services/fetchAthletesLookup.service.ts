import { customFetch } from "@/services/customFetch";
import type { AthleteLookupItem } from "../types/index";

export async function fetchAthletesLookup(): Promise<ApiResponse<AthleteLookupItem[]>> {
  return customFetch<ApiResponse<AthleteLookupItem[]>>("/athletes/lookup");
}
