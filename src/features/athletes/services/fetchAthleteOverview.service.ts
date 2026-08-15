import { customFetch } from "@/services/customFetch";
import type { AthleteOverviewResponse } from "../types/index";

export async function fetchAthleteOverview(
  athleteId: string,
): Promise<ApiResponse<AthleteOverviewResponse>> {
  return customFetch<ApiResponse<AthleteOverviewResponse>>(
    `/athletes/${athleteId}/overview`,
  );
}
