import { useTranslation } from "react-i18next";
import { MdClose } from "react-icons/md";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { useGroupsLookup } from "@/features/lookups/hooks/useGroupsLookup";
import { useNutritionPlan } from "../hooks/useNutritionPlan";
import { MealType } from "../types/index";
import type { NutritionPlanAssignment } from "../types/index";

interface AssignmentDetailSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  assignment: NutritionPlanAssignment | null;
  onViewFullPlan?: (planId: string) => void;
}

type AssignmentStatus = "active" | "upcoming" | "ended";

function getAssignmentStatus(assignment: NutritionPlanAssignment): AssignmentStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(assignment.startDate);
  startDate.setHours(0, 0, 0, 0);

  if (today < startDate) return "upcoming";
  if (!assignment.endDate) return "active";

  const endDate = new Date(assignment.endDate);
  endDate.setHours(0, 0, 0, 0);

  return today > endDate ? "ended" : "active";
}

function getStatusColor(status: AssignmentStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "upcoming":
      return "bg-primary/10 text-primary border-primary/20";
    case "ended":
      return "bg-muted text-muted-foreground border-border";
  }
}

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

function formatDateRange(startDate: string, endDate: string | null): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = new Date(startDate);
  if (!endDate) return `${fmt(start)} – ongoing`;
  return `${fmt(start)} – ${fmt(new Date(endDate))}`;
}

export function AssignmentDetailSlideOver({
  open,
  onOpenChange,
  assignment,
  onViewFullPlan,
}: AssignmentDetailSlideOverProps) {
  const { t } = useTranslation("nutrition");

  const { data: athletesRes } = useAthletesLookup();
  const { data: groupsRes } = useGroupsLookup();
  const { data: planRes } = useNutritionPlan(
    String(assignment?.nutritionPlanId),
    !!assignment?.nutritionPlanId
  );

  if (!assignment) return null;

  const athleteName = assignment.athleteId 
    ? ((assignment as any).athleteName || athletesRes?.data?.find(a => a.athleteId === assignment.athleteId)?.fullName)
    : undefined;
  
  const plan = planRes?.data;
  const group = assignment.groupId != null ? groupsRes?.data?.find(g => g.id === assignment.groupId) : null;
  const status = getAssignmentStatus(assignment);

  // Calculate daily totals
  const dailyTotals = plan?.meals?.reduce(
    (totals, meal) => ({
      calories: totals.calories + (meal.calories || 0),
      protein: totals.protein + (meal.proteinGrams || 0),
      carbs: totals.carbs + (meal.carbGrams || 0),
      fat: totals.fat + (meal.fatGrams || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  ) ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };

  const sortedMeals = [...(plan?.meals || [])].sort((a, b) => a.mealType - b.mealType);

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="end" modal={true}>
      <DrawerContent className="w-full sm:max-w-2xl h-full">
        {/* Header */}
        <DrawerHeader className="relative flex flex-col items-start border-b border-border pb-4 pt-4 px-5">
          <div className="flex-1 pe-8 w-full space-y-2">
            <h2 className="text-base font-bold text-foreground leading-snug">
              {athleteName || assignment.athleteId}
            </h2>

            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground/80">
                {plan?.name || assignment.nutritionPlanName || "Unknown Plan"}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatDateRange(assignment.startDate, assignment.endDate)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              <Badge
                variant="outline"
                className={`${getStatusColor(status)} text-[10px] font-semibold px-2 py-0 h-5`}
              >
                {t(`assignments.status.${status}`)}
              </Badge>

              {assignment.groupId ? (
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px] font-semibold px-2 py-0 h-5">
                  via {group?.name || "Group"}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-border text-muted-foreground bg-muted text-[10px] font-semibold px-2 py-0 h-5">
                  {t("assignmentDetail.individual", { defaultValue: "Individual" })}
                </Badge>
              )}
            </div>

            {assignment.assignedAt && (
              <p className="text-[10px] text-muted-foreground/70">
                {t("assignmentDetail.assignedByCoach", {
                  date: new Date(assignment.assignedAt).toLocaleDateString(),
                  defaultValue: `Assigned by Coach · ${new Date(assignment.assignedAt).toLocaleDateString()}`,
                })}
              </p>
            )}
          </div>

          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 end-4 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <MdClose className="size-4" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Plan Snapshot Panel */}
          <div className="space-y-3">
            {/* Daily Totals — matches PlansList card grid */}
            <div className="bg-muted/40 border border-border rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                  {t("assignmentDetail.planSnapshot", {
                    defaultValue: "PLAN SNAPSHOT — DAILY TOTALS",
                  })}
                </h4>
                <span className="text-[10px] font-medium text-muted-foreground">
                  {t("assignmentDetail.meals", {
                    count: plan?.meals?.length ?? 0,
                    defaultValue: `${plan?.meals?.length ?? 0} meals`,
                  })}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Calories — Primary Energy Metric */}
                <div className="rounded-lg bg-card border border-primary/20 p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-semibold text-primary/90 tracking-wide mb-1">
                    {t("macro.calories", { defaultValue: "CALORIES" })}
                  </div>
                  <div className="text-base font-bold text-foreground/90 tabular-nums">
                    {dailyTotals.calories.toLocaleString()} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">kcal</span>
                  </div>
                </div>

                {/* Protein */}
                <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
                    {t("macro.protein", { defaultValue: "PROTEIN" })}
                  </div>
                  <div className="text-sm font-semibold text-foreground/80 tabular-nums">
                    {dailyTotals.protein} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
                  </div>
                </div>

                {/* Carbs */}
                <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
                    {t("macro.carbs", { defaultValue: "CARBS" })}
                  </div>
                  <div className="text-sm font-semibold text-foreground/80 tabular-nums">
                    {dailyTotals.carbs} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
                  </div>
                </div>

                {/* Fat */}
                <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
                  <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
                    {t("macro.fat", { defaultValue: "FAT" })}
                  </div>
                  <div className="text-sm font-semibold text-foreground/80 tabular-nums">
                    {dailyTotals.fat} <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal List */}
            <div className="space-y-2.5">
              {sortedMeals.length > 0 && (
                sortedMeals.map((meal, index) => (
                  <div key={index} className="bg-muted/40 border border-border rounded-lg p-3 space-y-2">
                    {/* Top Row: Badge + Calories primary, P/C/F secondary */}
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

                    {/* Meal Name */}
                    <p className="text-sm font-bold text-foreground leading-snug">
                      {meal.description}
                    </p>

                    {/* Dietary Notes */}
                    {meal.dietaryNotes && (
                      <div className="bg-background/80 border border-border rounded-md p-2">
                        <p className="text-xs text-muted-foreground">{meal.dietaryNotes}</p>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <DrawerFooter className="border-t border-border flex-row justify-between gap-3 py-3 px-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="text-xs h-8 cursor-pointer"
          >
            {t("assignmentDetail.close", { defaultValue: "Close" })}
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onViewFullPlan?.(String(assignment.nutritionPlanId));
              onOpenChange(false);
            }}
            className="text-xs h-8 cursor-pointer"
          >
            {t("assignmentDetail.viewFullPlan", { defaultValue: "View full plan" })}
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}