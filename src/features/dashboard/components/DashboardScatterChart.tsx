import { useState, useMemo } from "react";
import {
  MdBubbleChart,
  MdInfoOutline,
  MdCalendarToday,
  MdHelpOutline,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import type { PerformanceVsFatiguePoint } from "../types/index";

interface DashboardScatterChartProps {
  data: PerformanceVsFatiguePoint[];
}

interface ClusteredScatterPoint {
  key: string;
  performanceRating: number;
  fatigueLevel: number;
  records: PerformanceVsFatiguePoint[];
}

export function DashboardScatterChart({ data }: DashboardScatterChartProps) {
  const [hoveredClusterKey, setHoveredClusterKey] = useState<string | null>(null);
  const [guideOpen, setGuideOpen] = useState(false);

  // Group duplicate or overlapping coordinates into clusters
  const clusters = useMemo<ClusteredScatterPoint[]>(() => {
    if (!data || data.length === 0) return [];
    const map = new Map<string, ClusteredScatterPoint>();

    for (const point of data) {
      const key = `${point.performanceRating}-${point.fatigueLevel}`;
      const existing = map.get(key);
      if (existing) {
        existing.records.push(point);
      } else {
        const cluster: ClusteredScatterPoint = {
          key,
          performanceRating: point.performanceRating,
          fatigueLevel: point.fatigueLevel,
          records: [point],
        };
        map.set(key, cluster);
      }
    }

    return Array.from(map.values());
  }, [data]);

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
  const padY = 22;
  const padBot = 34;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padY - padBot;

  // Performance (0-10) and Fatigue (0-10)
  const toX = (perf: number) =>
    padX + (Math.max(0, Math.min(10, perf)) / 10) * chartW;
  const toY = (fatigue: number) =>
    padY + chartH - (Math.max(0, Math.min(10, fatigue)) / 10) * chartH;

  const activeCluster = hoveredClusterKey
    ? clusters.find((c) => c.key === hoveredClusterKey) || null
    : null;

  const avgPerf = (
    data.reduce((acc, p) => acc + p.performanceRating, 0) / data.length
  ).toFixed(1);

  const avgFatigue = (
    data.reduce((acc, p) => acc + p.fatigueLevel, 0) / data.length
  ).toFixed(1);

  const getZoneMeta = (perf: number, fatigue: number) => {
    if (perf >= 5 && fatigue <= 5)
      return {
        text: "Optimal Peak Zone",
        sub: "Score ≥ 5 · Fatigue ≤ 5",
        color: "text-emerald-500",
        badgeBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400",
        explanation:
          "High performance with low fatigue. Prime readiness state for race pace and high-intensity work.",
      };
    if (perf >= 5 && fatigue > 5)
      return {
        text: "Heavy Training Load",
        sub: "Score ≥ 5 · Fatigue > 5",
        color: "text-amber-500",
        badgeBg: "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400",
        explanation:
          "High performance despite fatigue. Normal in build blocks; monitor to prevent overtraining.",
      };
    if (perf < 5 && fatigue > 5)
      return {
        text: "Exhaustion Alert",
        sub: "Score < 5 · Fatigue > 5",
        color: "text-rose-500",
        badgeBg: "bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400",
        explanation:
          "Low score due to severe fatigue. Immediate rest, recovery, and sleep review recommended.",
      };
    return {
      text: "Under-Stimulation / Deload",
      sub: "Score < 5 · Fatigue ≤ 5",
      color: "text-blue-500",
      badgeBg: "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400",
      explanation:
        "Low output despite low fatigue. Focus on athlete engagement, drills, or increasing stimulus.",
    };
  };

  const midX = toX(5);
  const midY = toY(5);

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-xl bg-secondary-500/10 text-secondary-500">
            <MdBubbleChart className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-foreground">
                Performance vs Fatigue Matrix
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setGuideOpen(true)}
                className="size-6 p-0 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/10"
                title="View Matrix Guide"
              >
                <MdHelpOutline className="size-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Readiness & stress correlation (Scale 1–10)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-muted-foreground bg-muted rounded-lg px-2 py-1">
            {data.length} sessions
          </span>
          <span className="text-[11px] font-medium text-muted-foreground bg-muted rounded-lg px-2 py-1">
            Avg: <span className="text-primary font-bold">{avgPerf}/10</span> ·{" "}
            <span className="text-amber-500 font-bold">{avgFatigue}/10 fatigue</span>
          </span>
        </div>
      </div>

      {/* SVG Chart */}
      <div className="relative mt-4 w-full">
        {/* Hover Tooltip */}
        {activeCluster && (
          <div
            className="pointer-events-none absolute z-30 rounded-xl border border-border/90 bg-card/95 p-3 shadow-xl backdrop-blur-md text-xs min-w-[210px] max-w-[260px]"
            style={{
              left: `${Math.min(85, Math.max(15, (toX(activeCluster.performanceRating) / svgW) * 100))}%`,
              top: `${(toY(activeCluster.fatigueLevel) / svgH) * 100}%`,
              transform: "translate(-50%, -125%)",
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-1.5">
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${
                  getZoneMeta(
                    activeCluster.performanceRating,
                    activeCluster.fatigueLevel,
                  ).badgeBg
                }`}
              >
                {
                  getZoneMeta(
                    activeCluster.performanceRating,
                    activeCluster.fatigueLevel,
                  ).text
                }
              </span>
              <span className="font-bold text-foreground text-[11px]">
                {activeCluster.records.length}{" "}
                {activeCluster.records.length === 1 ? "Session" : "Sessions"}
              </span>
            </div>

            <div className="mt-1.5 flex items-center justify-between text-[11px] bg-muted/40 p-1.5 rounded-lg border border-border/40">
              <span>
                Score: <strong className="text-primary font-bold">{activeCluster.performanceRating}/10</strong>
              </span>
              <span>
                Fatigue: <strong className="text-amber-500 font-bold">{activeCluster.fatigueLevel}/10</strong>
              </span>
            </div>

            <p className="mt-1.5 text-[10px] text-muted-foreground leading-snug">
              {getZoneMeta(activeCluster.performanceRating, activeCluster.fatigueLevel).explanation}
            </p>

            <div className="mt-2 space-y-1 max-h-24 overflow-y-auto border-t border-border/40 pt-1.5">
              {activeCluster.records.map((r, i) => (
                <div
                  key={r.trainingRecordId || i}
                  className="flex items-center justify-between text-[10px] text-muted-foreground"
                >
                  <span className="flex items-center gap-1 font-medium text-foreground">
                    <MdCalendarToday className="size-2.5 text-primary shrink-0" />
                    {new Date(r.sessionDate).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="font-mono text-[9px]">#{r.trainingSessionId}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-44 select-none overflow-visible"
        >
          {/* Quadrant Background Tints */}
          <rect
            x={padX}
            y={padY}
            width={chartW / 2}
            height={chartH / 2}
            fill="#f43f5e"
            fillOpacity="0.06"
            rx="4"
          />
          <rect
            x={midX}
            y={padY}
            width={chartW / 2}
            height={chartH / 2}
            fill="#f59e0b"
            fillOpacity="0.06"
            rx="4"
          />
          <rect
            x={padX}
            y={midY}
            width={chartW / 2}
            height={chartH / 2}
            fill="#3b82f6"
            fillOpacity="0.06"
            rx="4"
          />
          <rect
            x={midX}
            y={midY}
            width={chartW / 2}
            height={chartH / 2}
            fill="#10b981"
            fillOpacity="0.07"
            rx="4"
          />

          {/* Quadrant Dividing Guidelines */}
          <line
            x1={midX}
            y1={padY}
            x2={midX}
            y2={padY + chartH}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="4 4"
            strokeWidth="1.2"
          />
          <line
            x1={padX}
            y1={midY}
            x2={padX + chartW}
            y2={midY}
            stroke="currentColor"
            className="text-border"
            strokeDasharray="4 4"
            strokeWidth="1.2"
          />

          {/* Quadrant Zone Labels */}
          <g className="pointer-events-none select-none">
            <text
              x={padX + 10}
              y={padY + 16}
              className="fill-rose-500 font-bold"
              fontSize="10"
            >
              Exhaustion Alert
            </text>
            <text
              x={padX + 10}
              y={padY + 27}
              className="fill-rose-500/70 text-[8px]"
              fontSize="8"
            >
              Low Score · High Fatigue
            </text>

            <text
              x={padX + chartW - 10}
              y={padY + 16}
              textAnchor="end"
              className="fill-amber-500 font-bold"
              fontSize="10"
            >
              Heavy Training Load
            </text>
            <text
              x={padX + chartW - 10}
              y={padY + 27}
              textAnchor="end"
              className="fill-amber-500/70 text-[8px]"
              fontSize="8"
            >
              High Score · High Fatigue
            </text>

            <text
              x={padX + 10}
              y={padY + chartH - 18}
              className="fill-blue-500 font-bold"
              fontSize="10"
            >
              Under-Stimulation / Deload
            </text>
            <text
              x={padX + 10}
              y={padY + chartH - 8}
              className="fill-blue-500/70 text-[8px]"
              fontSize="8"
            >
              Low Score · Low Fatigue
            </text>

            <text
              x={padX + chartW - 10}
              y={padY + chartH - 18}
              textAnchor="end"
              className="fill-emerald-500 font-bold"
              fontSize="10"
            >
              Optimal Peak Zone
            </text>
            <text
              x={padX + chartW - 10}
              y={padY + chartH - 8}
              textAnchor="end"
              className="fill-emerald-500/70 text-[8px]"
              fontSize="8"
            >
              High Score · Low Fatigue
            </text>
          </g>

          {/* Grid X */}
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
                  y={padY + chartH + 13}
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

          {/* Grid Y */}
          {[0, 2.5, 5, 7.5, 10].map((val) => {
            const y = toY(val);
            return (
              <g key={`gy-${val}`}>
                <line
                  x1={padX}
                  y1={y}
                  x2={padX + chartW}
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

          {/* Axis Labels */}
          <text
            x={svgW / 2}
            y={svgH - 4}
            textAnchor="middle"
            className="fill-muted-foreground font-semibold"
            fontSize="9"
          >
            Performance Rating (1–10) →
          </text>
          <text
            x={10}
            y={padY + chartH / 2}
            textAnchor="middle"
            className="fill-muted-foreground font-semibold"
            fontSize="9"
            transform={`rotate(-90, 10, ${padY + chartH / 2})`}
          >
            Fatigue Level (1–10) →
          </text>

          {/* Clustered Points */}
          {clusters.map((cluster) => {
            const cx = toX(cluster.performanceRating);
            const cy = toY(cluster.fatigueLevel);
            const isHovered = hoveredClusterKey === cluster.key;
            const count = cluster.records.length;

            const dotColor =
              cluster.fatigueLevel <= 3
                ? "#10b981"
                : cluster.fatigueLevel <= 6
                  ? "#f59e0b"
                  : "#ef4444";

            const baseRadius = count > 1 ? 9 : 6.5;
            const radius = isHovered ? baseRadius + 2.5 : baseRadius;

            return (
              <g
                key={cluster.key}
                className="cursor-pointer transition-transform duration-150"
                onMouseEnter={() => setHoveredClusterKey(cluster.key)}
                onMouseLeave={() => setHoveredClusterKey(null)}
              >
                {(isHovered || count > 1) && (
                  <circle
                    cx={cx}
                    cy={cy}
                    r={radius + 3.5}
                    fill={dotColor}
                    fillOpacity={isHovered ? "0.35" : "0.15"}
                  />
                )}

                <circle
                  cx={cx}
                  cy={cy}
                  r={radius}
                  fill={dotColor}
                  fillOpacity="0.95"
                  stroke="#ffffff"
                  strokeWidth={isHovered ? "2.2" : "1.5"}
                  className="transition-all duration-150"
                />

                {count > 1 && (
                  <text
                    x={cx}
                    y={cy + 3}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={isHovered ? "10" : "9"}
                    fontWeight="bold"
                    className="pointer-events-none select-none font-mono"
                  >
                    {count}
                  </text>
                )}

                <circle cx={cx} cy={cy} r={radius + 7} fill="transparent" />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Guide Dialog */}
      <Dialog open={guideOpen} onOpenChange={setGuideOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-base font-bold">
              <MdInfoOutline className="size-5 text-primary" />
              <span>Performance vs Fatigue Matrix Guide</span>
            </DialogTitle>
            <DialogDescription>
              How to interpret the 4 training zones and recommended actions for athletes.
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            {/* Zone 1: Optimal Peak */}
            <div className="rounded-xl border border-emerald-500/25 bg-emerald-500/5 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-emerald-600 dark:text-emerald-400">
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0" />
                  <span>Optimal Peak Zone</span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground block mt-0.5">
                  Score ≥ 5 · Fatigue ≤ 5
                </span>
                <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                  High output with low exertion. Prime readiness state for race pace, technical benchmarks, or key competitions.
                </p>
              </div>
            </div>

            {/* Zone 2: Heavy Load */}
            <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-amber-600 dark:text-amber-400">
                  <span className="size-2 rounded-full bg-amber-500 shrink-0" />
                  <span>Heavy Training Load</span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground block mt-0.5">
                  Score ≥ 5 · Fatigue &gt; 5
                </span>
                <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                  High performance under high strain. Expected during intensive build phases; monitor closely to prevent injury or overreaching.
                </p>
              </div>
            </div>

            {/* Zone 3: Exhaustion Alert */}
            <div className="rounded-xl border border-rose-500/25 bg-rose-500/5 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-rose-600 dark:text-rose-400">
                  <span className="size-2 rounded-full bg-rose-500 shrink-0" />
                  <span>Exhaustion Alert</span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground block mt-0.5">
                  Score &lt; 5 · Fatigue &gt; 5
                </span>
                <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                  Performance drops while fatigue remains severe. Requires immediate deloading, active recovery, nutrition, and sleep review.
                </p>
              </div>
            </div>

            {/* Zone 4: Under-Stimulation */}
            <div className="rounded-xl border border-blue-500/25 bg-blue-500/5 p-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 font-bold text-xs text-blue-600 dark:text-blue-400">
                  <span className="size-2 rounded-full bg-blue-500 shrink-0" />
                  <span>Under-Stimulation / Deload</span>
                </div>
                <span className="text-[10px] font-semibold text-muted-foreground block mt-0.5">
                  Score &lt; 5 · Fatigue ≤ 5
                </span>
                <p className="text-xs text-foreground/80 mt-1.5 leading-relaxed">
                  Low output despite low fatigue. May indicate recovery period, lack of motivation, technical issues, or insufficient training stimulus.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
