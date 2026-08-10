import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdFitnessCenter } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import WithPagination from "@/components/HOCs/WithPagination";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/common/SearchInput";
import Box from "@/components/layouts/Box";
import { useExercises } from "@/features/exercises/hooks/useExercises";
import { useExerciseFilters } from "@/features/exercises/hooks/useExerciseFilters";
import { ExercisesTable } from "@/features/exercises/components/ExercisesTable";
import { CreateExerciseModal } from "@/features/exercises/components/CreateExerciseModal";

export default function ExercisesPage() {
  const { t } = useTranslation("exercises");
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { localSearch, setLocalSearch, debouncedSearch, page } =
    useExerciseFilters();

  const { data, isLoading, isError, refetch } = useExercises({
    page,
    pageSize: 15,
    search: debouncedSearch,
  });

  const exercisesResponse = data?.data;
  const exercises = exercisesResponse?.items ?? [];
  const totalCount = exercisesResponse?.totalCount ?? 0;
  const totalPages = exercisesResponse?.totalPages ?? 1;

  return (
    <PageWrapper>
      {/* Page Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-secondary/20">
              <MdFitnessCenter className="size-5 text-secondary-foreground" />
            </div>
            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {t("exercises:page.title")}
            </h1>
            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {t(
                totalCount === 1
                  ? "exercises:page.exerciseCount"
                  : "exercises:page.exerciseCount_plural",
                { count: totalCount },
              )}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ms-12">
            {t("exercises:page.description")}
          </p>
        </div>
      </div>

      <Box>
        {/* Controls Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <SearchInput
            value={localSearch}
            onChange={setLocalSearch}
            placeholder={t("exercises:search.placeholder")}
            className="sm:max-w-xs"
          />

          <Button
            size="sm"
            className="h-9 rounded-lg gap-1.5 self-start lg:self-auto cursor-pointer"
            onClick={() => setIsCreateOpen(true)}
          >
            <MdAdd className="size-4" />
            {t("exercises:page.createButton")}
          </Button>
        </div>

        {/* Table */}
        <WithPagination pageCount={totalPages}>
          <ExercisesTable
            exercises={exercises}
            isLoading={isLoading}
            isError={isError}
            onRetry={refetch}
          />
        </WithPagination>
      </Box>

      <CreateExerciseModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
    </PageWrapper>
  );
}
