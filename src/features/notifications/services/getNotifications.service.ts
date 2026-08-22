import { customFetch } from "@/services/customFetch";
import type {
  GetNotificationsParams,
  NotificationsPaginatedResponse,
} from "../types/index";

export async function getNotifications(
  params: GetNotificationsParams = {},
): Promise<ApiResponse<NotificationsPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));

  const queryString = query.toString();
  const endpoint = `/Notifications${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<NotificationsPaginatedResponse>>(endpoint);
}
