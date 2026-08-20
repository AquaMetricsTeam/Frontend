import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import {
  MdOutlineCheckCircle,
  MdOutlineSchedule,
  MdOutlineCancel,
} from "react-icons/md";
import type { ComponentType } from "react";
import { ApprovalStatus } from "../../constants/enums";

interface PlanStatusBadgeProps {
  status: number;
}

const STATUS_CONFIG: Record<
  number,
  { labelKey: string; icon: ComponentType<{ className?: string }>; className: string }
> = {
  [ApprovalStatus.Draft]: {
    labelKey: "status.draft",
    icon: MdOutlineSchedule,
    className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  [ApprovalStatus.Approved]: {
    labelKey: "status.approved",
    icon: MdOutlineCheckCircle,
    className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  [ApprovalStatus.Rejected]: {
    labelKey: "status.rejected",
    icon: MdOutlineCancel,
    className: "border-destructive/30 bg-destructive/15 text-destructive",
  },
};

export default function PlanStatusBadge({ status }: PlanStatusBadgeProps) {
  const { t } = useTranslation("aiPlanView");
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG[ApprovalStatus.Draft];
  const Icon = config.icon;

  return (
    <Badge
      variant="outline"
      className={`gap-1 text-[11px] font-semibold ${config.className}`}
    >
      <Icon className="size-3.5" />
      {t(config.labelKey)}
    </Badge>
  );
}