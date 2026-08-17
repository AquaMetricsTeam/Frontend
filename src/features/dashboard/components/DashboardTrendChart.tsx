import { useState } from "react";
import { MdInfoOutline } from "react-icons/md";
import type { ElementType } from "react";
import type { TrendPoint } from "../types/index";

interface DashboardTrendChartProps {
  data: TrendPoint[];
  title: string;
  subtitle?: string;
  icon: ElementType;
  iconColor?: string;
  iconBg?: string;
  strokeColor?: string;
  gradientId: string;
  valueLabel?: string;
  maxValue?: number;
  emptyMessage?: string;
}

export function DashboardTrendChart({
  data,
  title,
  subtitle,
  icon: Icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
  strokeColor = "var(--primary)",
  gradientId,
  valueLabel = "",
  maxValue = 100,
  emptyMessage = "No data available",
}: DashboardTrendChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xs min-h-[240px]">
        <div className={`flex size-11 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <MdInfoOutline className="size-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">{emptyMessage}</p>
        <p className="mt-1 text-xs text-muted-foreground">No sessions recorded yet.</p>
      </div>
    );
  }

  const sorted = [...data].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const svgW = 600;
  const svgH = 200;
  const padX = 36;
  const padTop = 24;
  const padBot = 32;
  const chartW = svgW - padX * 2;
  const chartH = svgH - padTop - padBot;

  const min = 0;
  const max = Math.max(maxValue, ...sorted.map((d) => d.value));
  const range = max - min || 1;

  const coords = sorted.map((pt, idx) => {
    const x =
      sorted.length === 1
        ? svgW / 2
        : padX + (idx / (sorted.length - 1)) * chartW;
    const normalized = (pt.value - min) / range;
    const y = padTop + chartH - normalized * chartH;
    return { ...pt, x, y };
  });

  let pathD =
    coords.length === 1
      ? `M ${coords[0].x - 20},${coords[0].y} L ${coords[0].x + 20},${coords[0].y}`
      : `M ${coords[0].x},${coords[0].y}`;

  if (coords.length > 1) {
    for (let i = 0; i < coords.length - 1; i++) {
      const p0 = coords[i === 0 ? 0 : i - 1];
      const p1 = coords[i];
      const p2 = coords[i + 1];
      const p3 = coords[Math.min(i + 2, coords.length - 1)];

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      pathD += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
    }
  }

  const areaD =
    coords.length > 1
      ? `${pathD} L ${coords[coords.length - 1].x},${padTop + chartH} L ${coords[0].x},${padTop + chartH} Z`
      : "";

  const activePoint = hoveredIdx !== null ? coords[hoveredIdx] : null;

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-border/70 pb-4">
        <div className={`flex size-9 items-center justify-center rounded-xl ${iconBg} ${iconColor}`}>
          <Icon className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
        <span className="ms-auto text-[11px] font-medium text-muted-foreground bg-muted rounded-lg px-2 py-0.5">
          {sorted.length} points
        </span>
      </div>

      {/* SVG */}
      <div className="relative mt-4 w-full">
        {activePoint && (
          <div
            className="pointer-events-none absolute z-20 rounded-xl border border-border/80 bg-card/95 p-2.5 shadow-lg backdrop-blur-md text-xs"
            style={{
              left: `${(activePoint.x / svgW) * 100}%`,
              top: `${(activePoint.y / svgH) * 100}%`,
              transform: "translate(-50%, -120%)",
            }}
          >
            <div className="font-semibold text-foreground">
              {new Date(activePoint.date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </div>
            <div className="mt-0.5 font-bold" style={{ color: strokeColor }}>
              {activePoint.value}
              {valueLabel && <span className="text-muted-foreground font-normal ms-1">{valueLabel}</span>}
            </div>
          </div>
        )}

        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="w-full h-44 select-none overflow-visible"
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={strokeColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const val = Math.round(min + frac * range);
            const y = padTop + chartH - frac * chartH;
            return (
              <g key={frac}>
                <line
                  x1={padX} y1={y} x2={svgW - padX} y2={y}
                  stroke="currentColor"
                  className="text-border/50"
                  strokeDasharray={frac === 0 || frac === 1 ? "0" : "4 4"}
                  strokeWidth="1"
                />
                <text
                  x={padX - 6} y={y + 3}
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

          {areaD && <path d={areaD} fill={`url(#${gradientId})`} />}

          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {activePoint && (
            <line
              x1={activePoint.x} y1={padTop}
              x2={activePoint.x} y2={padTop + chartH}
              stroke={strokeColor}
              strokeOpacity="0.4"
              strokeDasharray="3 3"
              strokeWidth="1.5"
            />
          )}

          {coords.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            return (
              <g
                key={`${pt.date}-${idx}`}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <circle
                  cx={pt.x} cy={pt.y}
                  r={isHovered ? "6" : "4"}
                  fill="var(--card)"
                  stroke={strokeColor}
                  strokeWidth={isHovered ? "3" : "2"}
                  className="transition-all"
                />
                <circle cx={pt.x} cy={pt.y} r="14" fill="transparent" />
              </g>
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="mt-1 flex items-center justify-between px-8 text-[10px] text-muted-foreground">
          <span>
            {coords.length > 0
              ? new Date(coords[0].date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
              : ""}
          </span>
          {coords.length > 2 && (
            <span>
              {new Date(coords[Math.floor(coords.length / 2)].date).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          )}
          <span>
            {coords.length > 1
              ? new Date(coords[coords.length - 1].date).toLocaleDateString(undefined, {
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
