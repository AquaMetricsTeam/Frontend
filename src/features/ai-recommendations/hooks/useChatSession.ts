import { useQuery } from "@tanstack/react-query";
import { getChatSession } from "../services/getChatSession.service";
import { AI_KEYS } from "../constants/queryKeys";

export function useChatSession(sessionId: number, enabled = true) {
  return useQuery({
    queryKey: AI_KEYS.chatSession(sessionId),
    queryFn: () => getChatSession(sessionId),
    enabled: Boolean(sessionId) && enabled,
  });
}
