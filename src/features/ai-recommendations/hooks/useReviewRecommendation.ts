import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { reviewRecommendation } from "../services/reviewRecommendation.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { RecommendationReviewRequest } from "../types/index";

export function useReviewRecommendation(
  recommendationId: number,
  athleteId?: string,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("aiPlan");

  return useMutation({
    mutationFn: (payload: RecommendationReviewRequest) =>
      reviewRecommendation(recommendationId, payload),

    meta: { skipGlobalErrorToast: true },

    onSuccess: (response, variables) => {
      queryClient.invalidateQueries({
        queryKey: AI_KEYS.recommendationDetail(recommendationId),
      });
      queryClient.invalidateQueries({ queryKey: AI_KEYS.recommendations() });

      if (variables.decision === 1) {
        queryClient.invalidateQueries({ queryKey: AI_KEYS.currentPlan() });
        if (athleteId) {
          queryClient.invalidateQueries({
            queryKey: AI_KEYS.athleteCurrentPlan(athleteId, "training"),
          });
          queryClient.invalidateQueries({
            queryKey: AI_KEYS.athleteCurrentPlan(athleteId, "nutrition"),
          });
        }
      }

      toast.success(response.message ?? t("toasts.approveSuccess"));
      onSuccess?.();
    },

    onError: (error) => {
      const err = error as Error & { status?: number };
      if (err.status === 400) {
        toast.error(t("toasts.alreadyDecided"));
      } else {
        toast.error(t("toasts.reviewError"));
      }
    },
  });
}