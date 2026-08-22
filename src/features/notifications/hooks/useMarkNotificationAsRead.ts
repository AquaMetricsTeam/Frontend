import { useMutation, useQueryClient } from "@tanstack/react-query";
import { markNotificationAsRead } from "../services/markNotificationAsRead.service";
import { NOTIFICATION_KEYS } from "../constants/queryKeys";
import type { NotificationsPaginatedResponse } from "../types/index";

export function useMarkNotificationAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => markNotificationAsRead(id),

    onMutate: async (id: number) => {
      await queryClient.cancelQueries({ queryKey: NOTIFICATION_KEYS.all });

      const previousUnread = queryClient.getQueryData<ApiResponse<number>>(
        NOTIFICATION_KEYS.unreadCount(),
      );
      const previousLists = queryClient.getQueriesData<
        ApiResponse<NotificationsPaginatedResponse>
      >({ queryKey: NOTIFICATION_KEYS.lists() });

      // Optimistically update unread count
      queryClient.setQueryData<ApiResponse<number>>(
        NOTIFICATION_KEYS.unreadCount(),
        (old) => {
          if (!old || typeof old.data !== "number") return old;
          return {
            ...old,
            data: Math.max(0, old.data - 1),
          };
        },
      );

      // Optimistically mark item as read in cached lists
      queryClient.setQueriesData<ApiResponse<NotificationsPaginatedResponse>>(
        { queryKey: NOTIFICATION_KEYS.lists() },
        (old) => {
          if (!old?.data?.items) return old;
          return {
            ...old,
            data: {
              ...old.data,
              items: old.data.items.map((item) =>
                item.id === id ? { ...item, isRead: true } : item,
              ),
            },
          };
        },
      );

      return { previousUnread, previousLists };
    },

    onError: (_err, _id, context) => {
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
