import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { MdHourglassTop, MdCheckCircle, MdCancel, MdSchedule, MdChevronRight, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RecommendationStatus } from "../../constants/enums";
import { AI_KEYS } from "../../constants/queryKeys";
import { getRecommendation } from "../../services/getRecommendation.service";
import type { RecommendationListItem } from "../../types/index";
import type { ComponentType } from "react";
import RecommendationPlanSheet from "../plan-view/RecommendationPlanSheet";

interface RecommendationListItemProps {
  item: RecommendationListItem;
}

// The list payload has shifted shape across backend iterations, so resolve
// the plan id from every field it may live under (ids can also be strings).
function extractPlanId(source: unknown): number | null {
  if (!source || typeof source !== "object") return null;
  const record = source as Record<string, unknown>;
  const nested = record.recommendation;
  const candidates = [
    record.planId,
    nested && typeof nested === "object" ? (nested as Record<string, unknown>).planId : undefined,
    record.trainingPlanId,
    record.nutritionPlanId,
  ];
  for (const candidate of candidates) {
    if (candidate == null) continue;
    const numeric = Number(candidate);
    if (Number.isFinite(numeric) && numeric > 0) return numeric;
  }
  return null;
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
  const queryClient = useQueryClient();
  const [planOpen, setPlanOpen] = useState(false);
  const [planEditMode, setPlanEditMode] = useState(false);
  const [onDemandPlanId, setOnDemandPlanId] = useState<number | null>(null);
  const [isResolvingPlan, setIsResolvingPlan] = useState(false);

  console.log("[RecommendationListItem] item data:", item);

  const statusInfo =
    STATUS_CONFIG[item.status] ?? STATUS_CONFIG[RecommendationStatus.Pending];
  const StatusIcon = statusInfo.icon;
  const isPendingItem = item.status === RecommendationStatus.Pending;
  const generatedDate = new Date(item.generatedAt).toLocaleDateString(i18n.language);
  // Resolve from any payload shape first; fall back to an id fetched
  // on demand (detail endpoint) the first time Edit Plan is clicked.
  const resolvedPlanId = extractPlanId(item) ?? onDemandPlanId;

  const openEditor = () => {
    setPlanEditMode(true);
    setPlanOpen(true);
  };

  const handleEditPlanClick = async () => {
    if (resolvedPlanId != null) {
      openEditor();
      return;
    }
    setIsResolvingPlan(true);
    try {
      const res = await queryClient.fetchQuery({
        queryKey: AI_KEYS.recommendationDetail(item.id),
        queryFn: () => getRecommendation(item.id),
      });
      const detailPlanId = extractPlanId(res?.data);
      if (detailPlanId != null) {
        setOnDemandPlanId(detailPlanId);
        openEditor();
      } else {
        toast.error(t("list.noPlanAttached"));
      }
    } catch {
      toast.error(t("toasts.fetchError"));
    } finally {
      setIsResolvingPlan(false);
    }
  };

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
        {resolvedPlanId != null && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPlanEditMode(false);
              setPlanOpen(true);
            }}
            className="cursor-pointer gap-1 rounded-xl text-xs font-semibold"
          >
            {t("list.viewPlan")}
            <MdChevronRight className="size-4 rtl:rotate-180" />
          </Button>
        )}
        {isPendingItem && (
          <Button
            variant="outline"
            size="sm"
            disabled={isResolvingPlan}
            onClick={handleEditPlanClick}
            className="cursor-pointer gap-1 rounded-xl text-xs font-semibold text-primary hover:text-primary"
          >
            <MdEdit className="size-3.5" />
            {t("list.editPlan")}
          </Button>
        )}
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/ai/review/${item.id}`, {
              state: { planId: resolvedPlanId },
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
        key={planOpen ? (planEditMode ? "session-edit" : "session-view") : "closed"}
        domainId={item.domainId}
        planId={resolvedPlanId}
        editable={item.status === RecommendationStatus.Pending}
        initialEditMode={planEditMode}
        open={planOpen}
        onOpenChange={(nextOpen) => {
          setPlanOpen(nextOpen);
          if (!nextOpen) setPlanEditMode(false);
        }}
      />
    </>
  );
}