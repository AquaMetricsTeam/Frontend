import { useTranslation } from "react-i18next";
import { useMe } from "@/features/auth/hooks/useMe";

export interface RepsLabelProps {
  /**
   * Type of the exercise / plan: 'swimming' or 'fitness'
   */
  type?: "swimming" | "fitness" | string;
  /**
   * Explicit boolean flag if swimming
   */
  isSwimming?: boolean;
  /**
   * If true, renders unit suffix only: 'm' vs 'reps'
   */
  unitOnly?: boolean;
  /**
   * If provided, formats number with unit: e.g. '100m' or '10 reps'
   */
  value?: number | string | null;
  /**
   * Optional custom className
   */
  className?: string;
  /**
   * If true, renders total label: 'Total Distance' vs 'Total Reps'
   */
  total?: boolean;
}

export function useRepsLabel(options?: {
  type?: "swimming" | "fitness" | string;
  isSwimming?: boolean;
}) {
  const { t } = useTranslation(["training", "common"]);
  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];
  const isSwimmingCoach = roles.includes("SwimmingCoach") && !roles.includes("FitnessCoach");

  const isSwim =
    options?.isSwimming !== undefined
      ? Boolean(options.isSwimming)
      : options?.type === "swimming" || options?.type === "swim"
      ? true
      : options?.type === "fitness"
      ? false
      : isSwimmingCoach;

  const label = isSwim
    ? t("training:labels.meters", "Meters")
    : t("training:labels.reps", "Reps");

  const unit = isSwim
    ? t("training:labels.metersUnit", "m")
    : t("training:labels.repsUnit", "reps");

  const totalLabel = isSwim
    ? t("training:labels.totalMeters", "Total Distance")
    : t("training:labels.totalReps", "Total Reps");

  const formatValue = (val: number | string | null | undefined) => {
    if (val === undefined || val === null) return "";
    return isSwim ? `${val}m` : `${val} ${unit}`;
  };

  return {
    isSwimming: isSwim,
    label,
    unit,
    totalLabel,
    formatValue,
  };
}

export function RepsLabel({
  type,
  isSwimming,
  unitOnly = false,
  total = false,
  value,
  className,
}: RepsLabelProps) {
  const { label, unit, totalLabel, formatValue } = useRepsLabel({
    type,
    isSwimming,
  });

  if (value !== undefined && value !== null) {
    return <span className={className}>{formatValue(value)}</span>;
  }

  if (total) {
    return <span className={className}>{totalLabel}</span>;
  }

  if (unitOnly) {
    return <span className={className}>{unit}</span>;
  }

  return <span className={className}>{label}</span>;
}
