import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import { Button } from "@/components/ui/button";
import { ExerciseLandingPage } from "@/features/exercises/components/ExerciseLandingPage";
import { CreateExerciseModal } from "@/features/exercises/components/CreateExerciseModal";

export default function ExercisesLandingPage() {
  const { t } = useTranslation("exercises");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
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

        <Button
          size="sm"
          className="h-9 rounded-lg gap-1.5 self-start sm:self-auto cursor-pointer"
          onClick={() => setIsCreateOpen(true)}
        >
          <MdAdd className="size-4" />
          {t("exercises:page.createButton")}
        </Button>
      </div>

      <ExerciseLandingPage />

      <CreateExerciseModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </PageWrapper>
  );
}
