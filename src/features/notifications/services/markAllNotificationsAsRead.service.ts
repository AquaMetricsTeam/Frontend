import { customFetch } from "@/services/customFetch";

export async function markAllNotificationsAsRead(): Promise<ApiResponse<void>> {
  return customFetch<ApiResponse<void>>("/Notifications/read-all", {
    method: "PUT",
  });
}
