import type { GetNotificationsParams } from "../types/index";

export const NOTIFICATION_KEYS = {
  all: ["notifications"] as const,
  lists: () => [...NOTIFICATION_KEYS.all, "list"] as const,
  list: (params: GetNotificationsParams) =>
    [...NOTIFICATION_KEYS.lists(), params] as const,
  unreadCount: () => [...NOTIFICATION_KEYS.all, "unread-count"] as const,
};
