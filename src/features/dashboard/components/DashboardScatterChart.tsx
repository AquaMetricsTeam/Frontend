import { useState } from "react";
import { MdBubbleChart, MdInfoOutline } from "react-icons/md";
import type { PerformanceVsFatiguePoint } from "../types/index";

interface DashboardScatterChartProps {
  data: PerformanceVsFatiguePoint[];
}

export function DashboardScatterChart({ data }: DashboardScatterChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xs min-h-[240px]">
        <div className="flex size-11 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-500">
          <MdInfoOutline className="size-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">
          No correlation data
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Performance vs fatigue scatter will appear here.
        </p>
      </div>
    );
  }

  const svgW = 600;
  const svgH = 220;
  const padX = 44;
  const padY = 24;
  const padBot = 36;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padY - padBot;

  // Performance (0-10) and Fatigue (0-10)
  const toX = (perf: number) =>
    padX + (Math.max(0, Math.min(10, perf)) / 10) * chartW;
  const toY = (fatigue: number) =>
    padY + chartH - (Math.max(0, Math.min(10, fatigue)) / 10) * chartH;

  const activePoint = hoveredIdx !== null ? data[hoveredIdx] : null;

  const avgPerf = (
    data.reduce((acc, p) => acc + p.performanceRating, 0) / data.length
  ).toFixed(1);

  const avgFatigue = (
    data.reduce((acc, p) => acc + p.fatigueLevel, 0) / data.length
  ).toFixed(1);

  const getZoneLabel = (perf: number, fatigue: number) => {
    if (perf >= 6 && fatigue <= 4)
      return { text: "Optimal Peak", color: "text-emerald-400" };
    if (perf >= 6 && fatigue > 6)
      return { text: "High Strain", color: "text-amber-400" };
    if (perf < 6 && fatigue > 6)
      return { text: "Exhaustion Alert", color: "text-rose-400" };
    return { text: "Recovery / Steady", color: "text-blue-400" };
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-500">
            <MdBubbleChart className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              Performance vs Fatigue
            </h3>
            <p className="text-xs text-muted-foreground">
              Correlation across all sessions (Scale 1–10)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground bg-muted rounded-lg px-2 py-1">
            {data.length} sessions
          </span>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted rounded-lg px-2 py-1">
            Avg:{" "}
            <span className="text-primary font-bold">{avgPerf}/10 score</span> ·{" "}
            <span className="text-amber-500 font-bold">
              {avgFatigue}/10 fatigue
            </span>
          </span>
        </div>
      </div>

      <div className="relative mt-4 w-full">
        {activePoint && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl border border-border/80 bg-card/95 p-2.5 shadow-lg backdrop-blur-md text-xs"
            style={{
              left: `${(toX(activePoint.performanceRating) / svgW) * 100}%`,
              top: `${(toY(activePoint.fatigueLevel) / svgH) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1">
              <span className="font-semibold text-foreground">
                {new Date(activePoint.sessionDate).toLocaleDateString(
                  undefined,
                  {
                    month: "short",
                    day: "numeric",
                  },
                )}
              </span>
              <span
                className={`text-[10px] font-bold ${
                  getZoneLabel(
                    activePoint.performanceRating,
                    activePoint.fatigueLevel,
                  ).color
                }`}
              >
                {
                  getZoneLabel(
                    activePoint.performanceRating,
                    activePoint.fatigueLevel,
                  ).text
                }
              </span>
            </div>
            <div className="mt-1 flex gap-3 text-muted-foreground">
              <span>
                Perf:{" "}
                <span className="font-bold text-primary">
                  {activePoint.performanceRating}/10
                </span>
              </span>
              <span>
                Fatigue:{" "}
                <span className="font-bold text-amber-500">
                  {activePoint.fatigueLevel}/10
                </span>
              </span>
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-44 select-none overflow-visible"
        >
          {/* Quadrant dividing guidelines */}
          <line
            x1={toX(5)}
            y1={padY}
            x2={toX(5)}
            y2={padY + chartH}
            stroke="currentColor"
            className="text-border/50"
            strokeDasharray="4 4"
            strokeWidth="1"
          />
          <line
            x1={padX}
            y1={toY(5)}
            x2={svgW - padX}
            y2={toY(5)}
            stroke="currentColor"
            className="text-border/50"
            strokeDasharray="4 4"
            strokeWidth="1"
          />

          {/* Quadrant Zone Watermarks */}
          <text
            x={padX + chartW * 0.75}
            y={padY + chartH * 0.9}
            textAnchor="middle"
            className="fill-emerald-500/25 font-semibold"
            fontSize="9"
          >
            Optimal Peak Zone
          </text>
          <text
            x={padX + chartW * 0.75}
            y={padY + chartH * 0.18}
            textAnchor="middle"
            className="fill-amber-500/25 font-semibold"
            fontSize="9"
          >
            High Strain Zone
          </text>
          <text
            x={padX + chartW * 0.25}
            y={padY + chartH * 0.18}
            textAnchor="middle"
            className="fill-rose-500/25 font-semibold"
            fontSize="9"
          >
            Exhaustion Alert
          </text>
          <text
            x={padX + chartW * 0.25}
            y={padY + chartH * 0.9}
            textAnchor="middle"
            className="fill-blue-500/25 font-semibold"
            fontSize="9"
          >
            Recovery Zone
          </text>

          {/* Grid X (0, 2.5, 5, 7.5, 10) */}
          {[0, 2.5, 5, 7.5, 10].map((val) => {
            const x = toX(val);
            return (
              <g key={`gx-${val}`}>
                <line
                  x1={x}
                  y1={padY}
                  x2={x}
                  y2={padY + chartH}
                  stroke="currentColor"
                  className="text-border/30"
                  strokeDasharray={val === 0 || val === 10 ? "0" : "2 2"}
                  strokeWidth="1"
                />
                <text
                  x={x}
                  y={padY + chartH + 14}
                  textAnchor="middle"
                  className="fill-muted-foreground"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Grid Y (0, 2.5, 5, 7.5, 10) */}
          {[0, 2.5, 5, 7.5, 10].map((val) => {
            const y = toY(val);
            return (
              <g key={`gy-${val}`}>
                <line
                  x1={padX}
                  y1={y}
                  x2={svgW - padX}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/30"
                  strokeDasharray={val === 0 || val === 10 ? "0" : "2 2"}
                  strokeWidth="1"
                />
                <text
                  x={padX - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-muted-foreground"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Axis labels */}
          <text
            x={svgW / 2}
            y={svgH - 4}
            textAnchor="middle"
            className="fill-muted-foreground font-medium"
            fontSize="9"
          >
            Performance Rating (1–10) →
          </text>
          <text
            x={10}
            y={padY + chartH / 2}
            textAnchor="middle"
            className="fill-muted-foreground font-medium"
            fontSize="9"
            transform={`rotate(-90, 10, ${padY + chartH / 2})`}
          >
            Fatigue Level (1–10) →
          </text>

          {/* Data points */}
          {data.map((pt, idx) => {
            const cx = toX(pt.performanceRating);
            const cy = toY(pt.fatigueLevel);
            const isHovered = hoveredIdx === idx;

            const dotColor =
              pt.fatigueLevel <= 3
                ? "var(--success, #22c55e)"
                : pt.fatigueLevel <= 6
                  ? "#f59e0b"
                  : "var(--destructive, #ef4444)";

            return (
              <g
                key={`${pt.trainingRecordId}-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {isHovered && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill={dotColor}
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={cx}
                  cy={cy}
                  r={isHovered ? "8" : "5.5"}
                  fill={dotColor}
                  fillOpacity={isHovered ? "0.95" : "0.75"}
                  stroke={dotColor}
                  strokeWidth={isHovered ? "2.5" : "1.2"}
                  className="transition-all duration-150"
                />
                <circle cx={cx} cy={cy} r="14" fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* Legend */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-4 text-[10px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-emerald-500" />
            Low fatigue (≤3)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-amber-500" />
            Moderate (4-6)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block size-2 rounded-full bg-rose-500" />
            High (7+)
          </span>
        </div>
      </div>
    </div>
  );
}
