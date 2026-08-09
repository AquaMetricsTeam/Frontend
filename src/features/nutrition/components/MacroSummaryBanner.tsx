import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { MdLocalFireDepartment } from "react-icons/md";
import type { NutritionPlanMeal } from "../types/index";

interface MacroSummaryBannerProps {
  meals: NutritionPlanMeal[];
  sticky?: boolean;
  className?: string;
}

export function MacroSummaryBanner({
  meals,
  sticky = true,
  className = "",
}: MacroSummaryBannerProps) {
  const { t } = useTranslation("nutrition");

  const totals = useMemo(
    () =>
      meals.reduce(
        (acc, meal) => ({
          calories: acc.calories + (Number(meal.calories) || 0),
          protein: acc.protein + (Number(meal.proteinGrams) || 0),
          carbs: acc.carbs + (Number(meal.carbGrams) || 0),
          fat: acc.fat + (Number(meal.fatGrams) || 0),
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      ),
    [meals],
  );

  const stats = [
    {
      label: t("macro.calories"),
      value: totals.calories.toFixed(0),
      unit: "kcal",
      valueColor: "text-orange-400",
      Icon: MdLocalFireDepartment,
      iconColor: "text-orange-400",
    },
    {
      label: t("macro.protein"),
      value: totals.protein.toFixed(0),
      unit: "g",
      valueColor: "text-blue-400",
      Icon: null,
      iconColor: "",
    },
    {
      label: t("macro.carbs"),
      value: totals.carbs.toFixed(0),
      unit: "g",
      valueColor: "text-amber-400",
      Icon: null,
      iconColor: "",
    },
    {
      label: t("macro.fat"),
      value: totals.fat.toFixed(0),
      unit: "g",
      valueColor: "text-rose-400",
      Icon: null,
      iconColor: "",
    },
  ];

  return (
    <div
      className={[
        sticky ? "sticky top-0 z-40" : "",
        className,
        "bg-slate-900/95 backdrop-blur-sm border-b border-slate-700/50 px-4 py-2.5",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 shrink-0">
          {t("macro.summaryTitle")}
        </span>

        <div className="flex items-center gap-1 flex-wrap">
          {stats.map((stat, i) => (
            <div key={stat.label} className="flex items-center gap-1 shrink-0">
              {i > 0 && <span className="text-slate-700 mx-1.5">|</span>}

              {stat.Icon && (
                <stat.Icon className={`${stat.iconColor} size-3 shrink-0`} />
              )}

              <span className="text-[11px] text-slate-400 font-medium">
                {stat.label}
              </span>

              <span
                className={`${stat.valueColor} text-sm font-bold tabular-nums ms-0.5`}
              >
                {stat.value}
              </span>

              <span className="text-[11px] text-slate-500">{stat.unit}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
