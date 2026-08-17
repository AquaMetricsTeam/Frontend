import { customFetch } from "@/services/customFetch";
import type { PendingAthlete } from "../types/index";

export async function fetchPendingAthletes(): Promise<ApiResponse<PendingAthlete[]>> {
  return customFetch<ApiResponse<PendingAthlete[]>>("/users/athletes/pending");
}
