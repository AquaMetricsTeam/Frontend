import { useQuery } from "@tanstack/react-query";
import { getUnreadCount } from "../services/getUnreadCount.service";
import { NOTIFICATION_KEYS } from "../constants/queryKeys";

export function useUnreadNotificationCount(enabled: boolean = true) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.unreadCount(),
    queryFn: () => getUnreadCount(),
    enabled,
  });
}
