import { customFetch } from "@/services/customFetch";

export async function removeAthlete(
  groupId: number,
  athleteId: string,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(
    `/groups/${groupId}/athletes/${athleteId}`,
    { method: "DELETE" },
  );
}
