import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdNotificationsNone, MdDoneAll, MdRefresh } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import WithPagination from "@/components/HOCs/WithPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useUnreadNotificationCount } from "@/features/notifications/hooks/useUnreadNotificationCount";
import { useMarkNotificationAsRead } from "@/features/notifications/hooks/useMarkNotificationAsRead";
import { useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/useMarkAllNotificationsAsRead";
import { NotificationItemCard } from "@/features/notifications/components/NotificationItemCard";

export default function NotificationsPage() {
  const { t } = useTranslation(["notifications", "common"]);
  const [searchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageSize = 15;

  const {
    data: notificationsData,
    isLoading,
    isError,
    refetch,
  } = useNotifications({ page, pageSize });

  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.data ?? 0;

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  const items = notificationsData?.data?.items ?? [];
  const totalPages = notificationsData?.data?.totalPages ?? 1;

  const handleMarkAsRead = (id: number) => {
    markAsRead(id);
  };

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("notifications:title", "Notifications")}
          </h1>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="bg-primary/15 text-primary font-bold">
              {unreadCount}
            </Badge>
          )}
        </div>

        {unreadCount > 0 && (
          <Button
            size="sm"
            variant="outline"
            disabled={isMarkingAll}
            onClick={() => markAllAsRead()}
            className="h-9 gap-1.5 text-xs font-medium cursor-pointer self-start sm:self-auto"
          >
            <MdDoneAll className="size-4" />
            {t("notifications:markAllAsRead", "Mark all as read")}
          </Button>
        )}
      </div>

      {/* Main Content Box */}
      <Box>
        <WithPagination pageCount={totalPages}>
          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
          ) : isError ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-destructive/20 bg-destructive/5 space-y-3">
              <p className="text-sm font-semibold text-destructive">
                {t("notifications:fetchError", "Failed to load notifications.")}
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                className="h-9 text-xs gap-1.5 cursor-pointer"
              >
                <MdRefresh className="size-4" />
                {t("notifications:retry", "Retry")}
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center rounded-xl border border-dashed border-border bg-muted/20 my-4 space-y-3">
              <div className="p-3 rounded-full bg-primary/10 text-primary border border-primary/20">
                <MdNotificationsNone className="size-8" />
              </div>
              <div className="space-y-1 max-w-sm">
                <p className="text-base font-bold text-foreground">
                  {t("notifications:noNotifications", "No notifications")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t(
                    "notifications:allCaughtUp",
                    "You are all caught up! New notifications will appear here when assigned.",
                  )}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((notification) => (
                <NotificationItemCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          )}
        </WithPagination>
      </Box>
    </PageWrapper>
  );
}
