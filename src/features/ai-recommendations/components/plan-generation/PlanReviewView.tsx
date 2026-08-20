import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { useRecommendation } from "../../hooks/useRecommendation";
import { RecommendationStatus } from "../../constants/enums";
import ReviewActions from "./ReviewActions";
import ReviewResultBanner from "./ReviewResultBanner";
import MissingExerciseWarning from "./MissingExerciseWarning";
import EvidenceSources from "./EvidenceSources";

interface PlanReviewViewProps {
  recommendationId: number;
  missingExerciseNotes?: string | null;
}

export default function PlanReviewView({ recommendationId, missingExerciseNotes }: PlanReviewViewProps) {
  const { t } = useTranslation("aiPlan");
  const navigate = useNavigate();
  const [reviewed, setReviewed] = useState(false);

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
    </div>
  );
}
