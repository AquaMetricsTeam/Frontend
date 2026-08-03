import { customFetch } from "@/services/customFetch";
import type { AssignCoachPayload } from "../types/index";

export async function assignCoach(
  payload: AssignCoachPayload,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(
    `/athletes/${payload.athleteId}/coach-assignments`,
    {
      method: "POST",
      body: JSON.stringify({ coachId: payload.coachId }),
    },
  );
}
