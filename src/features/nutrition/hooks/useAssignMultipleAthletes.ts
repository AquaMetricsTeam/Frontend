import { useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { assignPlanToAthlete } from "../services/assignPlanToAthlete.service";
import { NUTRITION_KEYS } from "../constants/queryKeys";
import type { AthleteAssignmentResult, MultiAthleteAssignmentResult } from "../types/index";

interface AssignMultiplePayload {
  nutritionPlanId: number;
  athleteIds: { id: string; fullName: string }[];
  startDate: string;
  /** Empty string means "ongoing" (open-ended assignment) */
  endDate: string;
}

interface UseAssignMultipleAthletesReturn {
  assign: (payload: AssignMultiplePayload) => Promise<MultiAthleteAssignmentResult>;
  isPending: boolean;
  result: MultiAthleteAssignmentResult | null;
  reset: () => void;
}

/**
 * Fires one POST /nutrition-plan-assignments/athlete per selected athlete,
 * awaiting each in sequence so we can collect per-athlete success/failure
 * without a dedicated batch endpoint.
 *
 * The result distinguishes:
 *   - succeeded: the server created the assignment
 *   - failed:    the server rejected it (conflict, validation, etc.)
 *
 * After all requests settle, the plan's assignments query is invalidated once.
 */
export function useAssignMultipleAthletes(): UseAssignMultipleAthletesReturn {
  const queryClient = useQueryClient();
  const [isPending, setIsPending] = useState(false);
  const [result, setResult] = useState<MultiAthleteAssignmentResult | null>(null);

  const assign = useCallback(
    async (payload: AssignMultiplePayload): Promise<MultiAthleteAssignmentResult> => {
      const { nutritionPlanId, athleteIds, startDate, endDate } = payload;
      const effectiveEndDate = endDate.trim() ? endDate.trim() : null;

      setIsPending(true);
      setResult(null);

      const succeeded: AthleteAssignmentResult[] = [];
      const failed: AthleteAssignmentResult[] = [];

      for (const athlete of athleteIds) {
        try {
          await assignPlanToAthlete({
            nutritionPlanId,
            athleteId: athlete.id,
            startDate,
            endDate: effectiveEndDate,
          });
          succeeded.push({ athleteId: athlete.id, fullName: athlete.fullName, status: "success" });
        } catch (err: unknown) {
          const message =
            typeof err === "object" && err !== null && "message" in err
              ? String((err as { message?: string }).message)
              : "Unknown error";

          // Heuristic: treat "conflict" / "overlap" / "already" in the message
          // as a conflict rather than a hard error so the UI can present it clearly.
          const isConflict =
            /conflict|overlap|already|exist/i.test(message);

          failed.push({
            athleteId: athlete.id,
            fullName: athlete.fullName,
            status: isConflict ? "conflict" : "error",
            message,
          });
        }
      }

      // Invalidate once after all requests settle.
      queryClient.invalidateQueries({
        queryKey: NUTRITION_KEYS.assignmentsByPlan(nutritionPlanId),
      });
      // Also refresh the global assignments list used by the assignments tab.
      queryClient.invalidateQueries({
        queryKey: NUTRITION_KEYS.assignments(),
      });

      const final: MultiAthleteAssignmentResult = { succeeded, failed };
      setResult(final);
      setIsPending(false);
      return final;
    },
    [queryClient],
  );

  const reset = useCallback(() => setResult(null), []);

  return { assign, isPending, result, reset };
}
