import { customFetch } from "@/services/customFetch";
import type { TrainingPlanAssignment } from "../types/index";

export async function fetchAssignments(
  planId: number,
): Promise<ApiResponse<TrainingPlanAssignment[]>> {
  return customFetch<ApiResponse<TrainingPlanAssignment[]>>(
    `/training-plan-assignments/training-plan/${planId}`,
  );
}
