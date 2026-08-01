import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { StaffRole } from "../types/index";

interface RoleBadgeProps {
  role: StaffRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  const { t } = useTranslation("users");

  const styles: Record<StaffRole, string> = {
    Admin: "border-sky-500/30 text-sky-500 dark:border-sky-400/20 dark:text-sky-400 bg-sky-500/5",
    SwimmingCoach: "border-teal-500/30 text-teal-600 dark:border-teal-400/20 dark:text-teal-400 bg-teal-500/5",
    FitnessCoach: "border-blue-500/30 text-blue-600 dark:border-blue-400/20 dark:text-blue-400 bg-blue-500/5",
    NutritionSpecialist: "border-emerald-500/30 text-emerald-600 dark:border-emerald-400/20 dark:text-emerald-400 bg-emerald-500/5",
    Athlete: "border-amber-500/30 text-amber-600 dark:border-amber-400/20 dark:text-amber-400 bg-amber-500/5",
  };

  return (
    <Badge
      variant="outline"
      className={cn(
        "rounded-full px-2.5 py-0.5 text-xs font-semibold border",
        styles[role],
        className
      )}
    >
      {t(`users:roles.${role}`)}
    </Badge>
  );
}
