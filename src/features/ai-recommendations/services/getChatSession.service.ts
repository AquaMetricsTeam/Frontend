import { customFetch } from "@/services/customFetch";
import type { ChatSessionResponse } from "../types/index";

export async function getChatSession(
  sessionId: number,
): Promise<ApiResponse<ChatSessionResponse>> {
  return customFetch<ApiResponse<ChatSessionResponse>>(
    `/ai/chat/sessions/${sessionId}`,
  );
}
