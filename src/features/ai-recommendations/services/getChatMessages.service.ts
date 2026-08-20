import { customFetch } from "@/services/customFetch";
import type { ChatMessageResponse } from "../types/index";

export async function getChatMessages(
  sessionId: number,
): Promise<ApiResponse<ChatMessageResponse[]>> {
  return customFetch<ApiResponse<ChatMessageResponse[]>>(
    `/ai/chat/sessions/${sessionId}/messages`,
  );
}
