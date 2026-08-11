import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose, MdChevronLeft, MdLibraryAdd, MdCheck } from "react-icons/md";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { Input } from "@/components/ui/input";
import { MacroSummaryBanner } from "./MacroSummaryBanner";
import { MealLibraryModal } from "./MealLibraryModal";
import { MealFormItem } from "./MealFormItem";
import { nutritionPlanSchema } from "../constants/validations";
import type {
  NutritionPlanFormRawValues,
  NutritionPlanFormValues,
} from "../constants/validations";
import { MealType } from "../types/index";
import type { NutritionPlanMeal } from "../types/index";

interface PlanWizardSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialPlan?: NutritionPlanFormValues | null;
  isLoading?: boolean;
  onSubmit: (data: NutritionPlanFormValues) => void;
  isDuplicate?: boolean;
}

type WizardStep = 1 | 2 | 3;

function getMealTypeLabel(mealType: MealType): string {
  const labels: Record<MealType, string> = {
    [MealType.Breakfast]: "Breakfast",
    [MealType.Lunch]: "Lunch",
    [MealType.Dinner]: "Dinner",
    [MealType.Snack]: "Snack",
    [MealType.PreWorkout]: "Pre-Workout",
    [MealType.PostWorkout]: "Post-Workout",
  };
  return labels[mealType] ?? "Unknown";
}

export function PlanWizardSlideOver({
  open,
  onOpenChange,
  initialPlan,
  isLoading = false,
  onSubmit,
  isDuplicate = false,
}: PlanWizardSlideOverProps) {
  const { t } = useTranslation("nutrition");
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [mealLibraryOpen, setMealLibraryOpen] = useState(false);
  const [calorieConfirmOpen, setCalorieConfirmOpen] = useState(false);

  const methods = useForm<
    NutritionPlanFormRawValues,
    unknown,
    NutritionPlanFormValues
  >({
    resolver: zodResolver<
      NutritionPlanFormRawValues,
      unknown,
      NutritionPlanFormValues
    >(nutritionPlanSchema),
    mode: "onChange",
    defaultValues: {
      id: undefined,
      name: "",
      objective: "",
      schedule: "",
      targetCalories: 0,
      meals: [],
    },
  });

  const {
    watch,
    setValue,
    reset,
    trigger,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control: methods.control,
    name: "meals",
  });

  // watchedMeals reflects every keystroke so banners/totals stay accurate.
  const rawWatchedMeals = watch("meals");
  const watchedMeals = useMemo<NutritionPlanMeal[]>(
    () =>
      Array.isArray(rawWatchedMeals)
        ? (rawWatchedMeals as NutritionPlanMeal[])
        : [],
    [rawWatchedMeals],
  );

  const macroTotals = useMemo(
    () => ({
      totalCalories: watchedMeals.reduce(
        (s, m) => s + (Number(m.calories) || 0),
        0,
      ),
      totalProtein: watchedMeals.reduce(
        (s, m) => s + (Number(m.proteinGrams) || 0),
        0,
      ),
      totalCarbs: watchedMeals.reduce(
        (s, m) => s + (Number(m.carbGrams) || 0),
        0,
      ),
      totalFat: watchedMeals.reduce((s, m) => s + (Number(m.fatGrams) || 0), 0),
      totalMeals: watchedMeals.length,
    }),
    [watchedMeals],
  );

  const name = watch("name");
  const schedule = watch("schedule");
  const targetCalories = watch("targetCalories") ?? 0;

  const hasNameError = Boolean(errors.name?.message);

  const isOverCalorieTarget =
    targetCalories > 0 && macroTotals.totalCalories > targetCalories;

  // Build a clean reset payload from initialPlan, normalising every field that
  // the API may return with the wrong runtime type (numeric IDs, etc.).
  function buildResetValues(
    plan: NutritionPlanFormValues | null | undefined,
    duplicate: boolean,
  ): NutritionPlanFormValues {
    if (!plan) {
      return {
        id: undefined,
        name: "",
        objective: "",
        schedule: "",
        targetCalories: 0,
        meals: [],
      };
    }

    const meals = (plan.meals ?? []).map((m) => ({
      // Coerce id: API may return a number, Zod now coerces it but we also
      // normalise here so RHF's defaultValues start clean.
      id: m.id != null ? String(m.id) : undefined,
      mealType: Number(m.mealType) as MealType,
      description: m.description ?? "",
      calories: Number(m.calories) || 0,
      proteinGrams: Number(m.proteinGrams) || 0,
      carbGrams: Number(m.carbGrams) || 0,
      fatGrams: Number(m.fatGrams) || 0,
      dietaryNotes: m.dietaryNotes ?? "",
    }));

    return {
      id: duplicate ? undefined : plan.id != null ? String(plan.id) : undefined,
      name: duplicate ? `${plan.name} (Copy)` : (plan.name ?? ""),
      objective: plan.objective ?? "",
      schedule: plan.schedule ?? "",
      targetCalories: Number(plan.targetCalories) || 0,
      meals,
    };
  }

  // Reset form whenever the drawer opens or the plan being edited changes.
  useEffect(() => {
    if (open) {
      reset(buildResetValues(initialPlan ?? null, isDuplicate));
    }
  }, [open, initialPlan, isDuplicate, reset]);

  const getWizardTitle = () => {
    if (isDuplicate) return t("wizard.titles.duplicate");
    return initialPlan?.id
      ? t("wizard.titles.edit")
      : t("wizard.titles.create");
  };

  const getWizardSubtitle = () => {
    if (initialPlan?.name && !isDuplicate) return initialPlan.name;
    return undefined;
  };

  const sortedMealsWithIndex = useMemo(
    () =>
      fields
        .map((field, index) => ({ field, index }))
        .sort(
          (a, b) => (a.field.mealType as number) - (b.field.mealType as number),
        ),
    [fields],
  );

  const canProceedToConfirmation = fields.length > 0;

  function handleMealTypePillClick(type: MealType) {
    const alreadyExists = fields.some((f) => f.mealType === type);
    if (!alreadyExists) {
      append({
        mealType: type,
        description: "",
        calories: 0,
        proteinGrams: 0,
        carbGrams: 0,
        fatGrams: 0,
        dietaryNotes: "",
      });
    }
  }

  function handleRemoveMeal(originalIndex: number) {
    remove(originalIndex);
  }

  function handleSelectFromLibrary(meal: Omit<NutritionPlanMeal, "id">) {
    append({ ...meal });
    setMealLibraryOpen(false);
  }

  async function handleProceedToStep2() {
    const isValid = await trigger("name");
    if (isValid) setCurrentStep(2);
  }

  function handleBack() {
    setCurrentStep(currentStep === 3 ? 2 : 1);
  }

  function handleConfirm() {
    setCurrentStep(3);
  }

  function handleFinalSubmit() {
    handleSubmit((formData: NutritionPlanFormValues) => {
      onSubmit(formData);
    })();
  }

  function handleClose() {
    onOpenChange(false);
    setCurrentStep(1);
  }

  const StepProgressBar = () => {
    const steps = [
      { step: 1, label: t("wizard.progress.info") },
      { step: 2, label: t("wizard.progress.meals") },
      { step: 3, label: t("wizard.progress.done") },
    ];

    return (
      <div className="flex items-center justify-between mb-4 px-4">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                currentStep >= step.step
                  ? "bg-[#06B6D4] text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.step}
            </div>
            <div
              className={`ml-2 text-sm font-medium ${
                currentStep >= step.step
                  ? "text-[#06B6D4]"
                  : "text-gray-500 dark:text-gray-400"
              }`}
            >
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-px flex-1 ${
                  currentStep > step.step
                    ? "bg-[#06B6D4]"
                    : "bg-gray-200 dark:bg-gray-700"
                }`}
              />
            )}
          </div>
        ))}
      </div>
    );
  };

  const allMealTypes = (Object.values(MealType) as MealType[]).sort(
    (a, b) => a - b,
  );

  // Collect any per-meal validation errors for the step-3 banner.
  const mealErrors = errors.meals;
  const hasMealErrors =
    Array.isArray(mealErrors) && mealErrors.some((e) => e != null);

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={handleClose}
        direction="right"
        modal={true}
      >
        <DrawerContent className="w-full sm:max-w-xl">
          {/* Header */}
          <DrawerHeader className="flex flex-col border-b border-border pb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex flex-col">
                <h2 className="text-lg font-semibold">{getWizardTitle()}</h2>
                {getWizardSubtitle() && (
                  <p className="text-sm text-muted-foreground mt-1">
                    {getWizardSubtitle()}
                  </p>
                )}
              </div>
              <Button
                size="icon-sm"
                variant="ghost"
                onClick={handleClose}
                disabled={isLoading}
              >
                <MdClose className="size-5" />
              </Button>
            </div>
            <StepProgressBar />
          </DrawerHeader>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <FormProvider {...methods}>
              <form onSubmit={handleFinalSubmit}>
                {/* Step 1: Info */}
                {currentStep === 1 && (
                  <div className="space-y-6 p-4">
                    <InputField
                      name="name"
                      label={t("wizard.step1.nameLabel")}
                      placeholder={t("wizard.step1.namePlaceholder")}
                      required
                      rules={{
                        required: "Plan name is required",
                        maxLength: {
                          value: 150,
                          message: "Plan name must not exceed 150 characters",
                        },
                      }}
                    />

                    <div className="text-xs text-muted-foreground text-right -mt-4">
                      {name?.length ?? 0}/150
                    </div>

                    <TextareaField
                      name="objective"
                      label={t("wizard.step1.objectiveLabel")}
                      placeholder={t("wizard.step1.objectivePlaceholder")}
                      rows={3}
                    />
                    <div className="text-xs text-muted-foreground -mt-2">
                      {t("wizard.step1.objectiveOptional")}
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                        {t("wizard.step1.scheduleLabel")}
                      </label>
                      <Input
                        placeholder={t("wizard.step1.schedulePlaceholder")}
                        value={schedule || ""}
                        onChange={(e) => setValue("schedule", e.target.value)}
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium leading-none">
                        Target Daily Calories
                        <span className="text-xs text-muted-foreground font-normal ml-2">
                          (optional — used for boundary check)
                        </span>
                      </label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 2500"
                        value={targetCalories || ""}
                        onChange={(e) =>
                          setValue(
                            "targetCalories",
                            Math.max(0, parseInt(e.target.value) || 0),
                          )
                        }
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Meals */}
                {currentStep === 2 && (
                  <div className="space-y-4 pb-4">
                    <div className="sticky top-0 z-10 bg-popover/95 backdrop-blur-sm">
                      <MacroSummaryBanner meals={watchedMeals} sticky />
                    </div>

                    <div className="px-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                          {t("wizard.step2.mealTypeLabel")}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {allMealTypes.map((type) => {
                            const exists = fields.some(
                              (f) => f.mealType === type,
                            );
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => handleMealTypePillClick(type)}
                                className={[
                                  "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium border transition-colors",
                                  exists
                                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400 cursor-default"
                                    : "border-slate-700/50 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-slate-100 cursor-pointer",
                                ].join(" ")}
                              >
                                {exists && (
                                  <MdCheck className="size-3 shrink-0" />
                                )}
                                {getMealTypeLabel(type)}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div className="space-y-3">
                        {sortedMealsWithIndex.length === 0 ? (
                          <div className="text-center py-8 rounded-xl border border-dashed border-slate-700 text-sm text-slate-500">
                            {t("wizard.step2.noMeals")}
                          </div>
                        ) : (
                          sortedMealsWithIndex.map(({ index: originalIdx }) => (
                            <MealFormItem
                              key={originalIdx}
                              index={originalIdx}
                              onRemove={handleRemoveMeal}
                            />
                          ))
                        )}
                      </div>

                      <div className="pt-1">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => setMealLibraryOpen(true)}
                          className="w-full border-slate-700 text-slate-300 hover:text-slate-100 hover:border-slate-600"
                        >
                          <MdLibraryAdd className="size-4" />
                          {t("wizard.step2.useMealLibrary")}
                        </Button>
                      </div>

                      {isOverCalorieTarget && (
                        <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-400">
                          <span className="mt-0.5 shrink-0 text-base leading-none">
                            ⚠️
                          </span>
                          <span>
                            Total calories (
                            <strong>
                              {macroTotals.totalCalories.toLocaleString()} kcal
                            </strong>
                            ) exceed the plan target (
                            <strong>
                              {targetCalories.toLocaleString()} kcal
                            </strong>
                            ).
                          </span>
                        </div>
                      )}

                      {!canProceedToConfirmation && (
                        <div className="text-xs text-amber-600 dark:text-amber-400 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2">
                          {t("wizard.step2.validationError")}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Step 3: Confirmation */}
                {currentStep === 3 && (
                  <div className="space-y-6 p-4">
                    <div className="space-y-4">
                      <div className="p-4 bg-muted/50 rounded-lg border border-border">
                        <h3 className="text-sm font-semibold mb-3">
                          {t("wizard.step3.planDetails")}
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t("wizard.step3.planName")}
                            </span>
                            <span className="font-medium">{name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              {t("wizard.step3.mealCount")}
                            </span>
                            <span className="font-medium">
                              {macroTotals.totalMeals}
                            </span>
                          </div>
                          <div className="border-t border-border/60 pt-2 mt-1 space-y-1.5">
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("wizard.step3.dailyCalories")}
                              </span>
                              <span
                                className={[
                                  "font-semibold tabular-nums",
                                  isOverCalorieTarget
                                    ? "text-amber-400"
                                    : "text-orange-500 dark:text-orange-400",
                                ].join(" ")}
                              >
                                {macroTotals.totalCalories.toLocaleString()}{" "}
                                kcal
                                {isOverCalorieTarget && (
                                  <span className="ml-1.5 text-[10px] font-medium text-amber-500">
                                    ↑{" "}
                                    {(
                                      macroTotals.totalCalories - targetCalories
                                    ).toLocaleString()}{" "}
                                    over
                                  </span>
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("wizard.step3.proteinTotal")}
                              </span>
                              <span className="font-medium text-blue-500 tabular-nums">
                                {macroTotals.totalProtein} g
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("wizard.step3.carbsTotal")}
                              </span>
                              <span className="font-medium text-amber-500 tabular-nums">
                                {macroTotals.totalCarbs} g
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">
                                {t("wizard.step3.fatTotal")}
                              </span>
                              <span className="font-medium text-rose-500 tabular-nums">
                                {macroTotals.totalFat} g
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isOverCalorieTarget && (
                        <div className="flex items-start gap-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs text-amber-400">
                          <span className="mt-0.5 shrink-0 text-base leading-none">
                            ⚠️
                          </span>
                          <span>
                            Total calories (
                            <strong>
                              {macroTotals.totalCalories.toLocaleString()} kcal
                            </strong>
                            ) exceed the plan target (
                            <strong>
                              {targetCalories.toLocaleString()} kcal
                            </strong>
                            ). You will be asked to confirm before saving.
                          </span>
                        </div>
                      )}

                      {/* Visible error banner if Zod rejects the form on Save */}
                      {hasMealErrors && (
                        <div className="rounded-lg border border-red-500/40 bg-red-500/10 px-3 py-2.5 text-xs text-red-400">
                          Some meals have validation errors. Please go back and
                          fix them before saving.
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </FormProvider>
          </div>

          {/* Footer */}
          <DrawerFooter className="border-t border-border flex-row justify-between gap-2">
            {currentStep > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
              >
                <MdChevronLeft className="size-4" />
                {t("common:back")}
              </Button>
            )}

            <div className="flex-1" />

            {currentStep === 1 && (
              <Button
                size="sm"
                onClick={handleProceedToStep2}
                disabled={!name || hasNameError || isLoading}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
              >
                {t("wizard.step1.nextButton")}
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!canProceedToConfirmation || isLoading}
                className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
              >
                {t("wizard.step2.nextButton")}
              </Button>
            )}

              {currentStep === 3 && (
                <Button
                  type="button"
                  size="sm"
                  onClick={(e) => {
                    if (isOverCalorieTarget) {
                      e.preventDefault();
                      setCalorieConfirmOpen(true);
                      return;
                    }
                    // Trigger RHF submit
                    handleSubmit(onSubmit)();
                  }}
                  disabled={isLoading}
                  className="bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                >
                  {isLoading
                    ? t("common:processing")
                    : t("wizard.step3.saveButton")}
                </Button>
              )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Meal Library Modal */}
      <MealLibraryModal
        open={mealLibraryOpen}
        onOpenChange={setMealLibraryOpen}
        onSelect={handleSelectFromLibrary}
      />

      {/* Calorie Boundary Confirmation Dialog */}
      {calorieConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCalorieConfirmOpen(false)}
          />
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl border border-slate-700 bg-slate-900 shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <span className="text-2xl leading-none mt-0.5">⚠️</span>
              <div>
                <h3 className="text-sm font-semibold text-slate-100 mb-1">
                  Calorie Limit Exceeded
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  This plan's total (
                  <span className="text-amber-400 font-semibold">
                    {macroTotals.totalCalories.toLocaleString()} kcal
                  </span>
                  ) exceeds the target of{" "}
                  <span className="text-slate-200 font-semibold">
                    {targetCalories.toLocaleString()} kcal
                  </span>
                  . Do you want to proceed?
                </p>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 border-slate-700 text-slate-300 hover:text-slate-100"
                onClick={() => setCalorieConfirmOpen(false)}
              >
                Revise Meals
              </Button>
              <Button
                size="sm"
                className="flex-1 bg-[#06B6D4] hover:bg-[#0891B2] text-white"
                disabled={isLoading}
                onClick={() => {
                  setCalorieConfirmOpen(false);
                  handleFinalSubmit();
                }}
              >
                {isLoading ? t("common:processing") : "Accept & Save"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
