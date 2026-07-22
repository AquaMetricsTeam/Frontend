import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdNotifications, MdCheckCircleOutline, MdAutoAwesome, MdEventNote } from "react-icons/md";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface NotificationItem {
  id: string;
  title: string;
  time: string;
  icon: React.ElementType;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "AI Recommendation: 3 athletes ready for level upgrade",
    time: "10m ago",
    icon: MdAutoAwesome,
    read: false,
  },
  {
    id: "2",
    title: "Coach Ahmed updated attendance for Swimming Group A",
    time: "1h ago",
    icon: MdEventNote,
    read: false,
  },
  {
    id: "3",
    title: "Monthly performance report generated",
    time: "5h ago",
    icon: MdCheckCircleOutline,
    read: true,
  },
];

export function NotificationBell({ className }: { className?: string }) {
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter((n) => !n.read).length;

  function markAllAsRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }

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
              onClick={markAllAsRead}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Mark all read
            </button>
          )}
        </div>

        {/* List */}
        <div className="max-h-72 overflow-y-auto divide-y divide-border/50">
          {notifications.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                className={cn(
                  "flex items-start gap-3 p-3 text-xs transition-colors hover:bg-accent/50 cursor-pointer",
                  !item.read && "bg-primary/5"
                )}
              >
                <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <Icon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn("text-xs leading-snug", !item.read ? "font-semibold text-foreground" : "text-muted-foreground")}>
                    {item.title}
                  </p>
                  <span className="mt-1 block text-[10px] text-muted-foreground/70">
                    {item.time}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
