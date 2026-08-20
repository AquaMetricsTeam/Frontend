import { customFetch } from "@/services/customFetch";
import type {
  SendChatMessageRequest,
  ChatReplyResponse,
} from "../types/index";

export async function sendChatMessage(
  sessionId: number,
  payload: SendChatMessageRequest,
): Promise<ApiResponse<ChatReplyResponse>> {
  return customFetch<ApiResponse<ChatReplyResponse>>(
    `/ai/chat/sessions/${sessionId}/messages`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      timeoutMs: 120_000,
    },
  );
}
