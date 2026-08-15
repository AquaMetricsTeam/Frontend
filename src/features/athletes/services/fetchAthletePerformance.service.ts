import { customFetch } from "@/services/customFetch";
import type { AthleteOverviewPerformanceResponse } from "../types/index";

export async function fetchAthletePerformance(
  athleteId: string,
): Promise<ApiResponse<AthleteOverviewPerformanceResponse>> {
  return customFetch<ApiResponse<AthleteOverviewPerformanceResponse>>(
    `/athletes/${athleteId}/overview/performance`,
  );
}
