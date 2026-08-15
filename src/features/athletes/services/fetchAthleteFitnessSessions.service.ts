import { customFetch } from "@/services/customFetch";
import type { AthleteOverviewFitnessSessionResponse } from "../types/index";

export async function fetchAthleteFitnessSessions(
  athleteId: string,
): Promise<ApiResponse<AthleteOverviewFitnessSessionResponse[]>> {
  return customFetch<ApiResponse<AthleteOverviewFitnessSessionResponse[]>>(
    `/athletes/${athleteId}/overview/fitness-sessions`,
  );
}
