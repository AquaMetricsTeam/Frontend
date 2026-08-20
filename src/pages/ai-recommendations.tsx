import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import { Button } from "@/components/ui/button";
import RecommendationFilters from "@/features/ai-recommendations/components/inbox/RecommendationFilters";
import RecommendationListView from "@/features/ai-recommendations/components/inbox/RecommendationListView";

export default function AiRecommendationsPage() {
  const { t } = useTranslation("aiInbox");
  const navigate = useNavigate();

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">
          {t("page.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("page.description")}
        </p>
      </div>

      <Box>
        <div className="mb-4 flex items-center justify-between">
          <RecommendationFilters />
          <Button
            onClick={() => navigate("/ai-generate")}
            className="cursor-pointer"
          >
            {t("page.generateNew")}
          </Button>
        </div>

        <RecommendationListView />
      </Box>
    </PageWrapper>
  );
}
