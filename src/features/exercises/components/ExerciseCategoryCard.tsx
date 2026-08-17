import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCategoryCardProps {
  label: string;
  Icon: LucideIcon;
  colorVar: string;
  onClick: () => void;
}

export function ExerciseCategoryCard({
  label,
  Icon,
  colorVar,
  onClick,
}: ExerciseCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col items-center justify-center gap-3 p-5 rounded-2xl cursor-pointer",
        "border border-border bg-card",
        "transition-all duration-200 ease-out",
        "hover:scale-[1.04] hover:shadow-lg hover:border-transparent",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
      style={
        {
          "--card-accent": colorVar,
        } as React.CSSProperties
      }
    >
      {/* Glow backdrop on hover */}
      <span
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 60%, color-mix(in oklch, ${colorVar} 18%, transparent), transparent 70%)` }}
      />

      {/* Icon ring */}
      <span
        className="relative flex size-12 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110"
        style={{ background: `color-mix(in oklch, ${colorVar} 15%, transparent)` }}
      >
        <Icon
          className="size-6"
          style={{ color: colorVar }}
          strokeWidth={1.75}
        />
      </span>

      <span className="relative text-xs font-semibold text-center text-foreground leading-tight">
        {label}
      </span>
    </button>
  );
}
