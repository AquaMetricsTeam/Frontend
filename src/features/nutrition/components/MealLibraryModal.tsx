import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSearch } from "react-icons/md";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useNutritionPlans } from "../hooks/useNutritionPlans";
import { MealType } from "../types/index";
import type { NutritionPlanMeal } from "../types/index";

interface MealLibraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (meal: Omit<NutritionPlanMeal, "id">) => void;
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

export function MealLibraryModal({
  open,
  onOpenChange,
  onSelect,
}: MealLibraryModalProps) {
  const { t } = useTranslation("nutrition");
  const [search, setSearch] = useState("");
  const [selectedMealType, setSelectedMealType] = useState<MealType | null>(null);

  // Fetch all nutrition plans (get all meals from library)
  const { data: plansResponse, isLoading } = useNutritionPlans(
    { pageSize: 100 },
    open
  );
  const allPlans = plansResponse?.data?.items ?? [];

  // Flatten all meals from all plans
  const allMeals = useMemo(() => {
    return allPlans.flatMap((plan) => plan.meals || []);
  }, [allPlans]);

  // Filter meals by search and meal type
  const filteredMeals = useMemo(() => {
    return allMeals.filter((meal) => {
      const matchesSearch = search
        ? meal.description.toLowerCase().includes(search.toLowerCase())
        : true;
      const matchesMealType = selectedMealType ? meal.mealType === selectedMealType : true;
      return matchesSearch && matchesMealType;
    });
  }, [allMeals, search, selectedMealType]);

  function handleSelectMeal(meal: NutritionPlanMeal) {
    const { id, ...mealData } = meal;
    onSelect(mealData);
    onOpenChange(false);
    setSearch("");
    setSelectedMealType(null);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle>{t("modal.mealLibrary.title")}</DialogTitle>
          <DialogDescription>
            {t("modal.mealLibrary.description")}
          </DialogDescription>
        </DialogHeader>

        {/* Content with scroll */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {/* Search Bar */}
          <div className="relative px-4 pt-4">
            <MdSearch className="absolute start-7 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder={t("modal.mealLibrary.searchPlaceholder")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ps-9"
            />
          </div>

          {/* Meal Type Filter */}
          <div className="px-4 space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("modal.mealLibrary.filterByType")}
            </p>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={selectedMealType === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedMealType(null)}
                className="text-xs"
              >
                {t("common:all")}
              </Button>
              {Object.values(MealType)
                .filter((val) => typeof val === "number")
                .map((mealType) => (
                  <Button
                    key={mealType}
                    variant={selectedMealType === mealType ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedMealType(mealType as MealType)}
                    className="text-xs"
                  >
                    {getMealTypeLabel(mealType as MealType)}
                  </Button>
                ))}
            </div>
          </div>

          {/* Meals List */}
          <div className="px-4 pb-4 space-y-2">
            {isLoading ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t("common:loading")}
              </div>
            ) : filteredMeals.length === 0 ? (
              <div className="text-center py-8 text-sm text-muted-foreground">
                {t("modal.mealLibrary.noMeals")}
              </div>
            ) : (
              filteredMeals.map((meal, idx) => (
                <button
                  key={`${meal.mealType}-${meal.description}-${idx}`}
                  onClick={() => handleSelectMeal(meal)}
                  className="w-full text-start p-3 rounded-lg border border-border hover:bg-accent hover:border-primary/50 transition-colors group"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      {/* Meal Type Badge */}
                      <div className="mb-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-xs",
                            getMealTypeColor(meal.mealType)
                          )}
                        >
                          {getMealTypeLabel(meal.mealType)}
                        </Badge>
                      </div>

                      {/* Description */}
                      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary">
                        {meal.description}
                      </p>

                      {/* Macros */}
                      <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">
                            {meal.calories}
                          </span>
                          kcal
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">
                            {meal.proteinGrams}
                          </span>
                          g protein
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">
                            {meal.carbGrams}
                          </span>
                          g carbs
                        </span>
                        <span className="flex items-center gap-1">
                          <span className="font-medium text-foreground">
                            {meal.fatGrams}
                          </span>
                          g fat
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <Button
                      size="sm"
                      variant="ghost"
                      className="shrink-0"
                    >
                      +
                    </Button>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
