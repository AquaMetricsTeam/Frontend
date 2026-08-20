import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createChatSession } from "../services/createChatSession.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { CreateChatSessionRequest } from "../types/index";

export function useCreateChatSession(onSuccess?: (sessionId: number) => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("aiChat");

  return useMutation({
    mutationFn: (payload: CreateChatSessionRequest) =>
      createChatSession(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: AI_KEYS.chatSessions() });
      toast.success(response.message ?? t("toasts.createSuccess"));
      onSuccess?.(response.data.id);
    },

    onError: () => {
      toast.error(t("toasts.createError"));
    },
  });
}
