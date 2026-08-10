import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MdShowChart, MdTrendingDown } from "react-icons/md";
import { StrokeType, type SwimmingPerformance } from "../types";
import { STROKE_METADATA } from "../constants/enums";
import { formatTimeSpanDisplay, parseTimeSpanToSeconds } from "./MmSsInput";
import { cn } from "@/lib/utils";

interface AthleteSwimmingTrendPanelProps {
  performances: SwimmingPerformance[];
}

export function AthleteSwimmingTrendPanel({
  performances,
}: AthleteSwimmingTrendPanelProps) {
  const { t } = useTranslation("swimming");

  const [selectedStroke, setSelectedStroke] = useState<StrokeType>(
    StrokeType.Freestyle,
  );

  // Filter performances by selected stroke
  const strokePerformances = performances
    .filter((p) => p.stroke === selectedStroke)
    .sort((a, b) => {
      const dateA = new Date(a.sessionDate || 0).getTime();
      const dateB = new Date(b.sessionDate || 0).getTime();
      return dateA - dateB;
    });

  // Extract trend data points (date & bestRepTime in seconds)
  const chartPoints = strokePerformances
    .map((p) => ({
      id: p.id,
      date: p.sessionDate
        ? new Date(p.sessionDate).toLocaleDateString()
        : `#${p.id}`,
      seconds: parseTimeSpanToSeconds(p.bestRepTime),
      displayTime: formatTimeSpanDisplay(p.bestRepTime),
    }))
    .filter((pt) => pt.seconds > 0);

  const strokeMeta = STROKE_METADATA[selectedStroke];

  // Calculate SVG line points
  const maxSec = Math.max(...chartPoints.map((pt) => pt.seconds), 120);
  const minSec = Math.min(...chartPoints.map((pt) => pt.seconds), 30);
  const range = Math.max(maxSec - minSec, 1);

  const svgWidth = 500;
  const svgHeight = 160;
  const padding = 20;

  const pointsString = chartPoints
    .map((pt, idx) => {
      const x =
        padding +
        (idx / Math.max(chartPoints.length - 1, 1)) * (svgWidth - 2 * padding);
      // Invert Y axis: faster (lower seconds) is higher on graph!
      const normalized = (pt.seconds - minSec) / range;
      const y =
        svgHeight - padding - (1 - normalized) * (svgHeight - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border pb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-500">
              <MdShowChart className="size-5" />
            </div>
            <h3 className="text-base font-bold text-foreground">
              {t("trend.title")}
            </h3>
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 ms-10">
            {t("trend.subtitle")}
          </p>
        </div>

        {/* Stroke Selector */}
        <Select
          value={String(selectedStroke)}
          onValueChange={(val) => setSelectedStroke(Number(val) as StrokeType)}
        >
          <SelectTrigger className="h-9 w-44 text-xs font-semibold rounded-lg">
            <SelectValue placeholder={t("trend.selectStroke")} />
          </SelectTrigger>
          <SelectContent>
            {Object.values(STROKE_METADATA).map((s) => (
              <SelectItem
                key={s.value}
                value={String(s.value)}
                className="text-xs"
              >
                {t(s.labelKey)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Chart Section */}
      {chartPoints.length < 2 ? (
        <div className="py-8 text-center text-xs text-muted-foreground">
          {t("trend.noData")}
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs">
            <Badge
              variant="outline"
              className={cn(
                "text-xs font-bold px-2.5 py-0.5",
                strokeMeta?.badgeClass,
              )}
            >
              {strokeMeta ? t(strokeMeta.labelKey) : "Freestyle"}
            </Badge>

            <span className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <MdTrendingDown className="size-4" />
              Fastest:{" "}
              {chartPoints.length > 0 ? chartPoints[0].displayTime : "--:--"}
            </span>
          </div>

          {/* SVG Line Chart (Clean Cyan Line, per Design System) */}
          <div className="w-full overflow-x-auto">
            <svg
              viewBox={`0 0 ${svgWidth} ${svgHeight}`}
              className="w-full h-40 overflow-visible"
            >
              {/* Grid Lines */}
              <line
                x1={padding}
                y1={padding}
                x2={svgWidth - padding}
                y2={padding}
                stroke="currentColor"
                strokeOpacity="0.1"
                strokeDasharray="4 4"
              />
              <line
                x1={padding}
                y1={svgHeight - padding}
                x2={svgWidth - padding}
                y2={svgHeight - padding}
                stroke="currentColor"
                strokeOpacity="0.1"
              />

              {/* Polyline */}
              <polyline
                fill="none"
                stroke="#06b6d4"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={pointsString}
              />

              {/* Data Point Circles & Tooltip Labels */}
              {chartPoints.map((pt, idx) => {
                const x =
                  padding +
                  (idx / Math.max(chartPoints.length - 1, 1)) *
                    (svgWidth - 2 * padding);
                const normalized = (pt.seconds - minSec) / range;
                const y =
                  svgHeight -
                  padding -
                  (1 - normalized) * (svgHeight - 2 * padding);

                return (
                  <g key={pt.id || idx}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      className="fill-background stroke-cyan-500 stroke-[2.5]"
                    />
                    <text
                      x={x}
                      y={y - 8}
                      textAnchor="middle"
                      className="text-[9px] font-mono font-bold fill-foreground"
                    >
                      {pt.displayTime}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
