import { customFetch } from "@/services/customFetch";
import type { AthleteOverviewSwimmingSessionResponse } from "../types/index";

export async function fetchAthleteSwimmingSessions(
  athleteId: string,
): Promise<ApiResponse<AthleteOverviewSwimmingSessionResponse[]>> {
  return customFetch<ApiResponse<AthleteOverviewSwimmingSessionResponse[]>>(
    `/athletes/${athleteId}/overview/swimming-sessions`,
  );
}
