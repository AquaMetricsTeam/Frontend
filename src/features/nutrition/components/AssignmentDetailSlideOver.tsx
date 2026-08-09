import { useTranslation } from "react-i18next";
import { MdClose, MdCalendarToday, MdPerson, MdGroup } from "react-icons/md";
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
import type { NutritionPlanAssignment, NutritionPlan } from "../types/index";

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
      return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30";
    case "upcoming":
      return "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30";
    case "ended":
      return "bg-[#64748B]/10 text-[#64748B] border-[#64748B]/30";
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
    <Drawer open={open} onOpenChange={onOpenChange} direction="right" modal={true}>
      <DrawerContent className="w-full sm:max-w-2xl h-full">
        {/* Header */}
        <DrawerHeader className="relative flex flex-col items-start border-b border-border pb-3 pt-4 px-5">
          <div className="flex-1 pe-8 w-full">
            <h2 className="text-base font-bold text-white mb-0.5">
              {athleteName || assignment.athleteId}
            </h2>
            <p className="text-xs text-slate-400 font-medium">
              {plan?.name || assignment.nutritionPlanName || "Unknown Plan"} · {formatDateRange(assignment.startDate, assignment.endDate)}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <Badge
                variant="outline"
                className={`${getStatusColor(status)} text-[10px] font-semibold px-2 py-0 h-5`}
              >
                {t(`assignments.status.${status}`)}
              </Badge>
              
              {assignment.groupId ? (
                <Badge variant="outline" className="border-primary/30 text-primary bg-primary/10 text-[10px] font-semibold px-2 py-0 h-5">
                  assigned via {group?.name || "Group"}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-muted/50 text-muted-foreground bg-slate-800 text-[10px] font-semibold px-2 py-0 h-5">
                  individual
                </Badge>
              )}
            </div>

            <div className="mt-2.5 text-[10px] text-slate-500 font-normal">
              Assigned by Coach · {assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleDateString() : null}
            </div>
          </div>

          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 text-slate-400 hover:text-white"
          >
            <MdClose className="size-4" />
          </Button>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Plan Snapshot Panel */}
          <div className="space-y-3">
            {/* Daily Totals */}
            <div className="bg-[#1E293B] text-white p-4 rounded-lg border border-[#2A3B52]">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                  PLAN SNAPSHOT — DAILY TOTALS
                </h4>
                <span className="text-[10px] text-slate-400">
                  {plan?.meals?.length ?? 0} meals
                </span>
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-[9px] uppercase font-semibold text-slate-400 mb-0.5">CALORIES</div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {dailyTotals.calories.toLocaleString()} <span className="text-[10px] text-slate-500 font-normal">kcal</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-semibold text-slate-400 mb-0.5">PROTEIN</div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {dailyTotals.protein} <span className="text-[10px] text-slate-500 font-normal">g</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-semibold text-slate-400 mb-0.5">CARBS</div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {dailyTotals.carbs} <span className="text-[10px] text-slate-500 font-normal">g</span>
                  </div>
                </div>
                <div>
                  <div className="text-[9px] uppercase font-semibold text-slate-400 mb-0.5">FAT</div>
                  <div className="text-base font-bold text-white tabular-nums">
                    {dailyTotals.fat} <span className="text-[10px] text-slate-500 font-normal">g</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Meal List */}
            <div className="space-y-2.5">
              {sortedMeals.length > 0 && (
                sortedMeals.map((meal, index) => (
                  <div key={index} className="p-3 border border-border rounded-lg bg-card">
                    <div className="flex items-start gap-3">
                      <Badge
                        variant="outline"
                        className={`${getMealTypeColor(meal.mealType)} shrink-0 text-[10px] px-1.5 py-0`}
                      >
                        {getMealTypeLabel(meal.mealType)}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-slate-400 font-normal">
                            {meal.calories} kcal · P {meal.proteinGrams}g · C {meal.carbGrams}g · F {meal.fatGrams}g
                          </span>
                        </div>
                        <p className="text-sm text-[#F1F5F9] font-medium leading-relaxed">
                          {meal.description}
                        </p>
                      </div>
                    </div>
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
            className="text-xs h-8 border-slate-700 text-slate-300 hover:bg-slate-800"
          >
            Close
          </Button>
          <Button
            size="sm"
            onClick={() => {
              onViewFullPlan?.(String(assignment.nutritionPlanId));
              onOpenChange(false);
            }}
            className="text-xs h-8 bg-[#06B6D4] hover:bg-[#0891B2] text-white"
          >
            View full plan
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}