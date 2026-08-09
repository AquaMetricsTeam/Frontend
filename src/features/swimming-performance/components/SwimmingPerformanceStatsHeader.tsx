import { useTranslation } from "react-i18next";
import { MdPool, MdTimer, MdFitnessCenter, MdSpeed } from "react-icons/md";
import type { SwimmingPerformance } from "../types";
import { formatTimeSpanDisplay, parseTimeSpanToSeconds } from "./MmSsInput";

interface SwimmingPerformanceStatsHeaderProps {
  performances: SwimmingPerformance[];
}

export function SwimmingPerformanceStatsHeader({
  performances,
}: SwimmingPerformanceStatsHeaderProps) {
  const { t } = useTranslation("swimming");

  const totalLogs = performances.length;

  // Calculate fastest best lap time
  const bestTimesInSeconds = performances
    .map((p) => parseTimeSpanToSeconds(p.bestRepTime))
    .filter((sec) => sec > 0);

  const minBestSec =
    bestTimesInSeconds.length > 0 ? Math.min(...bestTimesInSeconds) : 0;
  const avgBestSec =
    bestTimesInSeconds.length > 0
      ? Math.round(
          bestTimesInSeconds.reduce((a, b) => a + b, 0) /
            bestTimesInSeconds.length,
        )
      : 0;

  const formattedMinBest = minBestSec
    ? `${Math.floor(minBestSec / 60)
        .toString()
        .padStart(2, "0")}:${(minBestSec % 60).toString().padStart(2, "0")}`
    : "--:--";

  const formattedAvgBest = avgBestSec
    ? `${Math.floor(avgBestSec / 60)
        .toString()
        .padStart(2, "0")}:${(avgBestSec % 60).toString().padStart(2, "0")}`
    : "--:--";

  // High exertion count (RPE >= 8)
  const highEffortCount = performances.filter(
    (p) => p.rpe && p.rpe >= 8,
  ).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {/* Card 1: Total Drills */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
          <MdPool className="size-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {t("stats.totalDrills")}
          </p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {totalLogs}
          </p>
        </div>
      </div>

      {/* Card 2: Fastest Lap */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex size-11 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500 shrink-0">
          <MdTimer className="size-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Fastest Lap Record
          </p>
          <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
            {formattedMinBest}
          </p>
        </div>
      </div>

      {/* Card 3: Avg Best Rep Time */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-500 shrink-0">
          <MdSpeed className="size-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {t("stats.avgBestTime")}
          </p>
          <p className="text-2xl font-bold text-foreground font-mono tracking-tight">
            {formattedAvgBest}
          </p>
        </div>
      </div>

      {/* Card 4: High Effort Sets */}
      <div className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card shadow-xs">
        <div className="flex size-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shrink-0">
          <MdFitnessCenter className="size-6" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            {t("stats.highExertion")}
          </p>
          <p className="text-2xl font-bold text-foreground tracking-tight">
            {highEffortCount}
          </p>
        </div>
      </div>
    </div>
  );
}
