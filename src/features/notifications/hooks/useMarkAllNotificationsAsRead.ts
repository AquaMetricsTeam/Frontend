import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markAllNotificationsAsRead } from "../services/markAllNotificationsAsRead.service";
import { NOTIFICATION_KEYS } from "../constants/queryKeys";
import type { NotificationsPaginatedResponse } from "../types/index";

export function useMarkAllNotificationsAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => markAllNotificationsAsRead(),

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });

      const previousUnread = queryClient.getQueryData<ApiResponse<number>>(
        NOTIFICATION_KEYS.unreadCount(),
      );
      const previousLists = queryClient.getQueriesData<
        ApiResponse<NotificationsPaginatedResponse>
      >({ queryKey: NOTIFICATION_KEYS.lists() });

      // Optimistically set unread count to 0
      queryClient.setQueryData<ApiResponse<number>>(
        NOTIFICATION_KEYS.unreadCount(),
        (old) => {
          if (!old) return old;
          return {
            ...old,
            data: 0,
          };
        },
      );

      // Optimistically mark all items in cached lists as read
      queryClient.setQueriesData<ApiResponse<NotificationsPaginatedResponse>>(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (old) => {
          if (!old?.data?.items) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((item) => ({
                ...item,
                isRead: true,
              })),
            },
          };
        },
      );

      return { previousUnread, previousLists };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousUnread) {
        queryClient.setQueryData(
          NOTIFICATION_KEYS.unreadCount(),
          context.previousUnread,
        );
      }
      if (context?.previousLists) {
        context.previousLists.forEach(([queryKey, data]) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    },
  });
}
