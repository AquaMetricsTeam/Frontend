import { customFetch } from "@/services/customFetch";
import type { ApproveAthleteResponse } from "../types/index";

export async function approveAthleteRegistration(
  athleteId: string,
): Promise<ApiResponse<ApproveAthleteResponse>> {
  return customFetch<ApiResponse<ApproveAthleteResponse>>(
    `/users/athletes/${athleteId}/approve`,
    {
      method: "POST",
    },
  );
}
