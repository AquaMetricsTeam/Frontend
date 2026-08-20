import { useQuery } from "@tanstack/react-query";
import { getChatMessages } from "../services/getChatMessages.service";
import { AI_KEYS } from "../constants/queryKeys";

export function useChatMessages(sessionId: number, enabled = true) {
  return useQuery({
    queryKey: AI_KEYS.chatMessages(sessionId),
    queryFn: () => getChatMessages(sessionId),
    enabled: Boolean(sessionId) && enabled,
  });
}
