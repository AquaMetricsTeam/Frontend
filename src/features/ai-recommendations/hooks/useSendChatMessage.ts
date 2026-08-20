import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { sendChatMessage } from "../services/sendChatMessage.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { SendChatMessageRequest } from "../types/index";

export function useSendChatMessage(
  sessionId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("aiChat");

  return useMutation({
    mutationFn: (payload: SendChatMessageRequest) =>
      sendChatMessage(sessionId, payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: AI_KEYS.chatSessions(),
      });
      onSuccess?.();
    },

    onError: () => {
      toast.error(t("toasts.sendError"));
    },
  });
}
