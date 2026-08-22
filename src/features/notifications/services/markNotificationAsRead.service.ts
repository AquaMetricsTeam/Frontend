import { customFetch } from "@/services/customFetch";

export async function markNotificationAsRead(
  id: number,
): Promise<ApiResponse<void>> {
  return customFetch<ApiResponse<void>>(`/Notifications/${id}/read`, {
    method: "PUT",
  });
}
