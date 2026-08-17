import {
  MdDirectionsRun,
  MdEvent,
  MdLocalHospital,
  MdTrendingUp,
  MdBatteryChargingFull,
  MdWarning,
} from "react-icons/md";
import { useMe } from "@/features/auth/hooks/useMe";
import { DashboardGreeting } from "./DashboardGreeting";
import { DashboardStatCard } from "./DashboardStatCard";
import { DashboardTrendChart } from "./DashboardTrendChart";
import { DashboardScatterChart } from "./DashboardScatterChart";
import type { CoachDashboardData } from "../types/index";

interface CoachDashboardProps {
  data: CoachDashboardData;
}

export function CoachDashboard({ data: d }: CoachDashboardProps) {
  const { data: meRes } = useMe();
  const displayName = meRes?.data?.fullName?.split(" ")[0];
  const injuryRate =
    d.totalSessions > 0 ? Math.round((d.injuries / d.totalSessions) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      <DashboardGreeting
        name={displayName}
        subtitle="Your team's performance at a glance."
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatCard
          label="Assigned Athletes"
          value={d.assignedAthletes}
          icon={MdDirectionsRun}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          valueColor="text-primary"
        />
        <DashboardStatCard
          label="Total Sessions"
          value={d.totalSessions}
          icon={MdEvent}
          iconColor="text-secondary-500"
          iconBg="bg-secondary-500/10"
          valueColor="text-foreground"
        />
        <DashboardStatCard
          label="Injuries"
          value={d.injuries}
          sub={d.totalSessions > 0 ? `${injuryRate}% of sessions` : undefined}
          icon={MdLocalHospital}
          iconColor="text-rose-500"
          iconBg="bg-rose-500/10"
          valueColor={d.injuries > 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground"}
          trend={Math.min(100, injuryRate * 5)}
          trendColor={d.injuries > 3 ? "bg-rose-500" : "bg-amber-500"}
        />
      </div>

      {/* Injury notice */}
      {d.injuries > 0 && (
        <div className="flex items-center gap-3 rounded-2xl border border-rose-500/25 bg-rose-500/8 p-4 text-rose-700 dark:text-rose-400">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-rose-500/15">
            <MdWarning className="size-4 text-rose-500" />
          </div>
          <div className="text-xs">
            <span className="font-bold">{d.injuries} {d.injuries === 1 ? "injury" : "injuries"}</span> recorded.
            Review affected athletes and consider adjusting training intensity.
          </div>
        </div>
      )}

      {/* Trend Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardTrendChart
          data={d.performanceTrend}
          title="Performance Trend"
          subtitle="Average performance across your athletes"
          icon={MdTrendingUp}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          strokeColor="var(--primary)"
          gradientId="coach-perf-grad"
          valueLabel="score"
        />
        <DashboardTrendChart
          data={d.fatigueTrend}
          title="Fatigue Trend"
          subtitle="Average fatigue level across athletes"
          icon={MdBatteryChargingFull}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          strokeColor="#f59e0b"
          gradientId="coach-fatigue-grad"
          valueLabel="/ 10"
          maxValue={10}
        />
      </div>

      {/* Injuries + Scatter */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardTrendChart
          data={d.injuriesOverTime}
          title="Injuries Over Time"
          subtitle="Injury count across sessions"
          icon={MdLocalHospital}
          iconColor="text-rose-500"
          iconBg="bg-rose-500/10"
          strokeColor="#f43f5e"
          gradientId="coach-injury-grad"
          valueLabel="injuries"
          maxValue={Math.max(5, ...d.injuriesOverTime.map((p) => p.value))}
        />
        <DashboardScatterChart data={d.performanceVsFatigue} />
      </div>
    </div>
  );
}
