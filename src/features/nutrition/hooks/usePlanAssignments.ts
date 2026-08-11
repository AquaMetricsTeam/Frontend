import { useQuery, useQueries } from "@tanstack/react-query";
import { getPlanAssignments } from "../services/getPlanAssignments.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { GetPlanAssignmentsParams } from "../types/index";

export function usePlanAssignments(
  planId: string | number,
  params: GetPlanAssignmentsParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: NUTRITION_KEYS.assignmentsByPlan(planId),
    queryFn: () => getPlanAssignments(String(planId), params),
    enabled,
  });
}

export function useAllPlanAssignments(
  planIds: (string | number)[],
  params: GetPlanAssignmentsParams = {},
  enabled = true,
) {
  return useQueries({
    queries: planIds.map((planId) => ({
      queryKey: NUTRITION_KEYS.assignmentsByPlan(planId),
      queryFn: () => getPlanAssignments(String(planId), params),
      enabled,
    })),
  });
}
