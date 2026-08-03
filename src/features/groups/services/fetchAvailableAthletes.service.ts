import { customFetch } from "@/services/customFetch";
import type { AvailableAthlete } from "../types/index";

export async function fetchAvailableAthletes(): Promise<
  ApiResponse<AvailableAthlete[]>
> {
  return customFetch<ApiResponse<AvailableAthlete[]>>(
    "/groups/available-athletes",
  );
}
