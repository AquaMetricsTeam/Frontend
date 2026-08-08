import { customFetch } from "@/services/customFetch";

export async function deleteAssignment(assignmentId: number): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>(
    `/training-plan-assignments/${assignmentId}`,
    { method: "DELETE" },
  );
}
