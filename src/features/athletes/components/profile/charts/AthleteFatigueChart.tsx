import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdBatteryChargingFull, MdInfoOutline } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import type { AthleteOverviewPerformancePointResponse } from "@/features/athletes/types/index";

interface AthleteFatigueChartProps {
  data: AthleteOverviewPerformancePointResponse[];
  averageFatigue?: number;
}

export function AthleteFatigueChart({
  data,
  averageFatigue,
}: AthleteFatigueChartProps) {
  const { t } = useTranslation("athletes");
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card/60 p-8 text-center backdrop-blur-xs">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
          <MdInfoOutline className="size-6" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          {t("profile.charts.noFatigueData")}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {t("profile.charts.noFatigueDataDesc")}
        </p>
      </div>
    );
  }

  // Chronological sort
  const sortedPoints = [...data].sort(
    (a, b) => new Date(a.sessionDate).getTime() - new Date(b.sessionDate).getTime(),
  );

  const svgWidth = 600;
  const svgHeight = 220;
  const paddingX = 36;
  const paddingTop = 28;
  const paddingBottom = 32;

  const chartWidth = svgWidth - paddingX * 2;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  const maxVal = 10;
  const range = 10;

  const coords = sortedPoints.map((pt, idx) => {
    const x =
      sortedPoints.length === 1
        ? svgWidth / 2
        : paddingX + (idx / (sortedPoints.length - 1)) * chartWidth;
    const normalized = Math.max(0, Math.min(10, pt.value)) / range;
    const y = paddingTop + chartHeight - normalized * chartHeight;
    return { ...pt, x, y };
  });

  // Build SVG bezier path
  let pathD =
    coords.length === 1
      ? `M ${coords[0].x - 20},${coords[0].y} L ${coords[0].x + 20},${coords[0].y}`
      : `M ${coords[0].x},${coords[0].y}`;

  if (coords.length > 1) {
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[i + 2 >= coords.length ? i + 1 : i + 2];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
  }

  const areaD =
    coords.length > 1
      ? `${pathD} L ${coords[coords.length - 1].x},${paddingTop + chartHeight} L ${coords[0].x},${paddingTop + chartHeight} Z`
      : "";

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : null;

  function getFatigueBadge(value: number) {
    if (value <= 4) {
      return {
        label: t("profile.charts.lowFatigue"),
        cls: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
      };
    }
    if (value <= 7) {
      return {
        label: t("profile.charts.moderateFatigue"),
        cls: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/30",
      };
    }
    return {
      label: t("profile.charts.highFatigue"),
      cls: "text-rose-600 dark:text-rose-400 bg-rose-500/10 border-rose-500/30",
    };
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500">
            <MdBatteryChargingFull className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t("profile.charts.fatigueTrend")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("profile.charts.fatigueTrendSubtitle")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {averageFatigue !== undefined && (
            <Badge
              variant="outline"
              className="rounded-lg border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-semibold text-amber-600 dark:text-amber-400"
            >
              {t("profile.metrics.avgFatigue")}: {averageFatigue.toFixed(1)} / 10
            </Badge>
          )}
          <Badge
            variant="secondary"
            className="rounded-lg text-[11px] font-medium"
          >
            {sortedPoints.length} {t("profile.metrics.sessionsCount")}
          </Badge>
        </div>
      </div>

      {/* SVG Chart Container */}
      <div className="relative mt-4 w-full">
        {/* Floating Tooltip */}
        {activePoint && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl border border-border/80 bg-card/95 p-2.5 shadow-lg backdrop-blur-md transition-all text-xs"
            style={{
              left: `${(activePoint.x / svgWidth) * 100}%`,
              top: `${(activePoint.y / svgHeight) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="font-semibold text-foreground">
              {activePoint.sessionTitle || t("profile.metrics.session")}
            </div>
            <div className="mt-1 flex items-center justify-between gap-3 text-muted-foreground">
              <span>{new Date(activePoint.sessionDate).toLocaleDateString()}</span>
              <span className="font-bold text-amber-500">
                {activePoint.value} / 10
              </span>
            </div>
            <div className="mt-1">
              <span
                className={`inline-block text-[10px] px-1.5 py-0.5 rounded-md border font-medium ${getFatigueBadge(activePoint.value).cls}`}
              >
                {getFatigueBadge(activePoint.value).label}
              </span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-48 sm:h-56 select-none overflow-visible"
        >
          <defs>
            <linearGradient id="fatigueGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <filter id="fatigueGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#f59e0b" floodOpacity="0.3" />
            </filter>
          </defs>

          {/* Zones background shading */}
          {/* Warning zone 7-10 */}
          <rect
            x={paddingX}
            y={paddingTop}
            width={chartWidth}
            height={(3 / maxVal) * chartHeight}
            className="fill-rose-500/5"
          />
          {/* Moderate zone 4-7 */}
          <rect
            x={paddingX}
            y={paddingTop + (3 / maxVal) * chartHeight}
            width={chartWidth}
            height={(3 / maxVal) * chartHeight}
            className="fill-amber-500/5"
          />
          {/* Recovery zone 0-4 */}
          <rect
            x={paddingX}
            y={paddingTop + (6 / maxVal) * chartHeight}
            width={chartWidth}
            height={(4 / maxVal) * chartHeight}
            className="fill-emerald-500/5"
          />

          {/* Grid lines */}
          {[10, 7, 4, 0].map((val) => {
            const y = paddingTop + chartHeight - (val / maxVal) * chartHeight;
            return (
              <g key={val}>
                <line
                  x1={paddingX}
                  y1={y}
                  x2={svgWidth - paddingX}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/60"
                  strokeDasharray={val === 0 || val === 10 ? "0" : "4 4"}
                  strokeWidth="1"
                />
                <text
                  x={paddingX - 8}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground text-[9px] font-mono"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Gradient Area */}
          {areaD && <path d={areaD} fill="url(#fatigueGradient)" />}

          {/* Line Path */}
          <path
            d={pathD}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#fatigueGlow)"
          />

          {/* Hover Crosshair */}
          {activePoint && (
            <line
              x1={activePoint.x}
              y1={paddingTop}
              x2={activePoint.x}
              y2={paddingTop + chartHeight}
              stroke="#f59e0b"
              strokeOpacity="0.5"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {/* Interactive Data Points */}
          {coords.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={`${pt.trainingRecordId}-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? "7" : "4.5"}
                  className="fill-card stroke-amber-500 transition-all"
                  strokeWidth={isHovered ? "3.5" : "2.5"}
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                />
              </g>
            );
          })}
        </svg>

        {/* X-axis date labels */}
        <div className="mt-1 flex items-center justify-between px-8 text-[10px] text-muted-foreground">
          <span>
            {coords.length > 0
              ? new Date(coords[0].sessionDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
          {coords.length > 2 && (
            <span>
              {new Date(
                coords[Math.floor(coords.length / 2)].sessionDate,
              ).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span>
            {coords.length > 1
              ? new Date(
                  coords[coords.length - 1].sessionDate,
                ).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                })
              : ""}
          </span>
        </div>
      </div>
    </div>
  );
}
