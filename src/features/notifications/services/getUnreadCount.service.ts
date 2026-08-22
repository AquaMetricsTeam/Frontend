import { customFetch } from "@/services/customFetch";

export async function getUnreadCount(): Promise<ApiResponse<number>> {
  return customFetch<ApiResponse<number>>("/Notifications/unread-count");
}
