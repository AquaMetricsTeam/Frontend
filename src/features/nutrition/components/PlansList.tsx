import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  MdEdit,
  MdFileCopy,
  MdDelete,
  MdAssignmentInd,
  MdAdd,
  MdSchedule,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNutritionPlans } from "../hooks/useNutritionPlans";
import { MealType } from "../types/index";
import type { NutritionPlan } from "../types/index";

interface PlansListProps {
  search?: string;
  selectedPlanId?: string;
  onSelectPlan?: (plan: NutritionPlan | null) => void;
  onEditPlan?: (plan: NutritionPlan) => void;
  onDuplicatePlan?: (plan: NutritionPlan) => void;
  onDeletePlan?: (plan: NutritionPlan) => void;
  onAssignPlan?: (plan: NutritionPlan) => void;
  canEdit?: boolean;
}

const PAGE_SIZE = 50;

function getMealTypeLabel(mealType: MealType): string {
  const labels: Record<MealType, string> = {
    [MealType.Breakfast]: "Breakfast",
    [MealType.Lunch]: "Lunch",
    [MealType.Dinner]: "Dinner",
    [MealType.Snack]: "Snack",
    [MealType.PreWorkout]: "Pre-Workout",
    [MealType.PostWorkout]: "Post-Workout",
  };
  return labels[mealType] || "Unknown";
}

export function PlansList({
  search: searchProp,
  selectedPlanId,
  onSelectPlan,
  onEditPlan,
  onDuplicatePlan,
  onDeletePlan,
  onAssignPlan,
  canEdit = true,
}: PlansListProps) {
  const { t } = useTranslation("nutrition");
  const search = searchProp ?? "";

  // Fetch plans with pagination
  const { data: plansResponse, isLoading, isError, refetch } = useNutritionPlans({
    pageNumber: 1,
    pageSize: PAGE_SIZE,
    search: search || undefined,
  });

  const plans = plansResponse?.data?.items ?? [];

  // Filter locally by search for immediate feedback
  const filteredPlans = useMemo(() => {
    if (!search) return plans;
    return plans.filter((plan) =>
      plan.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [plans, search]);

  const getDailyCalories = (plan: NutritionPlan): number => {
    return plan.meals?.reduce((sum, meal) => sum + (meal.calories || 0), 0) ?? 0;
  };

  // Sync selectedPlan state with updated server data whenever plans query updates
  useMemo(() => {
    if (selectedPlanId) {
      const updatedPlan = filteredPlans.find((p) => String(p.id) === String(selectedPlanId));
      if (updatedPlan) {
        onSelectPlan?.(updatedPlan);
      }
    }
  }, [filteredPlans, selectedPlanId, onSelectPlan]);

  const formatLastEdited = (dateStr?: string): string => {
    if (!dateStr) return "Never";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return "Unknown";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4 p-4">
        <div className="h-10 bg-muted animate-pulse rounded-lg"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-32 bg-muted animate-pulse rounded-lg"></div>
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center py-8">
        <p className="text-destructive mb-4">{t("common:error.default")}</p>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          Retry
        </Button>
      </div>
    );
  }

  if (!isLoading && filteredPlans.length === 0 && !search) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {t("list.emptyState.title")}
          </h3>
          <p className="text-sm text-muted-foreground mb-6">
            {t("list.emptyState.description")}
          </p>
          <p className="text-xs text-muted-foreground">
            Use the "Create Plan" button above to get started.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Panel Header – count only */}
      <div className="px-5 pt-4 pb-3 border-b border-border flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Nutrition Plans</h2>
        <span className="text-xs text-muted-foreground">{filteredPlans.length} plans</span>
      </div>

      {/* Plans Flat List */}
      <div className="flex-1">
        {filteredPlans.length === 0 && search ? (
          <div className="text-center py-8 text-sm text-muted-foreground">
            {t("list.noResults.message")}
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const dailyCalories = getDailyCalories(plan);

            return (
              <div
                key={plan.id}
                onClick={() => onSelectPlan?.(plan)}
                className={[
                  "group relative cursor-pointer p-4 border-b border-border last:border-b-0 transition-colors",
                  isSelected
                    ? "bg-muted/80 border-s-2 border-s-primary"
                    : "border-s-2 border-s-transparent hover:bg-muted/40",
                ].join(" ")}
              >
                {/* Title Row */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-foreground truncate flex-1">
                    {plan.name}
                  </h3>
                </div>

                {/* Description */}
                <p className="text-xs text-muted-foreground line-clamp-1 mb-2">
                  {plan.objective || plan.name}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center text-[11px] text-muted-foreground mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MdSchedule className="size-3 shrink-0" />
                      <span className="whitespace-nowrap">{plan.schedule || "Weekly plan"}</span>
                    </span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="whitespace-nowrap">{plan.meals?.length ?? 0} meals</span>
                    <span className="text-muted-foreground/60">·</span>
                    <span className="whitespace-nowrap">{dailyCalories.toLocaleString()} kcal/day</span>
                  </div>
                  <span className="ms-auto whitespace-nowrap ps-2 text-[10px] text-muted-foreground">
                    Edited {formatLastEdited(plan.updatedAt)}
                  </span>
                </div>

                {/* Action Buttons */}
                {canEdit && (
                  <div className="flex items-center gap-3 pt-2 border-t border-border">
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onEditPlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <MdEdit className="w-3 h-3" />
                      {t("common:edit")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDuplicatePlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <MdFileCopy className="w-3 h-3" />
                      {t("list.duplicate")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onAssignPlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                    >
                      <MdAssignmentInd className="w-3 h-3" />
                      {t("list.assign")}
                    </button>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onDeletePlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-destructive hover:text-destructive/80 transition-colors ms-auto cursor-pointer"
                    >
                      <MdDelete className="w-3.5 h-3.5" />
                      {t("common:delete")}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function getMealTypeColor(mealType: MealType): string {
  const colors: Record<MealType, string> = {
    [MealType.Breakfast]: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/30",
    [MealType.Lunch]: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30",
    [MealType.Dinner]: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/30",
    [MealType.Snack]: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
    [MealType.PreWorkout]: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30",
    [MealType.PostWorkout]: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
  };
  return colors[mealType] || "bg-primary/10 text-primary border-primary/30";
}

// Plan Detail Panel Component
interface PlanDetailPanelProps {
  plan: NutritionPlan | null;
  onEditPlan?: (plan: NutritionPlan) => void;
  onDuplicatePlan?: (plan: NutritionPlan) => void;
  onAssignPlan?: (plan: NutritionPlan) => void;
  canEdit?: boolean;
}

export function PlanDetailPanel({
  plan,
  onEditPlan,
  onDuplicatePlan,
  onAssignPlan,
  canEdit = true,
  activeAssignments = 0,
}: PlanDetailPanelProps & { activeAssignments?: number }) {
  const { t } = useTranslation("nutrition");

  if (!plan) {
    return (
      <div className="flex items-center justify-center h-full text-center p-8">
        <div>
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <MdAssignmentInd className="size-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-foreground">Select a nutrition plan</h3>
          <p className="text-sm text-muted-foreground">
            Choose a plan from the list to view its details and meal breakdown.
          </p>
        </div>
      </div>
    );
  }

  const dailyTotals = plan.meals?.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.proteinGrams || 0),
      carbs: totals.carbs + (meal.carbGrams || 0),
      fat: totals.fat + (meal.fatGrams || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const sortedMeals = [...(plan.meals || [])].sort((a, b) => a.mealType - b.mealType);

  return (
    <div className="space-y-6 h-full overflow-y-auto">
      {/* Plan Header */}
      <div className="sticky top-0 bg-card border-b border-border pb-4 z-10">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-foreground mb-1">{plan.name}</h1>
            <p className="text-muted-foreground text-xs mb-2">
              {plan.objective || "Nutritional objective"}
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px] py-0 px-2 text-muted-foreground">
                <MdSchedule className="size-3 me-1" />
                {plan.schedule || "Weekly plan"}
              </Badge>
              {activeAssignments > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-full px-2 py-0 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20"
                >
                  • <span className="font-bold text-emerald-600 dark:text-emerald-400 me-0.5">{activeAssignments}</span> {activeAssignments === 1 ? "athlete assigned" : "athletes assigned"}
                </Badge>
              )}
            </div>
          </div>

          {canEdit && (
            <div className="flex gap-1.5 shrink-0">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDuplicatePlan?.(plan)}
                className="text-xs h-7 px-2.5 cursor-pointer"
              >
                <MdFileCopy className="size-3.5 me-1" />
                {t("list.duplicate")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEditPlan?.(plan)}
                className="text-xs h-7 px-2.5 cursor-pointer"
              >
                <MdEdit className="size-3.5 me-1" />
                {t("common:edit")}
              </Button>
              <Button
                size="sm"
                onClick={() => onAssignPlan?.(plan)}
                className="text-xs h-7 px-2.5 cursor-pointer"
              >
                <MdAdd className="size-3.5 me-0.5" />
                {t("list.assign")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Totals Box */}
      <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            DAILY TOTALS
          </h2>
          <span className="text-[10px] font-medium text-muted-foreground">
            {plan.meals?.length ?? 0} meals
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Calories — Primary Energy Metric */}
          <div className="rounded-lg bg-card border border-primary/20 p-3 flex flex-col justify-between">
            <div className="text-[10px] uppercase font-semibold text-primary/90 tracking-wide mb-1">
              CALORIES
            </div>
            <div className="text-base font-bold text-foreground/90 tabular-nums">
              {dailyTotals.calories.toLocaleString()} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">kcal</span>
            </div>
          </div>

          {/* Protein */}
          <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
              PROTEIN
            </div>
            <div className="text-sm font-semibold text-foreground/80 tabular-nums">
              {dailyTotals.protein} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
            </div>
          </div>

          {/* Carbs */}
          <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
              CARBS
            </div>
            <div className="text-sm font-semibold text-foreground/80 tabular-nums">
              {dailyTotals.carbs} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
            </div>
          </div>

          {/* Fat */}
          <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
              FAT
            </div>
            <div className="text-sm font-semibold text-foreground/80 tabular-nums">
              {dailyTotals.fat} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Meal List */}
      <div className="space-y-2.5">
        <h2 className="text-base font-semibold text-foreground">Meals</h2>
        {sortedMeals.length === 0 ? (
          <div className="text-center py-6 text-xs text-muted-foreground">
            No meals configured for this plan.
          </div>
        ) : (
          sortedMeals.map((meal, index) => (
            <div
              key={index}
              className="bg-muted/40 border border-border rounded-lg p-3 space-y-2"
            >
              {/* Top Row: Meal Type Badge & Macro/Calorie Summary */}
              <div className="flex items-center justify-between gap-3">
                <Badge
                  variant="outline"
                  className={`${getMealTypeColor(meal.mealType)} shrink-0 text-[10px] px-2 py-0.5 font-semibold`}
                >
                  {getMealTypeLabel(meal.mealType)}
                </Badge>
                <div className="text-xs text-muted-foreground text-end shrink-0 whitespace-nowrap">
                  <span className="font-bold text-foreground tabular-nums">{meal.calories} kcal</span>
                  <span className="mx-1.5 text-muted-foreground/40">·</span>
                  <span className="tabular-nums">P {meal.proteinGrams} g</span>
                  <span className="mx-1 text-muted-foreground/40">·</span>
                  <span className="tabular-nums">C {meal.carbGrams} g</span>
                  <span className="mx-1 text-muted-foreground/40">·</span>
                  <span className="tabular-nums">F {meal.fatGrams} g</span>
                </div>
              </div>

              {/* Middle Row: Meal Description / Name */}
              <p className="text-sm font-bold text-foreground leading-snug">
                {meal.description}
              </p>

              {/* Bottom Row: Dietary Notes (if present) */}
              {meal.dietaryNotes && (
                <div className="bg-background/80 border border-border rounded-md p-2 mt-2">
                  <p className="text-xs text-muted-foreground">
                    {meal.dietaryNotes}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
