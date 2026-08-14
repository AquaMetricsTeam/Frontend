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

  // Helper: parse a numeric input string to integer or undefined when empty, stripping leading zeros
  const parseNonNegativeInt = (raw: string): number | undefined => {
    if (raw === "") return undefined;
    const cleaned = raw.replace(/^0+(?=\d)/, "");
    const parsed = parseInt(cleaned, 10);
    return isNaN(parsed) ? undefined : Math.max(0, parsed);
  };

  const mealLabel = MEAL_TYPE_LABELS[mealTypeField.value as MealType] ?? "Meal";

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      {/* ── Card Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/50">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-0.5">
            {t("wizard.step2.mealLabel")}
          </p>
          <p className="text-sm font-semibold text-foreground">{mealLabel}</p>
        </div>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={() => onRemove(index)}
          className="text-destructive hover:text-destructive/80 hover:bg-destructive/10 h-8 px-2 gap-1 cursor-pointer"
        >
          <MdDelete className="size-4" />
          <span className="text-xs">{t("common:delete")}</span>
        </Button>
      </div>

      {/* ── Card Body ─────────────────────────────────────────────────────── */}
      <div className="p-4 space-y-4">
        {/* Description */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            {t("wizard.step2.descriptionLabel")}
          </label>
          <textarea
            {...descriptionField}
            placeholder={t("wizard.step2.descriptionPlaceholder")}
            rows={3}
            className={[
              "w-full px-3 py-2 text-sm rounded-lg resize-none",
              "bg-background border text-foreground placeholder:text-muted-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring/50",
              descriptionState.error
                ? "border-destructive"
                : "border-input focus:border-ring",
            ].join(" ")}
          />
          {descriptionState.error && (
            <p className="text-xs text-destructive">
              {descriptionState.error.message}
            </p>
          )}
        </div>

        {/* Macros grid — 2×2 */}
        <div className="grid grid-cols-2 gap-3">
          {/* Calories */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">
              {t("wizard.step2.caloriesLabel")}
              <span className="text-muted-foreground/60 font-normal ms-1">kcal</span>
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={caloriesField.value === 0 ? "" : (caloriesField.value ?? "")}
              onChange={(e) =>
                caloriesField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={caloriesField.onBlur}
              className="text-sm"
            />
          </div>

          {/* Protein */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">
              {t("wizard.step2.proteinLabel")}
              <span className="text-muted-foreground/60 font-normal ms-1">g</span>
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={proteinField.value === 0 ? "" : (proteinField.value ?? "")}
              onChange={(e) =>
                proteinField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={proteinField.onBlur}
              className="text-sm"
            />
          </div>

          {/* Carbs */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">
              {t("wizard.step2.carbsLabel")}
              <span className="text-muted-foreground/60 font-normal ms-1">g</span>
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={carbsField.value === 0 ? "" : (carbsField.value ?? "")}
              onChange={(e) =>
                carbsField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={carbsField.onBlur}
              className="text-sm"
            />
          </div>

          {/* Fat */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-muted-foreground block">
              {t("wizard.step2.fatLabel")}
              <span className="text-muted-foreground/60 font-normal ms-1">g</span>
            </label>
            <Input
              type="number"
              min={0}
              placeholder="0"
              value={fatField.value === 0 ? "" : (fatField.value ?? "")}
              onChange={(e) =>
                fatField.onChange(parseNonNegativeInt(e.target.value))
              }
              onBlur={fatField.onBlur}
              className="text-sm"
            />
          </div>
        </div>

        {/* Dietary Notes */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
            {t("wizard.step2.dietaryNotesLabel")}
            <span className="text-muted-foreground/60 font-normal ms-1 normal-case tracking-normal">
              ({t("wizard.step1.objectiveOptional")})
            </span>
          </label>
          <textarea
            {...notesField}
            placeholder={t("wizard.step2.dietaryNotesPlaceholder")}
            rows={2}
            className="w-full px-3 py-2 text-sm rounded-lg resize-none bg-background border border-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 focus:border-ring"
          />
        </div>
      </div>
    </div>
  );
}

