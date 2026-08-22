import { useTranslation } from "react-i18next";
import {
  MdDirectionsRun,
  MdEvent,
  MdLocalHospital,
  MdTrendingUp,
  MdBatteryChargingFull,
} from "react-icons/md";
import { useMe } from "@/features/auth/hooks/useMe";
import { DashboardGreeting } from "./DashboardGreeting";
import { DashboardStatCard } from "./DashboardStatCard";
import { DashboardTrendChart } from "./DashboardTrendChart";
import { DashboardScatterChart } from "./DashboardScatterChart";
import { AdminDomainDonutChart } from "./AdminDomainDonutChart";
import { InjuredAthletesCard } from "./InjuredAthletesCard";
import type { AdminDashboardData } from "../types/index";

interface AdminDashboardProps {
  data: AdminDashboardData;
}

export function AdminDashboard({ data: d }: AdminDashboardProps) {
  const { t } = useTranslation("dashboard");
  const { data: meRes } = useMe();
  const displayName = meRes?.data?.fullName?.split(" ")[0];
  const injuryRate =
    d.totalSessions > 0 ? Math.round((d.totalInjuries / d.totalSessions) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      <DashboardGreeting
        name={displayName}
        subtitle={t("greeting.adminSubtitle")}
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <DashboardStatCard
          label={t("kpis.totalAthletes")}
          value={d.totalAthletes}
          icon={MdDirectionsRun}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          valueColor="text-primary"
        />
        <DashboardStatCard
          label={t("kpis.totalSessions")}
          value={d.totalSessions}
          icon={MdEvent}
          iconColor="text-secondary-500"
          iconBg="bg-secondary-500/10"
          valueColor="text-foreground"
        />
        <DashboardStatCard
          label={t("kpis.totalInjuries")}
          value={d.totalInjuries}
          sub={t("kpis.injuryRate", { rate: injuryRate })}
          icon={MdLocalHospital}
          iconColor="text-rose-500"
          iconBg="bg-rose-500/10"
          valueColor={d.totalInjuries > 0 ? "text-rose-600 dark:text-rose-400" : "text-foreground"}
          trend={Math.min(100, injuryRate * 5)}
          trendColor={d.totalInjuries > 5 ? "bg-rose-500" : "bg-amber-500"}
        />
      </div>

      {/* Injured Athletes List */}
      {((d.injuredAthletes && d.injuredAthletes.length > 0) || d.totalInjuries > 0) && (
        <InjuredAthletesCard athletes={d.injuredAthletes || []} />
      )}

      {/* Trend Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardTrendChart
          data={d.performanceTrend}
          title={t("charts.performanceTrend")}
          subtitle={t("charts.performanceTrendSubtitle")}
          icon={MdTrendingUp}
          iconColor="text-primary"
          iconBg="bg-primary/10"
          strokeColor="var(--primary)"
          gradientId="admin-perf-grad"
          valueLabel={t("kpis.outOfTen")}
          maxValue={10}
        />
        <DashboardTrendChart
          data={d.fatigueTrend}
          title={t("charts.fatigueTrend")}
          subtitle={t("charts.fatigueTrendSubtitle")}
          icon={MdBatteryChargingFull}
          iconColor="text-amber-500"
          iconBg="bg-amber-500/10"
          strokeColor="#f59e0b"
          gradientId="admin-fatigue-grad"
          valueLabel={t("kpis.outOfTen")}
          maxValue={10}
        />
      </div>

      {/* Injuries + Domain Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <DashboardTrendChart
          data={d.injuriesOverTime}
          title={t("charts.injuriesOverTime")}
          subtitle={t("charts.injuriesOverTimeSubtitle")}
          icon={MdLocalHospital}
          iconColor="text-rose-500"
          iconBg="bg-rose-500/10"
          strokeColor="#f43f5e"
          gradientId="admin-injury-grad"
          valueLabel={t("charts.injuriesUnit")}
          maxValue={Math.max(5, ...d.injuriesOverTime.map((p) => p.value))}
        />
        <AdminDomainDonutChart data={d.athletesPerDomain} />
      </div>

      {/* Scatter Chart */}
      <DashboardScatterChart data={d.performanceVsFatigue} />
    </div>
  );
}
