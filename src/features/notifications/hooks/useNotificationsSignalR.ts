import { useEffect, useRef } from "react";
import {
  HubConnectionBuilder,
  HubConnection,
  HubConnectionState,
} from "@microsoft/signalr";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { BACKEND_BASE_URL, SOCKET_BASE_URL } from "@/constants/backendAPIsConfig";
import { getStoredToken } from "@/utils/authStorage";
import { NOTIFICATION_KEYS } from "../constants/queryKeys";
import type {
  NotificationResponse,
  NotificationsPaginatedResponse,
} from "../types/index";

function getHubUrl(): string {
  if (SOCKET_BASE_URL) {
    return SOCKET_BASE_URL.endsWith("/hubs/notifications")
      ? SOCKET_BASE_URL
      : `${SOCKET_BASE_URL.replace(/\/$/, "")}/hubs/notifications`;
  }
  const originUrl = BACKEND_BASE_URL.replace(/\/api\/?$/, "");
  return `${originUrl}/hubs/notifications`;
}

export function useNotificationsSignalR(enabled: boolean = true) {
  const queryClient = useQueryClient();
  const connectionRef = useRef<HubConnection | null>(null);

  useEffect(() => {
    const token = getStoredToken();
    if (!enabled || !token) {
      if (connectionRef.current?.state === HubConnectionState.Connected) {
        connectionRef.current.stop();
        connectionRef.current = null;
      }
      return;
    }

    const hubUrl = getHubUrl();

    const connection = new HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => getStoredToken() ?? "",
      })
      .withAutomaticReconnect()
      .build();

    connectionRef.current = connection;

    connection.on(
      "ReceiveNotification",
      (notification: NotificationResponse) => {
        // 1. Trigger live toast using existing sonner system
        if (notification?.title) {
          toast.info(notification.title, {
            description: notification.message,
          });
        }

        // 2. Optimistically increment unread count
        queryClient.setQueryData<ApiResponse<number>>(
          NOTIFICATION_KEYS.unreadCount(),
          (old) => {
            if (!old || typeof old.data !== "number") return old;
            return {
              ...old,
              data: old.data + 1,
            };
          },
        );

        // 3. Optimistically prepend new notification to cached lists
        queryClient.setQueriesData<
          ApiResponse<NotificationsPaginatedResponse>
        >(
          { queryKey: NOTIFICATION_KEYS.lists() },
          (old) => {
            if (!old?.data?.items) return old;
            return {
              ...old,
              data: {
                ...old.data,
                items: [notification, ...old.data.items],
                totalCount: (old.data.totalCount || 0) + 1,
              },
            };
          },
        );

        // 4. Invalidate queries to ensure full server sync
        queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
      },
    );

    connection.onreconnected(() => {
      // Re-sync queries on reconnection after temporary offline period
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_KEYS.all });
    });

    connection.start().catch((err) => {
      console.error("SignalR Notification Hub Connection Error:", err);
    });

    return () => {
      connection.off("ReceiveNotification");
      connection.stop();
      connectionRef.current = null;
    };
  }, [enabled, queryClient]);

  return connectionRef.current;
}
