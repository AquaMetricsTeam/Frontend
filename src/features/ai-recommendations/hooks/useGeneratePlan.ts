import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { generatePlan } from "../services/generatePlan.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { GenerateAiPlanRequest } from "../types/index";

export function useGeneratePlan(
  onSuccess?: (data: import("../types/index").AiPlanResponse) => void,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("aiPlan");

  return useMutation({
    mutationFn: ({
      payload,
      idempotencyKey,
    }: {
      payload: GenerateAiPlanRequest;
      idempotencyKey: string;
    }) => generatePlan(payload, idempotencyKey),

    meta: { skipGlobalErrorToast: true },

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: AI_KEYS.recommendations() });
      toast.success(response.message ?? t("toasts.generateSuccess"));
      onSuccess?.(response.data);
    },

    onError: (error) => {
      const err = error as Error & { status?: number; errors?: string[] | null };

      if (err.status === 409) {
        toast.error(t("toasts.conflictError"));
        return;
      }
      if (err.status === 403) {
        toast.error(t("toasts.accessError"));
        return;
      }
      if (err.status === 400) {
        if (err.errors?.length) {
          toast.error(err.errors.join(" · "));
        } else {
          toast.error(t("toasts.invalidPlanError"));
        }
        return;
      }
      toast.error(t("toasts.generateError"));
    },
  });
}
