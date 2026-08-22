import { customFetch } from "@/services/customFetch";
import type {
  AthleteOverviewTrainingPlansResponse,
  AthleteOverviewTrainingPlanResponse,
} from "../types/index";

export async function fetchAthleteTrainingPlans(
  athleteId: string,
): Promise<ApiResponse<AthleteOverviewTrainingPlansResponse | AthleteOverviewTrainingPlanResponse[]>> {
  return customFetch<ApiResponse<AthleteOverviewTrainingPlansResponse | AthleteOverviewTrainingPlanResponse[]>>(
    `/athletes/${athleteId}/overview/training-plans`,
  );
}
