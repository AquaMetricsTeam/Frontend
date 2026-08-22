import { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MdWbSunny,
  MdWbTwilight,
  MdNightsStay,
  MdCalendarToday,
  MdAccessTime,
} from "react-icons/md";
import { useMe } from "@/features/auth/hooks/useMe";
import { RoleBadge } from "@/features/users/components/RoleBadge";
import { Badge } from "@/components/ui/badge";
import type { StaffRole } from "@/features/users/types";

interface DashboardGreetingProps {
  name?: string;
  subtitle?: string;
}

function getInitials(name?: string) {
  if (!name) return "";
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function DashboardGreeting({ name, subtitle }: DashboardGreetingProps) {
  const { t, i18n } = useTranslation("dashboard");
  const { data: meRes } = useMe();
  const user = meRes?.data;

  const [currentTime, setCurrentTime] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const { greetingKey, Icon, iconColor, timeGlow } = useMemo(() => {
    const hour = currentTime.getHours();
    if (hour < 12) {
      return {
        greetingKey: "morning",
        Icon: MdWbSunny,
        iconColor: "text-amber-500",
        timeGlow: "from-amber-500/12 via-primary/5 to-transparent",
        periodLabel: i18n.language === "ar" ? "صباحي" : "Morning",
      };
    }
    if (hour < 17) {
      return {
        greetingKey: "afternoon",
        Icon: MdWbTwilight,
        iconColor: "text-orange-500",
        timeGlow: "from-orange-500/12 via-primary/5 to-transparent",
        periodLabel: i18n.language === "ar" ? "نهاري" : "Afternoon",
      };
    }
    return {
      greetingKey: "evening",
      Icon: MdNightsStay,
      iconColor: "text-indigo-500",
      timeGlow: "from-indigo-500/12 via-primary/5 to-transparent",
      periodLabel: i18n.language === "ar" ? "مسائي" : "Evening",
    };
  }, [currentTime, i18n.language]);

  const isAr = i18n.language === "ar";
  const locale = isAr ? "ar-EG" : "en-US";

  const formattedDate = currentTime.toLocaleDateString(locale, {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  const formattedTime = currentTime.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
  });

  const effectiveName = name || user?.fullName?.split(" ")[0] || "";
  const greetingText = t(`greeting.${greetingKey}` as any, {
    defaultValue: t("greeting.welcome"),
  });

  const primaryRole = user?.roles?.[0] as StaffRole | undefined;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-xs">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -end-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -start-24 -bottom-24 size-96 rounded-full bg-cyan-500/10 blur-3xl" />
      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${timeGlow} pointer-events-none`}
      />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Avatar + Identity Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar / Visual Icon Box */}
          <div className="relative shrink-0">
            {user?.profilePictureUrl ? (
              <div className="relative">
                <img
                  src={user.profilePictureUrl}
                  alt={user.fullName || "User"}
                  className="size-16 sm:size-20 rounded-2xl object-cover border-2 border-border/60 shadow-md ring-4 ring-primary/10"
                />
                <div className="absolute -bottom-1 -end-1 flex size-6 sm:size-7 items-center justify-center rounded-xl bg-card border border-border shadow-xs">
                  <Icon className={`size-3.5 sm:size-4 ${iconColor}`} />
                </div>
              </div>
            ) : (
              <div className="flex size-16 sm:size-20 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-cyan-500/20 text-primary border-2 border-primary/20 shadow-md ring-4 ring-primary/10">
                {effectiveName ? (
                  <span className="text-xl sm:text-2xl font-bold tracking-tight">
                    {getInitials(user?.fullName || effectiveName)}
                  </span>
                ) : (
                  <Icon className={`size-8 sm:size-9 ${iconColor}`} />
                )}
              </div>
            )}
          </div>

          {/* Name & Subtitle & Badges */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-display"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {greetingText}
                {effectiveName
                  ? isAr
                    ? `، ${effectiveName}`
                    : `, ${effectiveName}`
                  : ""}
              </h1>
              {primaryRole && (
                <RoleBadge role={primaryRole} className="scale-95" />
              )}
            </div>

            {subtitle && (
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                {subtitle}
              </p>
            )}

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Date Badge */}
              <Badge
                variant="outline"
                className="rounded-lg text-xs font-medium gap-1.5 px-2.5 py-1 bg-card/60 border-border/70 backdrop-blur-xs"
              >
                <MdCalendarToday className="size-3 text-muted-foreground" />
                <span>{formattedDate}</span>
              </Badge>

              {/* Time Badge */}
              <Badge
                variant="outline"
                className="rounded-lg text-xs font-medium gap-1.5 px-2.5 py-1 bg-card/60 border-border/70 backdrop-blur-xs"
              >
                <MdAccessTime className="size-3 text-primary" />
                <span>{formattedTime}</span>
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
