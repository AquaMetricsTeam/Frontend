import { customFetch } from "@/services/customFetch";
import type { CreateAssignmentPayload } from "../types/index";

export async function createAssignment(
  payload: CreateAssignmentPayload,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>("/training-plan-assignments", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
