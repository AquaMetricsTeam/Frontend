import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../services/getNotifications.service";
import { NOTIFICATION_KEYS } from "../constants/queryKeys";
import type { GetNotificationsParams } from "../types/index";

export function useNotifications(
  params: GetNotificationsParams = {},
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: NOTIFICATION_KEYS.list(params),
    queryFn: () => getNotifications(params),
    enabled,
  });
}
