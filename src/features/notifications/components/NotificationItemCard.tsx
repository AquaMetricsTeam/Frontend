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
  NotificationType,
  type NotificationResponse,
} from "../types/index";

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
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

interface NotificationItemCardProps {
  notification: NotificationResponse;
  onMarkAsRead: (id: number) => void;
}

export function NotificationItemCard({
  notification,
  onMarkAsRead,
}: NotificationItemCardProps) {
  const Icon = getNotificationIcon(notification.type);
  const isUnread = !notification.isRead;

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative flex items-start gap-4 rounded-xl border p-4 transition-all duration-150",
        isUnread
          ? "border-primary/20 bg-primary/5 hover:bg-primary/10 cursor-pointer"
          : "border-border bg-card hover:bg-accent/40"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg transition-colors",
          isUnread
            ? "bg-primary/15 text-primary"
            : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4
            className={cn(
              "text-sm leading-snug",
              isUnread
                ? "font-semibold text-foreground"
                : "font-medium text-muted-foreground"
            )}
          >
            {notification.title}
          </h4>
          <span className="shrink-0 text-xs text-muted-foreground/70">
            {formatNotificationTime(notification.createdAt)}
          </span>
        </div>

        {notification.message && (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
            {notification.message}
          </p>
        )}
      </div>

      {/* Unread indicator dot */}
      {isUnread && (
        <div className="flex shrink-0 items-center self-center ms-2">
          <span className="size-2.5 rounded-full bg-primary" />
        </div>
      )}
    </div>
  );
}
