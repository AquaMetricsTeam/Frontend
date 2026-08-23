import { useTranslation } from "react-i18next";
import {
  MdOutlineCheckCircle,
  MdOutlineWarningAmber,
  MdSpeed,
  MdBatteryChargingFull,
  MdCalendarToday,
} from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { AthletePerformanceChart } from "../charts/AthletePerformanceChart";
import { AthleteFatigueChart } from "../charts/AthleteFatigueChart";
import { useAthletePerformance } from "../../../hooks/useAthletePerformance";
import type { AthleteOverviewResponse } from "../../../types/index";

interface AthleteOverviewTabProps {
  athlete: AthleteOverviewResponse;
}

export function AthleteOverviewTab({ athlete }: AthleteOverviewTabProps) {
  const { t } = useTranslation("athletes");

  const { data: performanceRes } = useAthletePerformance(athlete.id);
  const performanceData = performanceRes?.data;

  const recordedSessions = performanceData?.totalSessions ?? 0;
  const completedSessions = performanceData?.completedSessions ?? 0;
  const injuredSessions = performanceData?.injuredSessions ?? 0;
  const avgRating = performanceData?.averagePerformanceRating ?? 0;
  const avgFatigue = performanceData?.averageFatigueLevel ?? 0;

  const completionRate =
    recordedSessions > 0
      ? Math.round((completedSessions / recordedSessions) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Injury / Medical Notice Alert if applicable */}
      {injuredSessions > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-rose-700 dark:text-rose-400 backdrop-blur-xs">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-500/20">
            <MdOutlineWarningAmber className="size-5 text-rose-600 dark:text-rose-400" />
          </div>
          <div className="text-xs">
            <span className="font-bold">
              {t("profile.metrics.injuryAlertTitle")}:
            </span>{" "}
            {t("profile.metrics.injuryAlertDesc", { count: injuredSessions })}
          </div>
        </div>
      )}

      {/* 4 Premium Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card 1: Total Training Volume */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("profile.metrics.trainingVolume")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MdCalendarToday className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {recordedSessions}
            </span>
            <span className="text-xs text-muted-foreground">
              {t("profile.metrics.totalRecordedSessions")}
            </span>
          </div>
        </div>

        {/* Card 2: Completion Rate */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("profile.metrics.completionRate")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MdOutlineCheckCircle className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {completionRate}%
            </span>
            <span className="text-xs text-muted-foreground">
              ({completedSessions}/{recordedSessions})
            </span>
          </div>
          {/* Progress bar */}
          <div className="mt-3 w-full bg-muted rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, completionRate)}%` }}
            />
          </div>
        </div>

        {/* Card 3: Avg Performance Score */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("profile.metrics.avgRating")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <MdSpeed className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-primary">
              {avgRating > 0 ? avgRating.toFixed(1) : "--"}
            </span>
            <span className="text-xs text-muted-foreground">/ 10</span>
          </div>
          <div className="mt-3 border-t border-border/60 pt-3 text-[11px]">
            <Badge
              variant="outline"
              className="border-primary/20 bg-primary/5 text-primary text-[10px] font-semibold"
            >
              {avgRating >= 8
                ? t("profile.metrics.excellent")
                : avgRating >= 6
                  ? t("profile.metrics.good")
                  : t("profile.metrics.needsFocus")}
            </Badge>
          </div>
        </div>

        {/* Card 4: Avg Fatigue Level */}
        <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-card p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              {t("profile.metrics.avgFatigue")}
            </span>
            <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <MdBatteryChargingFull className="size-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-amber-500">
              {avgFatigue > 0 ? avgFatigue.toFixed(1) : "--"}
            </span>
            <span className="text-xs text-muted-foreground">/ 10</span>
          </div>
          <div className="mt-3 border-t border-border/60 pt-3 text-[11px]">
            <Badge
              variant="outline"
              className={`text-[10px] font-semibold ${
                avgFatigue <= 4
                  ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : avgFatigue <= 7
                    ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                    : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
              }`}
            >
              {avgFatigue <= 4
                ? t("profile.charts.lowFatigue")
                : avgFatigue <= 7
                  ? t("profile.charts.moderateFatigue")
                  : t("profile.charts.highFatigue")}
            </Badge>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Chart 1: Performance Trend */}
        <AthletePerformanceChart
          data={performanceData?.performanceTrend || []}
          averageRating={performanceData?.averagePerformanceRating}
        />

        {/* Chart 2: Fatigue Trend */}
        <AthleteFatigueChart
          data={performanceData?.fatigueTrend || []}
          averageFatigue={performanceData?.averageFatigueLevel}
        />
      </div>
    </div>
  );
}
