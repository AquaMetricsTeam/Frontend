import { customFetch } from "@/services/customFetch";
import type {
  CreateChatSessionRequest,
  ChatSessionResponse,
} from "../types/index";

export async function createChatSession(
  payload: CreateChatSessionRequest,
): Promise<ApiResponse<ChatSessionResponse>> {
  return customFetch<ApiResponse<ChatSessionResponse>>("/ai/chat/sessions", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
