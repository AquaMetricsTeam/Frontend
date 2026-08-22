import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExerciseCategoryCardProps {
  label: string;
  sublabel?: string;
  tag?: string;
  Icon: LucideIcon;
  colorVar?: string;
  accentClass?: string;
  iconBgClass?: string;
  glowColor?: string;
  onClick: () => void;
}

export function ExerciseCategoryCard({
  label,
  sublabel,
  tag,
  Icon,
  colorVar,
  accentClass,
  iconBgClass,
  glowColor,
  onClick,
}: ExerciseCategoryCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative flex flex-col justify-between p-4.5 sm:p-5 rounded-2xl cursor-pointer text-start",
        "border border-border/70 bg-card/60 backdrop-blur-md",
        "transition-all duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/5 hover:border-primary/40 hover:bg-card/90",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "overflow-hidden min-h-[136px] w-full",
      )}
    >
      {/* Top subtle highlight sheen */}
      <span className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent group-hover:via-primary/40 transition-all duration-300 pointer-events-none" />

      {/* Atmospheric ambient glow backdrop on hover */}
      <span
        className="pointer-events-none absolute -bottom-8 -end-8 size-28 rounded-full blur-2xl opacity-0 group-hover:opacity-35 transition-all duration-500"
        style={{
          background: glowColor || (colorVar ? `color-mix(in oklch, ${colorVar} 40%, transparent)` : "var(--primary)"),
        }}
      />

      {/* Top row: Icon + Tag & Arrow Affordance */}
      <div className="relative z-10 flex items-center justify-between w-full gap-2 mb-3">
        {/* Stylized Icon Badge */}
        <span
          className={cn(
            "relative flex size-11 sm:size-12 items-center justify-center rounded-xl border transition-all duration-300",
            "group-hover:scale-110 group-hover:shadow-md",
            iconBgClass || "bg-primary/10 border-primary/20 text-primary",
          )}
          style={
            !iconBgClass && colorVar
              ? {
                  background: `color-mix(in oklch, ${colorVar} 15%, transparent)`,
                  borderColor: `color-mix(in oklch, ${colorVar} 30%, transparent)`,
                }
              : undefined
          }
        >
          <Icon
            className={cn("size-5 sm:size-6 transition-transform duration-300", accentClass)}
            style={!accentClass && colorVar ? { color: colorVar } : undefined}
            strokeWidth={1.85}
          />
        </span>

        {/* Right Tag & Hover Arrow */}
        <div className="flex items-center gap-1.5">
          {tag && (
            <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-muted/60 text-muted-foreground border border-border/50 group-hover:border-primary/30 group-hover:text-primary transition-colors">
              {tag}
            </span>
          )}
          <span className="flex size-7 items-center justify-center rounded-lg bg-muted/30 text-muted-foreground/60 group-hover:bg-primary/10 group-hover:text-primary group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rtl:group-hover:-translate-x-0.5 transition-all duration-300">
            <ArrowUpRight className="size-3.5 rtl:-scale-x-100" />
          </span>
        </div>
      </div>

      {/* Bottom row: Category Name & Subtitle */}
      <div className="relative z-10 w-full mt-auto">
        {tag && (
          <span className="sm:hidden block text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-0.5">
            {tag}
          </span>
        )}
        <h3
          className="text-sm sm:text-base font-bold text-foreground tracking-tight group-hover:text-primary transition-colors leading-snug font-display line-clamp-1"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {label}
        </h3>
        {sublabel && (
          <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 line-clamp-1 group-hover:text-foreground/80 transition-colors">
            {sublabel}
          </p>
        )}
      </div>
    </button>
  );
}

