import { useTranslation } from "react-i18next";
import { MdCheckCircle, MdCancel } from "react-icons/md";
import { RecommendationStatus } from "../../constants/enums";

interface ReviewResultBannerProps {
  status: RecommendationStatus;
}

export default function ReviewResultBanner({ status }: ReviewResultBannerProps) {
  const { t } = useTranslation("aiPlan");

  if (status === RecommendationStatus.Approved) {
    return (
      <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-4">
        <div className="flex gap-3">
          <MdCheckCircle className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
            {t("review.resultApproved")}
          </p>
        </div>
      </div>
    );
  }

  if (status === RecommendationStatus.Rejected) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4">
        <div className="flex gap-3">
          <MdCancel className="mt-0.5 size-5 shrink-0 text-destructive" />
          <p className="text-sm font-medium text-destructive">
            {t("review.resultRejected")}
          </p>
        </div>
      </div>
    );
  }

  return null;
}
