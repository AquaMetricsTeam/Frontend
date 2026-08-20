import { useQuery } from "@tanstack/react-query";
import { listChatSessions } from "../services/listChatSessions.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { FetchChatSessionsParams } from "../types/index";

export function useChatSessions(
  params: FetchChatSessionsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: AI_KEYS.chatSessions(params),
    queryFn: () => listChatSessions(params),
    enabled,
  });
}
