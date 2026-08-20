import { customFetch } from "@/services/customFetch";
import type { AthleteCurrentPlanDto } from "../types/index";

export async function getAthleteCurrentTrainingPlan(
  athleteId: string,
): Promise<ApiResponse<AthleteCurrentPlanDto | null>> {
  return customFetch<ApiResponse<AthleteCurrentPlanDto | null>>(
    `/athletes/${athleteId}/plans/training`,
  );
}
