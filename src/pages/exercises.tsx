import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { MdAdd } from "react-icons/md";
import { ArrowLeft } from "lucide-react";
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
import { MuscleGroup, SwimmingExerciseCategory } from "@/features/exercises/types/index";
import { MUSCLE_GROUP_META } from "@/features/exercises/constants/muscleGroups";
import { SWIMMING_CATEGORY_META } from "@/features/exercises/constants/swimmingCategories";

function resolveFilter(type: string | undefined, value: string | undefined) {
  if (type === "muscle" && value) {
    const num = Number(value) as MuscleGroup;
    const meta = MUSCLE_GROUP_META[num];
    return { muscleGroup: num, categoryLabel: meta?.label, colorVar: meta?.colorVar, Icon: meta?.Icon };
  }
  if (type === "category" && value) {
    const num = Number(value) as SwimmingExerciseCategory;
    const meta = SWIMMING_CATEGORY_META[num];
    return { category: num, categoryLabel: meta?.label, colorVar: meta?.colorVar, Icon: meta?.Icon };
  }
  return {};
}

export default function ExercisesPage() {
  const { t } = useTranslation("exercises");
  const { type, value } = useParams<{ type: string; value: string }>();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { localSearch, setLocalSearch, debouncedSearch, page } = useExerciseFilters();

  const filter = resolveFilter(type, value);

  const { data, isLoading, isError, refetch } = useExercises({
    page,
    pageSize: 15,
    search: debouncedSearch,
    muscleGroup: filter.muscleGroup,
    category: filter.category,
  });

  const exercisesResponse = data?.data;
  const exercises = exercisesResponse?.items ?? [];
  const totalCount = exercisesResponse?.totalCount ?? 0;
  const totalPages = exercisesResponse?.totalPages ?? 1;

  const CategoryIcon = filter.Icon;

  return (
    <PageWrapper>
      {/* Header */}
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2.5">
            <Link
              to="/exercises"
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Back to exercises"
            >
              <ArrowLeft className="size-4" />
            </Link>

            {CategoryIcon && filter.colorVar && (
              <span
                className="flex size-9 items-center justify-center rounded-xl"
                style={{ background: `color-mix(in oklch, ${filter.colorVar} 15%, transparent)` }}
              >
                <CategoryIcon
                  className="size-5"
                  style={{ color: filter.colorVar }}
                  strokeWidth={1.75}
                />
              </span>
            )}

            <h1
              className="text-2xl font-bold tracking-tight text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {filter.categoryLabel ?? t("exercises:page.title")}
            </h1>

            <Badge
              variant="secondary"
              className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
            >
              {totalCount === 1
                ? t("exercises:page.exerciseCount", { count: totalCount })
                : t("exercises:page.exerciseCount_plural", { count: totalCount })}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-muted-foreground ms-[4.5rem]">
            {t("exercises:page.description")}
          </p>
        </div>
      </div>

      <Box>
        {/* Controls */}
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

      <CreateExerciseModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        defaultMuscleGroup={filter.muscleGroup}
        defaultCategory={filter.category}
      />
    </PageWrapper>
  );
}
