import { useQuery } from "@tanstack/react-query";
import { fetchAssignments } from "../services/fetchAssignments.service";
import { ASSIGNMENT_KEYS } from "../constants/queryKeys";

export function useAssignments(planId: number, enabled: boolean = true) {
  return useQuery({
    queryKey: ASSIGNMENT_KEYS.byPlan(planId),
    queryFn: () => fetchAssignments(planId),
    enabled: enabled && planId > 0,
  });
}
