import { customFetch } from "@/services/customFetch";
import type { RejectAthleteResponse } from "../types/index";

export async function rejectAthleteRegistration(
  athleteId: string,
): Promise<ApiResponse<RejectAthleteResponse>> {
  return customFetch<ApiResponse<RejectAthleteResponse>>(
    `/users/athletes/${athleteId}/reject`,
    {
      method: "POST",
    },
  );
}
