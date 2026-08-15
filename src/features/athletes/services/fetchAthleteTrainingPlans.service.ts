import { customFetch } from "@/services/customFetch";
import type { AthleteOverviewTrainingPlanResponse } from "../types/index";

export async function fetchAthleteTrainingPlans(
  athleteId: string,
): Promise<ApiResponse<AthleteOverviewTrainingPlanResponse[]>> {
  return customFetch<ApiResponse<AthleteOverviewTrainingPlanResponse[]>>(
    `/athletes/${athleteId}/overview/training-plans`,
  );
}
