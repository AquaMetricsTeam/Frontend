import { useTranslation } from "react-i18next";
import PageWrapper from "@/components/layouts/PageWrapper";
import GeneratePlanContainer from "@/features/ai-recommendations/components/plan-generation/GeneratePlanContainer";

export default function AiGeneratePlanPage() {
  const { t } = useTranslation("aiPlan");

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">
          {t("generate.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("generate.description")}
        </p>
      </div>

      <GeneratePlanContainer />
    </PageWrapper>
  );
}
