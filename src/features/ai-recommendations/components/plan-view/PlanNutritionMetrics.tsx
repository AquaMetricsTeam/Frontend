import { useTranslation } from "react-i18next";
import {
  MdLocalFireDepartment,
  MdEggAlt,
  MdRiceBowl,
  MdOilBarrel,
  MdRestaurant,
} from "react-icons/md";
import type { ComponentType } from "react";
import type { AthleteCurrentPlanDto } from "../../types/index";

interface PlanNutritionMetricsProps {
  plan: AthleteCurrentPlanDto;
}

export default function PlanNutritionMetrics({ plan }: PlanNutritionMetricsProps) {
  const { t } = useTranslation("aiPlanView");

  if (plan.domainId !== 3) return null;

  const metrics: {
    label: string;
    value: number | null;
    icon: ComponentType<{ className?: string }>;
    accent: string;
    format: (v: number) => string;
  }[] = [
    {
      label: t("nutrition.dailyCalories"),
      value: plan.dailyCalories,
      icon: MdLocalFireDepartment,
      accent: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
      format: (v: number) => t("nutrition.calories", { value: v }),
    },
    {
      label: t("nutrition.protein"),
      value: plan.proteinGrams,
      icon: MdEggAlt,
      accent: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
      format: (v: number) => t("nutrition.grams", { value: v }),
    },
    {
      label: t("nutrition.carbs"),
      value: plan.carbGrams,
      icon: MdRiceBowl,
      accent: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
      format: (v: number) => t("nutrition.grams", { value: v }),
    },
    {
      label: t("nutrition.fat"),
      value: plan.fatGrams,
      icon: MdOilBarrel,
      accent: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
      format: (v: number) => t("nutrition.grams", { value: v }),
    },
  ];

  return (
    <div className="space-y-3 rounded-xl border border-border bg-card p-4 shadow-xs">
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MdRestaurant className="size-4" />
        </div>
        <h4 className="text-sm font-bold text-foreground">{t("nutrition.title")}</h4>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div
              key={m.label}
              className="rounded-xl border border-border/80 bg-muted/40 p-3.5"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] font-semibold text-muted-foreground">
                  {m.label}
                </span>
                <div
                  className={`flex size-6 shrink-0 items-center justify-center rounded-md ${m.accent}`}
                >
                  <Icon className="size-3.5" />
                </div>
              </div>
              <p className="mt-2 text-lg font-bold tracking-tight text-foreground">
                {m.value != null ? m.format(m.value) : "—"}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}