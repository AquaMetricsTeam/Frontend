import { useMemo } from "react";
import { MdWbSunny, MdWbTwilight, MdNightsStay } from "react-icons/md";

interface DashboardGreetingProps {
  name?: string;
  subtitle?: string;
}

export function DashboardGreeting({ name, subtitle }: DashboardGreetingProps) {
  const { greeting, Icon, iconClass, gradientClass } = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      return {
        greeting: "Good morning",
        Icon: MdWbSunny,
        iconClass: "text-amber-500",
        gradientClass: "from-amber-500/8 via-primary/5 to-transparent",
      };
    }
    if (hour < 17) {
      return {
        greeting: "Good afternoon",
        Icon: MdWbTwilight,
        iconClass: "text-orange-500",
        gradientClass: "from-orange-500/8 via-primary/5 to-transparent",
      };
    }
    return {
      greeting: "Good evening",
      Icon: MdNightsStay,
      iconClass: "text-indigo-500",
      gradientClass: "from-indigo-500/8 via-primary/5 to-transparent",
    };
  }, []);

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`relative overflow-hidden rounded-2xl border border-border/80 bg-card shadow-xs`}>
      {/* Gradient wash */}
      <div className={`absolute inset-0 bg-linear-to-br ${gradientClass} pointer-events-none`} />

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <div className={`flex size-12 shrink-0 items-center justify-center rounded-2xl bg-card border border-border/80 shadow-xs ${iconClass}`}>
            <Icon className="size-6" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{today}</p>
            <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground font-display">
              {greeting}{name ? `, ${name}` : ""}
            </h1>
            {subtitle && (
              <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="inline-flex items-center gap-1.5 rounded-xl border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-muted-foreground backdrop-blur-xs">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Live data
          </span>
        </div>
      </div>
    </div>
  );
}
