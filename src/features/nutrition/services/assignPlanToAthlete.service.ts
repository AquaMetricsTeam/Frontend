import { customFetch } from "@/services/customFetch";
import type { AssignPlanToAthletePayload, NutritionPlanAssignment } from "../types/index";

export async function assignPlanToAthlete(
  payload: AssignPlanToAthletePayload,
): Promise<ApiResponse<NutritionPlanAssignment>> {
  return customFetch<ApiResponse<NutritionPlanAssignment>>(
    "/nutrition-plan-assignments/athlete",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
