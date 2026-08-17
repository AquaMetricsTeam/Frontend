import { useState } from "react";
import { MdDonutLarge, MdInfoOutline } from "react-icons/md";
import type { DomainCount } from "../types/index";

const PALETTE = [
  "var(--primary)",
  "var(--secondary-500, #06b6d4)",
  "#f59e0b",
  "#10b981",
  "#8b5cf6",
  "#f43f5e",
];

interface AdminDomainDonutChartProps {
  data: DomainCount[];
}

export function AdminDomainDonutChart({ data }: AdminDomainDonutChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-8 text-center shadow-xs min-h-[240px]">
        <div className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MdInfoOutline className="size-5" />
        </div>
        <p className="mt-3 text-sm font-medium text-foreground">No domain data</p>
      </div>
    );
  }

  const total = data.reduce((s, d) => s + d.athleteCount, 0);

  // Build SVG arcs
  const cx = 100;
  const cy = 100;
  const R = 80;
  const r = 52; // inner radius for donut

  function polarToCartesian(angle: number, radius: number) {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + radius * Math.cos(rad),
      y: cy + radius * Math.sin(rad),
    };
  }

  function arcPath(startAngle: number, endAngle: number, outerR: number, innerR: number) {
    const s1 = polarToCartesian(startAngle, outerR);
    const e1 = polarToCartesian(endAngle, outerR);
    const s2 = polarToCartesian(endAngle, innerR);
    const e2 = polarToCartesian(startAngle, innerR);
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    return [
      `M ${s1.x},${s1.y}`,
      `A ${outerR},${outerR} 0 ${largeArc} 1 ${e1.x},${e1.y}`,
      `L ${s2.x},${s2.y}`,
      `A ${innerR},${innerR} 0 ${largeArc} 0 ${e2.x},${e2.y}`,
      "Z",
    ].join(" ");
  }

  let currentAngle = 0;
  const arcs = data.map((d, idx) => {
    const angle = (d.athleteCount / total) * 360;
    const start = currentAngle;
    const end = currentAngle + angle;
    currentAngle = end;
    return { ...d, start, end, idx };
  });

  const hovered = hoveredIdx !== null ? arcs[hoveredIdx] : null;
  const centerLabel = hovered
    ? { value: hovered.athleteCount, name: hovered.domainName }
    : { value: total, name: "Total" };

  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-xs transition-all hover:shadow-md">
      <div className="flex items-center gap-3 border-b border-border/70 pb-4">
        <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <MdDonutLarge className="size-5" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-foreground">Athletes by Domain</h3>
          <p className="text-xs text-muted-foreground">Distribution across disciplines</p>
        </div>
      </div>

      <div className="mt-4 flex flex-col sm:flex-row items-center gap-6">
        {/* SVG Donut */}
        <div className="relative shrink-0">
          <svg viewBox="0 0 200 200" className="w-44 h-44">
            {arcs.map((arc, idx) => {
              const isHovered = hoveredIdx === idx;
              const scaleTranslate = isHovered
                ? `translate(${cx}px, ${cy}px) scale(1.06) translate(-${cx}px, -${cy}px)`
                : "none";
              return (
                <path
                  key={arc.domainId}
                  d={arcPath(arc.start, arc.end, R, r)}
                  fill={PALETTE[idx % PALETTE.length]}
                  fillOpacity={isHovered ? 1 : 0.8}
                  stroke="var(--card)"
                  strokeWidth="2"
                  style={{ transform: scaleTranslate, transition: "transform 0.15s ease, fill-opacity 0.15s" }}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </svg>
          {/* Center label overlay */}
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold tracking-tight text-foreground font-display">
              {centerLabel.value}
            </span>
            <span className="text-[10px] text-muted-foreground font-medium">
              {centerLabel.name}
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 min-w-0 w-full">
          {arcs.map((arc, idx) => {
            const pct = total > 0 ? Math.round((arc.athleteCount / total) * 100) : 0;
            const color = PALETTE[idx % PALETTE.length];
            return (
              <div
                key={arc.domainId}
                className="flex items-center gap-2.5 group cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                <span
                  className="shrink-0 size-2.5 rounded-full transition-transform group-hover:scale-125"
                  style={{ background: color }}
                />
                <span className="text-xs text-foreground font-medium truncate flex-1">
                  {arc.domainName}
                </span>
                <span className="text-xs tabular-nums text-muted-foreground shrink-0">
                  {arc.athleteCount}
                </span>
                <span className="text-[10px] tabular-nums text-muted-foreground/70 shrink-0 w-8 text-end">
                  {pct}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
