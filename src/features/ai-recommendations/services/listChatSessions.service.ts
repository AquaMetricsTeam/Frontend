import { customFetch } from "@/services/customFetch";
import type {
  FetchChatSessionsParams,
  ChatSessionResponse,
  PagedResponse,
} from "../types/index";

export async function listChatSessions(
  params: FetchChatSessionsParams,
): Promise<ApiResponse<PagedResponse<ChatSessionResponse>>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));

  const queryString = query.toString();
  const endpoint = `/ai/chat/sessions${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<PagedResponse<ChatSessionResponse>>>(
    endpoint,
  );
}
