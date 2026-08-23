import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { MdHourglassTop, MdCheckCircle, MdCancel, MdSchedule, MdChevronRight } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecommendationStatus } from "../../constants/enums";
import type { RecommendationListItem } from "../../types/index";
import type { ComponentType } from "react";
import RecommendationPlanSheet from "../plan-view/RecommendationPlanSheet";

interface RecommendationListItemProps {
  item: RecommendationListItem;
}

const STATUS_CONFIG: Record<
  number,
  {
    labelKey: string;
    badgeClassName: string;
    tileClassName: string;
    icon: ComponentType<{ className?: string }>;
  }
> = {
  [RecommendationStatus.Pending]: {
    labelKey: "filters.pending",
    badgeClassName:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    tileClassName: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    icon: MdHourglassTop,
  },
  [RecommendationStatus.Approved]: {
    labelKey: "filters.approved",
    badgeClassName:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    tileClassName: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    icon: MdCheckCircle,
  },
  [RecommendationStatus.Rejected]: {
    labelKey: "filters.rejected",
    badgeClassName: "border-destructive/30 bg-destructive/15 text-destructive",
    tileClassName: "bg-destructive/10 text-destructive",
    icon: MdCancel,
  },
};

export default function RecommendationListItem({
  item,
}: RecommendationListItemProps) {
  const { t, i18n } = useTranslation("aiInbox");
  const navigate = useNavigate();
  const [planOpen, setPlanOpen] = useState(false);

  const statusInfo =
    STATUS_CONFIG[item.status] ?? STATUS_CONFIG[RecommendationStatus.Pending];
  const StatusIcon = statusInfo.icon;
  const generatedDate = new Date(item.generatedAt).toLocaleDateString(i18n.language);
  // Normalize defensively: some payloads serialize ids as strings.
  const numericPlanId = item.planId == null ? NaN : Number(item.planId);
  const hasPlanId = Number.isFinite(numericPlanId) && numericPlanId > 0;

  return (
    <>
      <div className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-sm">
      <div
        className={`flex size-10 shrink-0 items-center justify-center rounded-xl ${statusInfo.tileClassName}`}
      >
        <StatusIcon className="size-5" />
      </div>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
            {item.athleteName}
          </span>
          <Badge variant="outline" className={statusInfo.badgeClassName}>
            {t(statusInfo.labelKey)}
          </Badge>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {item.recommendation}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <MdSchedule className="size-3.5 shrink-0" />
          <span>{t("list.generatedAt", { date: generatedDate })}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {hasPlanId && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPlanOpen(true)}
            className="cursor-pointer gap-1 rounded-xl text-xs font-semibold"
          >
            {t("list.viewPlan")}
            <MdChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/ai/review/${item.id}`, {
              state: { planId: hasPlanId ? numericPlanId : null },
            })
          }
          className="cursor-pointer gap-1 rounded-xl text-xs font-semibold"
        >
          {t("list.viewReview")}
          <MdChevronRight className="size-4 rtl:rotate-180" />
        </Button>
      </div>
      </div>

      <RecommendationPlanSheet
        domainId={item.domainId}
        planId={hasPlanId ? numericPlanId : null}
        editable={item.status !== RecommendationStatus.Rejected}
        open={planOpen}
        onOpenChange={setPlanOpen}
      />
    </>
  );
}