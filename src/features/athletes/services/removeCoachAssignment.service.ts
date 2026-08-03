import { customFetch } from "@/services/customFetch";
import type { RemoveCoachAssignmentPayload } from "../types/index";

export async function removeCoachAssignment(
  payload: RemoveCoachAssignmentPayload,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(
    `/athletes/${payload.athleteId}/coach-assignments/${payload.assignmentId}`,
    {
      method: "DELETE",
    },
  );
}
