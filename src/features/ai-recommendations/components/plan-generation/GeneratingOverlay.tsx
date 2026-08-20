import { useTranslation } from "react-i18next";
import FullPageLoading from "@/components/feedbacks/FullPageLoading";

export default function GeneratingOverlay() {
  const { t } = useTranslation("aiPlan");

  return (
    <FullPageLoading>
      <div className="flex flex-col items-center gap-4 text-white">
        <div className="size-8 animate-spin rounded-full border-4 border-white/30 border-t-white" />
        <p className="text-sm font-medium">{t("generate.generating")}</p>
      </div>
    </FullPageLoading>
  );
}
