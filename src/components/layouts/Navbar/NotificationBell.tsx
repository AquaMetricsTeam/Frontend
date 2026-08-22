import { useTranslation } from "react-i18next";
import {
  MdNotifications,
  MdCheckCircleOutline,
  MdAutoAwesome,
  MdEventNote,
  MdRestaurant,
  MdWarning,
  MdGroup,
} from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useUnreadNotificationCount } from "@/features/notifications/hooks/useUnreadNotificationCount";
import { useMarkNotificationAsRead } from "@/features/notifications/hooks/useMarkNotificationAsRead";
import { useMarkAllNotificationsAsRead } from "@/features/notifications/hooks/useMarkAllNotificationsAsRead";
import {
  NotificationType,
  type NotificationResponse,
} from "@/features/notifications/types";
import Spinner from "@/components/feedbacks/Spinner";

function getNotificationIcon(type: NotificationType) {
  switch (type) {
    case NotificationType.TrainingAssigned:
    case NotificationType.TrainingSessionAssigned:
      return MdEventNote;
    case NotificationType.NutritionAssigned:
      return MdRestaurant;
    case NotificationType.AIRecommendationReady:
      return MdAutoAwesome;
    case NotificationType.InjuryOccured:
      return MdWarning;
    case NotificationType.CoachAssigned:
    case NotificationType.GroupAssigned:
      return MdGroup;
    case NotificationType.AttendanceRecorded:
    case NotificationType.AssessmentRecorded:
      return MdCheckCircleOutline;
    default:
      return MdNotifications;
  }
}

function formatNotificationTime(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  } catch {
    return dateStr;
  }
}

export function NotificationBell({ className }: { className?: string }) {
  const { t } = useTranslation(["notifications", "common"]);

  const { data: unreadData } = useUnreadNotificationCount();
  const unreadCount = unreadData?.data ?? 0;

  const { data: notificationsData, isLoading } = useNotifications({
    page: 1,
    pageSize: 5,
  });
  const notificationsList = notificationsData?.data?.items ?? [];

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAll } =
    useMarkAllNotificationsAsRead();

  const handleItemClick = (item: NotificationResponse) => {
    if (!item.isRead) {
      markAsRead(item.id);
    }
  };

  return (
    <Popover>
      <PopoverTrigger
        aria-label={t("common:nav.items.notifications")}
        className={cn(
          "relative flex size-9 items-center justify-center rounded-lg",
          "text-muted-foreground transition-colors duration-150",
          "hover:bg-accent hover:text-foreground",
          className
        )}
      >
        <MdNotifications className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 end-1.5 flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        )}
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground">
              {t("common:nav.items.notifications")}
            </span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-primary/15 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                {unreadCount}
              </span>
            )}
          </div>
          {unreadCount > 0 && (
            <button
              onClick={() => markAllAsRead()}
              disabled={isMarkingAll}
              className="text-[11px] font-medium text-primary hover:underline disabled:opacity-50 cursor-pointer"
            >
              {t("notifications:markAllAsRead", "Mark all read")}
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
          {isLoading ? (
            <div className="flex h-24 items-center justify-center">
              <Spinner />
            </div>
          ) : notificationsList.length === 0 ? (
            <div className="p-4 text-center text-xs text-muted-foreground">
              {t("notifications:noNotifications", "No notifications")}
            </div>
          ) : (
            notificationsList.map((item) => {
              const Icon = getNotificationIcon(item.type);
              return (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "flex items-start gap-3 p-3 text-xs transition-colors hover:bg-accent/50 cursor-pointer",
                    !item.isRead && "bg-primary/5"
                  )}
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                    <Icon className="size-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className={cn(
                        "text-xs leading-snug",
                        !item.isRead
                          ? "font-semibold text-foreground"
                          : "text-muted-foreground"
                      )}
                    >
                      {item.title}
                    </p>
                    {item.message && (
                      <p className="mt-0.5 line-clamp-2 text-[11px] text-muted-foreground/80">
                        {item.message}
                      </p>
                    )}
                    <span className="mt-1 block text-[10px] text-muted-foreground/70">
                      {formatNotificationTime(item.createdAt)}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
