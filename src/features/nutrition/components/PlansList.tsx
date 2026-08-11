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
import { useAllPlanAssignments } from "../hooks/usePlanAssignments";
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

  // Fetch assignments for all filtered plans to calculate real assignment count
  const allAssignmentsQueries = useAllPlanAssignments(
    filteredPlans.map((p) => p.id),
    { pageSize: 100 },
    filteredPlans.length > 0
  );

  const planAssignmentsMap = useMemo(() => {
    const map = new Map<string, number>();
    filteredPlans.forEach((plan, index) => {
      const query = allAssignmentsQueries[index];
      if (query && query.data?.data) {
        const assignmentsList = query.data.data;
        // Count unique athletes assigned to this plan
        const uniqueAthletes = new Set(
          assignmentsList
            .map((a) => a.athleteId)
            .filter((id): id is string => !!id)
        );
        map.set(String(plan.id), uniqueAthletes.size);
      } else {
        map.set(String(plan.id), 0);
      }
    });
    return map;
  }, [filteredPlans, allAssignmentsQueries]);

  const getActiveAssignmentsCount = (planId: string): number => {
    return planAssignmentsMap.get(String(planId)) ?? 0;
  };

  // Attach assignments count to the filteredPlans so that when selected, the parent state carries this info
  useMemo(() => {
    filteredPlans.forEach((plan) => {
      (plan as any)._activeAssignmentsCount = getActiveAssignmentsCount(String(plan.id));
    });
  }, [filteredPlans, planAssignmentsMap]);

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
      <div className="space-y-4">
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
      <div className="px-5 pt-4 pb-3 border-b border-slate-800 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-slate-300">Nutrition Plans</h2>
        <span className="text-xs text-slate-500">{filteredPlans.length} plans</span>
      </div>

      {/* Plans Flat List */}
      <div className="flex-1">
        {filteredPlans.length === 0 && search ? (
          <div className="text-center py-8 text-sm text-slate-500">
            {t("list.noResults.message")}
          </div>
        ) : (
          filteredPlans.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            const dailyCalories = getDailyCalories(plan);
            const activeAssignments = getActiveAssignmentsCount(String(plan.id));

            return (
              <div
                key={plan.id}
                onClick={() => onSelectPlan?.(plan)}
                className={[
                  "group relative cursor-pointer p-4 border-b border-slate-800/80 last:border-b-0 transition-colors",
                  isSelected
                    ? "bg-slate-800/60 border-l-2 border-l-[#06B6D4]"
                    : "border-l-2 border-l-transparent hover:bg-slate-800/40",
                ].join(" ")}
              >
                {/* Title Row */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white truncate flex-1">
                    {plan.name}
                  </h3>
                  {activeAssignments > 0 && (
                    <span className="shrink-0 inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
                      • {activeAssignments} assigned
                    </span>
                  )}
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 line-clamp-1 mb-2">
                  {(plan as any).objective || plan.name}
                </p>

                {/* Metadata Row */}
                <div className="flex items-center text-[11px] text-slate-400 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <MdSchedule className="size-3 shrink-0" />
                      <span className="whitespace-nowrap">{(plan as any).schedule || "Weekly plan"}</span>
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="whitespace-nowrap">{plan.meals?.length ?? 0} meals</span>
                    <span className="text-slate-600">·</span>
                    <span className="whitespace-nowrap">{dailyCalories.toLocaleString()} kcal/day</span>
                  </div>
                  <span className="ml-auto whitespace-nowrap pl-2 text-[10px] text-slate-500">
                    Edited {formatLastEdited(plan.updatedAt)}
                  </span>
                </div>

                {/* Action Buttons */}
                {canEdit && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                    <button
                      onClick={(e) => { e.stopPropagation(); onEditPlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <MdEdit className="w-3 h-3" />
                      {t("common:edit")}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDuplicatePlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <MdFileCopy className="w-3 h-3" />
                      {t("list.duplicate")}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onAssignPlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      <MdAssignmentInd className="w-3 h-3" />
                      {t("list.assign")}
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); onDeletePlan?.(plan); }}
                      className="flex items-center gap-1 text-[11px] text-red-400 hover:text-red-300 transition-colors ml-auto"
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
          <h3 className="text-lg font-semibold mb-2">Select a nutrition plan</h3>
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
      <div className="sticky top-0 bg-[#111827] border-b border-slate-800 pb-4 z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h1 className="text-lg font-bold text-[#F1F5F9] mb-1">{plan.name}</h1>
            <p className="text-slate-400 text-xs mb-2">
              {plan.objective || "Nutritional objective"}
            </p>
            <Badge variant="outline" className="text-[10px] py-0 px-2 border-slate-600 text-slate-300">
              <MdSchedule className="size-3 me-1" />
              {plan.schedule || "Weekly plan"}
            </Badge>
          </div>

          {canEdit && (
            <div className="flex gap-1.5">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onDuplicatePlan?.(plan)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs h-7 px-2.5"
              >
                <MdFileCopy className="size-3.5 mr-1" />
                {t("list.duplicate")}
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => onEditPlan?.(plan)}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 text-xs h-7 px-2.5"
              >
                <MdEdit className="size-3.5 mr-1" />
                {t("common:edit")}
              </Button>
              <Button 
                size="sm" 
                onClick={() => onAssignPlan?.(plan)}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white text-xs h-7 px-2.5"
              >
                <MdAdd className="size-3.5 mr-0.5" />
                {t("list.assign")}
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Daily Totals Box */}
      <div className="bg-[#1E293B] border border-[#2A3B52] rounded-lg p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            DAILY TOTALS
          </h2>
          <span className="text-[10px] text-slate-400">
            {plan.meals?.length ?? 0} meals
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-lg font-bold text-white tabular-nums mb-0.5">
              {dailyTotals.calories.toLocaleString()}
            </div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">CALORIES</div>
            <div className="text-[10px] text-slate-500 font-normal">kcal</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white tabular-nums mb-0.5">
              {dailyTotals.protein}
            </div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">PROTEIN</div>
            <div className="text-[10px] text-slate-500 font-normal">g</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white tabular-nums mb-0.5">
              {dailyTotals.carbs}
            </div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">CARBS</div>
            <div className="text-[10px] text-slate-500 font-normal">g</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-white tabular-nums mb-0.5">
              {dailyTotals.fat}
            </div>
            <div className="text-[9px] uppercase font-semibold text-slate-400">FAT</div>
            <div className="text-[10px] text-slate-500 font-normal">g</div>
          </div>
        </div>
      </div>

      {/* Currently Assigned Indicator */}
      {activeAssignments > 0 && (
        <p className="text-sm text-slate-400 -mt-2">
          Currently assigned to <span className="font-semibold text-slate-300">{activeAssignments}</span> athletes.
        </p>
      )}

      {/* Meal List */}
      <div className="space-y-2.5">
        <h2 className="text-base font-semibold text-[#F1F5F9]">Meals</h2>
        {sortedMeals.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-500">
            No meals configured for this plan.
          </div>
        ) : (
          sortedMeals.map((meal, index) => (
            <div 
              key={index} 
              className="bg-[#1E293B] border border-[#2A3B52] rounded-lg p-3"
            >
              {/* Top Row: Meal Type Chip & Macro Summary */}
              <div className="flex items-start justify-between mb-2">
                <Badge
                  variant="outline"
                  className="bg-transparent text-[#38BDF8] border-[#38BDF8] shrink-0 text-[10px] px-1.5 py-0"
                >
                  {getMealTypeLabel(meal.mealType)}
                </Badge>
                <span className="text-xs text-slate-400 ml-3">
                  {meal.calories} kcal · P {meal.proteinGrams}g · C {meal.carbGrams}g · F {meal.fatGrams}g
                </span>
              </div>

              {/* Middle Row: Meal Description */}
              <p className="text-sm font-semibold text-[#F1F5F9] mb-1">
                {meal.description}
              </p>

              {/* Bottom Row: Dietary Notes (if present) */}
              {meal.dietaryNotes && (
                <div className="bg-slate-800/50 border border-slate-700/50 rounded p-2 mt-2">
                  <p className="text-xs text-slate-400">
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
