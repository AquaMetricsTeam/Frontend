import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RecommendationDecision } from "../../constants/enums";
import { reviewRecommendationSchema } from "../../constants/validations";
import { useReviewRecommendation } from "../../hooks/useReviewRecommendation";

interface ReviewActionsProps {
  recommendationId: number;
  athleteId: string;
  onReviewed: () => void;
}

export default function ReviewActions({
  recommendationId,
  athleteId,
  onReviewed,
}: ReviewActionsProps) {
  const { t } = useTranslation("aiPlan");
  const [comments, setComments] = useState("");
  const [decision, setDecision] = useState<number | null>(null);

  const reviewMutation = useReviewRecommendation(recommendationId, athleteId, () => {
    onReviewed();
  });

  const handleDecision = (d: number) => {
    const result = reviewRecommendationSchema.safeParse({
      decision: d,
      comments: comments.trim() || undefined,
    });
    if (!result.success) return;
    setDecision(d);
    reviewMutation.mutate(result.data);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-1.5">
        <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
          {t("review.commentsLabel")}
        </Label>
        <Textarea
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          placeholder={t("review.commentsPlaceholder")}
          rows={3}
          disabled={reviewMutation.isPending}
          className="text-sm"
        />
      </div>

      <div className="flex gap-3">
        <Button
          onClick={() => handleDecision(RecommendationDecision.Approved)}
          disabled={reviewMutation.isPending}
          className="cursor-pointer"
        >
          {reviewMutation.isPending && decision === RecommendationDecision.Approved
            ? t("review.approving")
            : t("review.approve")}
        </Button>
        <Button
          variant="outline"
          onClick={() => handleDecision(RecommendationDecision.Rejected)}
          disabled={reviewMutation.isPending}
          className="cursor-pointer"
        >
          {reviewMutation.isPending && decision === RecommendationDecision.Rejected
            ? t("review.rejecting")
            : t("review.reject")}
        </Button>
      </div>
    </div>
  );
}
