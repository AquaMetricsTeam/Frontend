import { useController, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MealType } from "../types/index";
import type {
  NutritionPlanFormRawValues,
  NutritionPlanFormValues,
} from "../types/index";

// Maps numeric MealType enum values to display labels
const MEAL_TYPE_LABELS: Record<MealType, string> = {
  [MealType.Breakfast]: "Breakfast",
  [MealType.Lunch]: "Lunch",
  [MealType.Dinner]: "Dinner",
  [MealType.Snack]: "Snack",
  [MealType.PreWorkout]: "Pre-Workout",
  [MealType.PostWorkout]: "Post-Workout",
};

interface MealFormItemProps {
  /** Position in the meals array (the original, unsorted index used by RHF) */
  index: number;
  /** Called when the user clicks the remove button for this meal */
  onRemove: (index: number) => void;
}

/**
 * A single meal card inside the PlanWizardSlideOver step 2.
 *
 * Uses `useController` for every field so RHF registers them individually
 * as `meals.${index}.description`, `meals.${index}.calories`, etc.
 * This prevents the state-mutation bug where updating one meal's field
 * overwrites another meal's data through shared object references.
 */
export function MealFormItem({ index, onRemove }: MealFormItemProps) {
  const { t } = useTranslation("nutrition");
  const { control } = useFormContext<
    NutritionPlanFormRawValues,
    unknown,
    NutritionPlanFormValues
  >();

  // ── Field controllers — each field is an isolated RHF leaf node ──────────

  const { field: mealTypeField } = useController({
    name: `meals.${index}.mealType`,
    control,
  });

  const { field: descriptionField, fieldState: descriptionState } =
    useController({
      name: `meals.${index}.description`,
      control,
    });

  const { field: caloriesField } = useController({
    name: `meals.${index}.calories`,
    control,
  });

  const { field: proteinField } = useController({
    name: `meals.${index}.proteinGrams`,
    control,
  });

  const { field: carbsField } = useController({
    name: `meals.${index}.carbGrams`,
    control,
  });

  const { field: fatField } = useController({
    name: `meals.${index}.fatGrams`,
    control,
  });

  const { field: notesField } = useController({
    name: `meals.${index}.dietaryNotes`,
    control,
    defaultValue: "",
  });

  // Helper: parse a numeric input string to integer or undefined when empty
  const parseNonNegativeInt = (raw: string): number | undefined => {
    if (raw === "") return undefined;
    const parsed = parseInt(raw, 10);
    return isNaN(parsed) ? undefined : Math.max(0, parsed);
  };

  const mealLabel = MEAL_TYPE_LABELS[mealTypeField.value as MealType] ?? "Meal";

  return (
    <div className="rounded-xl border border-slate-700 bg-slate-800/60 overflow-hidden">
      {/* ── Card Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 bg-slate-800/80">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-slate-500 mb-0.5">
            {t("wizard.step2.mealLabel")}
          </p>
          <p className="text-sm font-semibold text-slate-100">{mealLabel}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onRemove(index)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10 h-8 px-2 gap-1"
        >
          <MdDelete className="size-4" />
          <span className="text-xs">{t("common:delete")}</span>
        </Button>
      </div>

      {/* ── Card Body ─────────────────────────────────────────────────────── */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            {t("wizard.step2.descriptionLabel")}
          </label>
          <textarea
            {...descriptionField}
            placeholder={t("wizard.step2.descriptionPlaceholder")}
            rows={3}
            className={[
              "w-full px-3 py-2 text-sm rounded-lg resize-none",
              "bg-slate-900/60 border text-slate-100 placeholder:text-slate-600",
              "focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50",
              descriptionState.error
                ? "border-red-500/60"
                : "border-slate-700 focus:border-[#06B6D4]/50",
            ].join(" ")}
          />
          {descriptionState.error && (
            <p className="text-xs text-red-400">
              {descriptionState.error.message}
            </p>
          )}
        </div>

        {/* Macros grid — 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Calories */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">
              {t("wizard.step2.caloriesLabel")}
              <span className="text-slate-600 font-normal ml-1">kcal</span>
            </label>
            <Input
              type="number"
              min={0}
              value={caloriesField.value ?? ""}
              onChange={(e) =>
                caloriesField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={caloriesField.onBlur}
              className="bg-slate-900/60 border-slate-700 text-slate-100 text-sm focus:border-[#06B6D4]/50 focus:ring-[#06B6D4]/30"
            />
          </div>

          {/* Protein */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">
              {t("wizard.step2.proteinLabel")}
              <span className="text-slate-600 font-normal ml-1">g</span>
            </label>
            <Input
              type="number"
              min={0}
              value={proteinField.value ?? ""}
              onChange={(e) =>
                proteinField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={proteinField.onBlur}
              className="bg-slate-900/60 border-slate-700 text-slate-100 text-sm focus:border-[#06B6D4]/50 focus:ring-[#06B6D4]/30"
            />
          </div>

          {/* Carbs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">
              {t("wizard.step2.carbsLabel")}
              <span className="text-slate-600 font-normal ml-1">g</span>
            </label>
            <Input
              type="number"
              min={0}
              value={carbsField.value ?? ""}
              onChange={(e) =>
                carbsField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={carbsField.onBlur}
              className="bg-slate-900/60 border-slate-700 text-slate-100 text-sm focus:border-[#06B6D4]/50 focus:ring-[#06B6D4]/30"
            />
          </div>

          {/* Fat */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 block">
              {t("wizard.step2.fatLabel")}
              <span className="text-slate-600 font-normal ml-1">g</span>
            </label>
            <Input
              type="number"
              min={0}
              value={fatField.value ?? ""}
              onChange={(e) =>
                fatField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={fatField.onBlur}
              className="bg-slate-900/60 border-slate-700 text-slate-100 text-sm focus:border-[#06B6D4]/50 focus:ring-[#06B6D4]/30"
            />
          </div>
        </div>

        {/* Dietary Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
            {t("wizard.step2.dietaryNotesLabel")}
            <span className="text-slate-600 font-normal ml-1 normal-case tracking-normal">
              ({t("wizard.step1.objectiveOptional")})
            </span>
          </label>
          <textarea
            {...notesField}
            placeholder={t("wizard.step2.dietaryNotesPlaceholder")}
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-lg resize-none bg-slate-900/60 border border-slate-700 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#06B6D4]/50 focus:border-[#06B6D4]/50"
          />
        </div>
      </div>
    </div>
  );
}
