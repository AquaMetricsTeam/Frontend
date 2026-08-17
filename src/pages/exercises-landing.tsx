import { useTranslation } from "react-i18next";
import PageWrapper from "@/components/layouts/PageWrapper";
import { ExerciseLandingPage } from "@/features/exercises/components/ExerciseLandingPage";

export default function ExercisesLandingPage() {
  const { t } = useTranslation("exercises");

  return (
    <PageWrapper>
      <div className="mb-8 flex items-center gap-3">
        <div>
          <h1
            className="text-2xl font-bold tracking-tight text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {t("exercises:page.title")}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            {t("exercises:page.landingDescription")}
          </p>
        </div>
      </div>

      <ExerciseLandingPage />
    </PageWrapper>
  );
}
