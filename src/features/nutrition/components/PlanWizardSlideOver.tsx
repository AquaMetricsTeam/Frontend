import { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useForm, FormProvider, useFieldArray, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdClose, MdChevronLeft, MdCheck, MdWarning, MdErrorOutline } from "react-icons/md";
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

  // rawWatchedMeals subscribes deeply via useWatch so banners/totals update live on every keystroke.
  const rawWatchedMeals = useWatch({
    control: methods.control,
    name: "meals",
  });
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

  // Reset form and wizard step whenever the drawer opens or the plan being edited changes.
  useEffect(() => {
    if (open) {
      setCurrentStep(1);
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
      <div className="flex items-center justify-between mb-2 px-2">
        {steps.map((step, index) => (
          <div key={step.step} className="flex items-center">
            <div
              className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold ${currentStep >= step.step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
                }`}
            >
              {step.step}
            </div>
            <div
              className={`ms-2 text-xs font-medium ${currentStep >= step.step
                  ? "text-primary"
                  : "text-muted-foreground"
                }`}
            >
              {step.label}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`mx-3 h-px flex-1 ${currentStep > step.step
                    ? "bg-primary"
                    : "bg-border"
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
          <DrawerHeader className="flex flex-col border-b border-border px-6 pt-6 pb-4 bg-card">
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
                className="cursor-pointer"
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

                    <div className="text-xs text-muted-foreground text-end -mt-4">
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
                        <span className="text-xs text-muted-foreground font-normal ms-2">
                          (optional — used for boundary check)
                        </span>
                      </label>
                      <Input
                        type="number"
                        min={0}
                        placeholder="e.g. 2500"
                        value={targetCalories || ""}
                        onChange={(e) => {
                          const cleaned = e.target.value.replace(/^0+(?=\d)/, "");
                          setValue(
                            "targetCalories",
                            cleaned === "" ? undefined as any : Math.max(0, parseInt(cleaned, 10) || 0),
                          );
                        }}
                        className="text-sm"
                      />
                    </div>
                  </div>
                )}

                {/* Step 2: Meals */}
                {currentStep === 2 && (
                  <div className="space-y-4 pb-4">
                    {/* Sticky Running Daily Total Banner */}
                    <div className="sticky top-0 z-20 bg-card border-b border-border px-4 py-3 shadow-xs">
                      <div className="flex flex-col gap-2">
                        {/* Heading — Prominent Primary Treatment */}
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                            {t("macro.summaryTitle")}
                          </h3>
                          <span className="text-[11px] font-medium text-muted-foreground">
                            {macroTotals.totalMeals} {macroTotals.totalMeals === 1 ? "meal" : "meals"}
                          </span>
                        </div>

                        {/* 4 Centered & Evenly Spaced Macro Metrics */}
                        <div className="grid grid-cols-4 gap-2 text-center pt-0.5">
                          {/* Calories */}
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/40 border border-border/40">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {t("macro.calories")}
                            </span>
                            <span className="text-sm font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                              {macroTotals.totalCalories.toLocaleString()}{" "}
                              <span className="text-[10px] font-normal text-muted-foreground ms-0.5">kcal</span>
                            </span>
                          </div>

                          {/* Protein */}
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/40 border border-border/40">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {t("macro.protein")}
                            </span>
                            <span className="text-sm font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                              {macroTotals.totalProtein}{" "}
                              <span className="text-[10px] font-normal text-muted-foreground ms-0.5">g</span>
                            </span>
                          </div>

                          {/* Carbs */}
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/40 border border-border/40">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {t("macro.carbs")}
                            </span>
                            <span className="text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                              {macroTotals.totalCarbs}{" "}
                              <span className="text-[10px] font-normal text-muted-foreground ms-0.5">g</span>
                            </span>
                          </div>

                          {/* Fat */}
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/40 border border-border/40">
                            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">
                              {t("macro.fat")}
                            </span>
                            <span className="text-sm font-bold text-rose-600 dark:text-rose-400 tabular-nums">
                              {macroTotals.totalFat}{" "}
                              <span className="text-[10px] font-normal text-muted-foreground ms-0.5">g</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-4 space-y-4">
                      <div className="space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
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
                                    ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 cursor-default"
                                    : "border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-foreground cursor-pointer",
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
                          <div className="text-center py-8 rounded-xl border border-dashed border-border text-sm text-muted-foreground">
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
                          className="w-full cursor-pointer"
                        >
                          {t("wizard.step2.useMealLibrary")}
                        </Button>
                      </div>

                      {isOverCalorieTarget && (
                        <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-600 dark:text-amber-400">
                          <MdWarning className="size-4 shrink-0 text-amber-500 mt-0.5" />
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
                      {/* Plan Summary Card */}
                      <div className="p-4 bg-muted/50 rounded-xl border border-border space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-foreground">
                            {t("wizard.step3.planDetails")}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {name}
                          </span>
                        </div>

                        {/* 4 Macro Cards */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {/* Calories */}
                          <div className="rounded-lg bg-card border border-primary/20 p-3 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-semibold text-primary/90 tracking-wide mb-1">
                              CALORIES
                            </div>
                            <div className="text-base font-bold text-foreground/90 tabular-nums">
                              {macroTotals.totalCalories.toLocaleString()}{" "}
                              <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">kcal</span>
                            </div>
                          </div>

                          {/* Protein */}
                          <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
                              PROTEIN
                            </div>
                            <div className="text-sm font-semibold text-foreground/80 tabular-nums">
                              {macroTotals.totalProtein}{" "}
                              <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
                            </div>
                          </div>

                          {/* Carbs */}
                          <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
                              CARBS
                            </div>
                            <div className="text-sm font-semibold text-foreground/80 tabular-nums">
                              {macroTotals.totalCarbs}{" "}
                              <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
                            </div>
                          </div>

                          {/* Fat */}
                          <div className="rounded-lg bg-card border border-border p-3 flex flex-col justify-between">
                            <div className="text-[10px] uppercase font-semibold text-muted-foreground tracking-wide mb-1">
                              FAT
                            </div>
                            <div className="text-sm font-semibold text-foreground/80 tabular-nums">
                              {macroTotals.totalFat}{" "}
                              <span className="text-[11px] font-normal text-muted-foreground/70 ms-0.5">g</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {isOverCalorieTarget && (
                        <div className="flex items-start gap-2.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3.5 py-2.5 text-xs text-amber-600 dark:text-amber-400">
                          <MdWarning className="size-4 shrink-0 text-amber-500 mt-0.5" />
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
                        <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs text-destructive">
                          <MdErrorOutline className="size-4 shrink-0 mt-0.5" />
                          <span>
                            Some meals have validation errors. Please go back and fix them before saving.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </form>
            </FormProvider>
          </div>

          {/* Footer */}
          <DrawerFooter className="border-t border-border flex-row items-center justify-between gap-3 px-6 py-4 bg-card">
            {currentStep > 1 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleBack}
                disabled={isLoading}
                className="cursor-pointer"
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
                className="cursor-pointer"
              >
                {t("wizard.step1.nextButton")}
              </Button>
            )}

            {currentStep === 2 && (
              <Button
                size="sm"
                onClick={handleConfirm}
                disabled={!canProceedToConfirmation || isLoading}
                className="cursor-pointer"
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
                className="cursor-pointer"
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
          <div className="relative z-10 w-full max-w-sm mx-4 rounded-xl border border-border bg-popover text-popover-foreground shadow-2xl p-6 space-y-4">
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
                <MdWarning className="size-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-1">
                  Calorie Limit Exceeded
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  This plan's total (
                  <span className="text-amber-600 dark:text-amber-400 font-semibold">
                    {macroTotals.totalCalories.toLocaleString()} kcal
                  </span>
                  ) exceeds the target of{" "}
                  <span className="text-foreground font-semibold">
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
                className="flex-1 cursor-pointer"
                onClick={() => setCalorieConfirmOpen(false)}
              >
                Revise Meals
              </Button>
              <Button
                size="sm"
                className="flex-1 cursor-pointer"
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

