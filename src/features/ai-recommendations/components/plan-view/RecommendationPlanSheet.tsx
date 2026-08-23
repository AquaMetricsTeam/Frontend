import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdEdit, MdRestaurant } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import Loading from "@/components/feedbacks/Loading";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import { PlanDetailPanel } from "@/features/nutrition/components/PlansList";
import { useNutritionPlan } from "@/features/nutrition/hooks/useNutritionPlan";
import { useUpdateNutritionPlan } from "@/features/nutrition/hooks/useUpdateNutritionPlan";
import { PlanWizardSlideOver } from "@/features/nutrition/components/PlanWizardSlideOver";
import type {
  MealType,
  NutritionPlan,
  NutritionPlanFormValues,
} from "@/features/nutrition/types/index";
import { TemplateDetailSheet } from "@/features/training-plans/components/templates/TemplateDetailSheet";
import { EditTemplateSheet } from "@/features/training-plans/components/templates/EditTemplateSheet";
import type { TrainingPlan } from "@/features/training-plans/types/index";
import { DomainId } from "../../constants/enums";

interface RecommendationPlanSheetProps {
  domainId: number;
  planId?: number | null;
  /** When false, all Edit affordances are hidden (e.g. Rejected recommendations). */
  editable?: boolean;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function toNutritionFormValues(plan: NutritionPlan): NutritionPlanFormValues {
  return {
    id: String(plan.id),
    name: plan.name,
    objective: plan.objective || "",
    schedule: plan.schedule || "",
    targetCalories: 0,
    meals: (plan.meals || []).map((m) => ({
      id: m.id != null ? String(m.id) : undefined,
      mealType: Number(m.mealType) as MealType,
      description: m.description ?? "",
      calories: m.calories != null ? Number(m.calories) : 0,
      proteinGrams: m.proteinGrams != null ? Number(m.proteinGrams) : 0,
      carbGrams: m.carbGrams != null ? Number(m.carbGrams) : 0,
      fatGrams: m.fatGrams != null ? Number(m.fatGrams) : 0,
      dietaryNotes: m.dietaryNotes ?? "",
    })),
  };
}

export default function RecommendationPlanSheet({
  domainId,
  planId,
  editable = true,
  open,
  onOpenChange,
}: RecommendationPlanSheetProps) {
  const { t } = useTranslation("common");
  const [trainingEditPlan, setTrainingEditPlan] = useState<TrainingPlan | null>(null);
  const [wizardOpen, setWizardOpen] = useState(false);

  const isNutrition = domainId === DomainId.Nutrition;
  const hasPlan = typeof planId === "number" && planId > 0;

  const trainingStub = useMemo(
    () => ({ id: planId ?? 0 }) as TrainingPlan,
    [planId],
  );

  const nutritionQuery = useNutritionPlan(
    planId != null ? String(planId) : "",
    open && isNutrition,
  );
  const nutritionPlan = nutritionQuery.data?.data ?? null;

  const nutritionFormInitial = useMemo(
    () => (nutritionPlan ? toNutritionFormValues(nutritionPlan) : null),
    [nutritionPlan],
  );

  const closeEditorAndReopenView = useCallback(() => {
    setWizardOpen(false);
    onOpenChange(true);
  }, [onOpenChange]);

  const { mutate: updateNutritionPlan, isPending: isUpdating } =
    useUpdateNutritionPlan(closeEditorAndReopenView);

  if (!hasPlan) return null;

  // Training: TemplateDetailSheet closes itself, then hands the fetched plan to onEdit
  const handleTrainingEdit = (plan: TrainingPlan) => setTrainingEditPlan(plan);

  const handleTrainingEditClose = (nextOpen: boolean) => {
    if (!nextOpen) {
      setTrainingEditPlan(null);
      onOpenChange(true);
    }
  };

  // Nutrition: swap the plan sheet for the edit wizard
  const handleNutritionEdit = () => {
    onOpenChange(false);
    setWizardOpen(true);
  };

  const handleWizardOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) closeEditorAndReopenView();
  };

  const handleWizardSubmit = (values: NutritionPlanFormValues) => {
    if (!nutritionPlan) return;
    updateNutritionPlan({
      id: String(nutritionPlan.id),
      name: values.name,
      objective: values.objective || "",
      schedule: values.schedule || "",
      meals: (values.meals || []).map((m) => ({
        id: m.id,
        mealType: Number(m.mealType) as MealType,
        description: m.description || "",
        calories: Number(m.calories) || 0,
        proteinGrams: Number(m.proteinGrams) || 0,
        carbGrams: Number(m.carbGrams) || 0,
        fatGrams: Number(m.fatGrams) || 0,
        dietaryNotes: m.dietaryNotes || "",
      })),
    });
  };

  if (isNutrition) {
    return (
      <>
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent className="w-full sm:max-w-xl flex flex-col gap-0 p-0 overflow-hidden">
            <SheetHeader className="px-6 pt-6 pb-4 border-b border-border bg-card/60">
              <div className="flex items-start justify-between gap-3 pe-8">
                <div className="flex items-center gap-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                    <MdRestaurant className="size-5" />
                  </div>
                  <div>
                    <SheetTitle className="text-lg font-bold text-foreground">
                      {nutritionPlan?.name ?? `#${planId}`}
                    </SheetTitle>
                    <span className="text-xs text-muted-foreground">
                      ID #{planId}
                    </span>
                  </div>
                </div>
              </div>

              {nutritionPlan?.objective && (
                <SheetDescription className="mt-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/60 leading-relaxed text-start">
                  {nutritionPlan.objective}
                </SheetDescription>
              )}
            </SheetHeader>

            <div className="flex-1 overflow-y-auto px-6 py-5">
              {nutritionQuery.isLoading ? (
                <Loading label={t("loading")} className="py-16" />
              ) : nutritionQuery.isError ? (
                <ErrorMessage onRetry={() => nutritionQuery.refetch()} />
              ) : nutritionPlan ? (
                <PlanDetailPanel plan={nutritionPlan} canEdit={false} />
              ) : null}
            </div>

            <div className="px-6 py-4 border-t border-border bg-card/60 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="cursor-pointer"
              >
                {t("close")}
              </Button>
              {editable && (
                <Button
                  type="button"
                  size="sm"
                  className="gap-1.5 cursor-pointer"
                  disabled={!nutritionPlan}
                  onClick={handleNutritionEdit}
                >
                  <MdEdit className="size-4" />
                  {t("edit")}
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>

        <PlanWizardSlideOver
          open={wizardOpen}
          onOpenChange={handleWizardOpenChange}
          initialPlan={nutritionFormInitial}
          isLoading={isUpdating}
          onSubmit={handleWizardSubmit}
        />
      </>
    );
  }

  return (
    <>
      <TemplateDetailSheet
        plan={trainingStub}
        open={open}
        onOpenChange={onOpenChange}
        onEdit={editable ? handleTrainingEdit : undefined}
      />
      <EditTemplateSheet
        plan={trainingEditPlan}
        open={trainingEditPlan !== null}
        onOpenChange={handleTrainingEditClose}
      />
    </>
  );
}
