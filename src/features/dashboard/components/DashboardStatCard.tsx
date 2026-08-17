import type { ElementType } from "react";

interface DashboardStatCardProps {
  label: string;
  value: string | number;
  icon: ElementType;
  iconColor?: string;
  iconBg?: string;
  valueColor?: string;
  sub?: string;
  trend?: number; // 0-100 for progress bar
  trendColor?: string;
}

export function DashboardStatCard({
  label,
  value,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  valueColor = "text-foreground",
  sub,
  trend,
  trendColor = "bg-primary",
}: DashboardStatCardProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs transition-all hover:shadow-md hover:border-border">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <div className={`flex size-9 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon className="size-5" />
        </div>
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className={`text-3xl font-bold tracking-tight font-display ${valueColor}`}>
          {value}
        </span>
        {sub && (
          <span className="text-xs text-muted-foreground">{sub}</span>
        )}
      </div>

      {trend !== undefined && (
        <div className="mt-3 w-full bg-muted rounded-full h-1 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${trendColor}`}
            style={{ width: `${Math.min(100, Math.max(0, trend))}%` }}
          />
        </div>
      )}
    </div>
  );
}
