import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { MdChevronRight, MdDescription, MdEdit } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { useRecommendation } from "../../hooks/useRecommendation";
import { AI_KEYS } from "../../constants/queryKeys";
import { RecommendationStatus } from "../../constants/enums";
import type { RecommendationListItem } from "../../types/index";
import ReviewActions from "./ReviewActions";
import ReviewResultBanner from "./ReviewResultBanner";
import MissingExerciseWarning from "./MissingExerciseWarning";
import EvidenceSources from "./EvidenceSources";
import RecommendationPlanSheet from "../plan-view/RecommendationPlanSheet";

function toNumericPlanId(value: unknown): number | null {
  const numeric = value == null ? NaN : Number(value);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function findCachedListPlanId(
  queryClient: ReturnType<typeof useQueryClient>,
  recommendationId: number,
): number | null {
  const snapshots = queryClient.getQueriesData<unknown>({
    queryKey: AI_KEYS.recommendations(),
  });
  for (const [, snapshot] of snapshots) {
    const items = (
      snapshot as { data?: { items?: RecommendationListItem[] } } | undefined
    )?.data?.items;
    if (!Array.isArray(items)) continue;
    const match = items.find((entry) => entry.id === recommendationId);
    const planId = toNumericPlanId(match?.planId);
    if (planId != null) return planId;
  }
  return null;
}

interface PlanReviewViewProps {
  recommendationId: number;
  missingExerciseNotes?: string | null;
  routePlanId?: number | null;
}

export default function PlanReviewView({
  recommendationId,
  missingExerciseNotes,
  routePlanId,
}: PlanReviewViewProps) {
  const { t } = useTranslation("aiPlan");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [reviewed, setReviewed] = useState(false);
  const [planSheetOpen, setPlanSheetOpen] = useState(false);
  const [planEditMode, setPlanEditMode] = useState(false);

  const query = useRecommendation(recommendationId);
  const rec = query.data?.data;

  if (query.isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-24 w-full" />
        <Skeleton className="h-16 w-full" />
      </div>
    );
  }

  if (query.isError || !rec) {
    return (
      <ErrorMessage
        onRetry={() => query.refetch()}
      />
    );
  }

  const isPending = rec.status === RecommendationStatus.Pending;
  const isApproved = rec.status === RecommendationStatus.Approved;
  const isRejected = rec.status === RecommendationStatus.Rejected;

  const statusConfig: Record<number, { label: string; className: string }> = {
    [RecommendationStatus.Pending]: {
      label: t("review.statusPending"),
      className: "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    [RecommendationStatus.Approved]: {
      label: t("review.statusApproved"),
      className: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    },
    [RecommendationStatus.Rejected]: {
      label: t("review.statusRejected"),
      className: "border-destructive/30 bg-destructive/15 text-destructive",
    },
  };

  const statusInfo = statusConfig[rec.status] ?? statusConfig[RecommendationStatus.Pending];

  // planId priority: detail payload (API) > cached list item > route state.
  // Normalized defensively: some payloads serialize ids as strings.
  const rawPlanId =
    rec.planId != null
      ? rec.planId
      : (findCachedListPlanId(queryClient, recommendationId) ?? routePlanId ?? null);
  const planId = toNumericPlanId(rawPlanId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t("review.title")}
          </h2>
          <Badge variant="outline" className={statusInfo.className}>
            {statusInfo.label}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/ai-recommendations")}
          className="cursor-pointer"
        >
          {t("review.backToInbox")}
        </Button>
      </div>

      {(isApproved || isRejected) && !reviewed && (
        <ReviewResultBanner status={rec.status as RecommendationStatus} />
      )}

      {reviewed && (
        <ReviewResultBanner status={rec.status as RecommendationStatus} />
      )}

      <div className="space-y-4">
        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("review.recommendation")}
          </h3>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {rec.recommendation}
            </p>
          </div>
        </div>

        <div>
          <h3 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {t("review.rationale")}
          </h3>
          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {rec.rationale}
            </p>
          </div>
        </div>
      </div>

      {planId != null && (
        <div className="flex items-center justify-between gap-3 rounded-lg border border-border bg-muted/30 p-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MdDescription className="size-5" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {t("review.generatedPlanTitle")}
              </p>
              <p className="text-xs text-muted-foreground">ID #{planId}</p>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {isPending && (
              <Button
                variant="outline"
                size="sm"
                disabled={planId == null}
                onClick={() => {
                  setPlanEditMode(true);
                  setPlanSheetOpen(true);
                }}
                className="cursor-pointer gap-1 rounded-xl text-xs font-semibold"
                title={planId == null ? t("review.noPlanAttached") : undefined}
              >
                <MdEdit className="size-3.5" />
                {t("review.editGeneratedPlan")}
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setPlanEditMode(false);
                setPlanSheetOpen(true);
              }}
              className="cursor-pointer gap-1 rounded-xl text-xs font-semibold"
            >
              {t("review.viewGeneratedPlan")}
              <MdChevronRight className="size-4 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      )}

      {rec.evidence.length > 0 && <EvidenceSources evidence={rec.evidence} />}

      {missingExerciseNotes && (
        <MissingExerciseWarning notes={missingExerciseNotes} />
      )}

      {isPending && !reviewed && (
        <ReviewActions
          recommendationId={recommendationId}
          athleteId={rec.athleteId}
          onReviewed={() => {
            setReviewed(true);
            query.refetch();
          }}
        />
      )}

      <RecommendationPlanSheet
        key={planSheetOpen ? (planEditMode ? "session-edit" : "session-view") : "closed"}
        domainId={rec.domainId}
        planId={planId}
        editable={isPending}
        initialEditMode={planEditMode}
        open={planSheetOpen}
        onOpenChange={(nextOpen) => {
          setPlanSheetOpen(nextOpen);
          if (!nextOpen) setPlanEditMode(false);
        }}
      />
    </div>
  );
}
