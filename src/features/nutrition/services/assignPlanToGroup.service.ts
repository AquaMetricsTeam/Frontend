import { customFetch } from "@/services/customFetch";
import type { AssignPlanToGroupPayload, GroupAssignmentResponse } from "../types/index";

export async function assignPlanToGroup(
  payload: AssignPlanToGroupPayload,
): Promise<ApiResponse<GroupAssignmentResponse>> {
  return customFetch<ApiResponse<GroupAssignmentResponse>>(
    "/nutrition-plan-assignments/group",
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );
}
