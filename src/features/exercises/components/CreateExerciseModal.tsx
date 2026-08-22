import { useEffect, useState } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { Dumbbell, Waves } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { SelectField } from "@/components/fields/SelectField";
import { useMe } from "@/features/auth/hooks/useMe";
import { useCreateExercise } from "../hooks/useCreateExercise";
import { createExerciseSchema, type CreateExerciseFormValues } from "../constants/validations";
import { getMuscleGroupOptions } from "../constants/muscleGroups";
import { getSwimmingCategoryOptions } from "../constants/swimmingCategories";
import type { MuscleGroup, SwimmingExerciseCategory } from "../types/index";

interface CreateExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultMuscleGroup?: MuscleGroup;
  defaultCategory?: SwimmingExerciseCategory;
}

export function CreateExerciseModal({
  open,
  onOpenChange,
  defaultMuscleGroup,
  defaultCategory,
}: CreateExerciseModalProps) {
  const { t } = useTranslation("exercises");
  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];

  const isFitnessOnly =
    roles.includes("FitnessCoach") &&
    !roles.includes("SwimmingCoach") &&
    !roles.includes("Admin");
  const isSwimmingOnly =
    roles.includes("SwimmingCoach") &&
    !roles.includes("FitnessCoach") &&
    !roles.includes("Admin");

  const canSwitchType =
    defaultMuscleGroup == null &&
    defaultCategory == null &&
    !isFitnessOnly &&
    !isSwimmingOnly;

  const initialType =
    defaultCategory != null || isSwimmingOnly ? "swimming" : "fitness";
  const [exerciseType, setExerciseType] = useState<"fitness" | "swimming">(
    initialType,
  );

  const methods = useForm<CreateExerciseFormValues>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: {
      title: "",
      description: "",
      muscleGroup: defaultMuscleGroup ?? null,
      category: defaultCategory ?? null,
    },
  });

  const { mutate: create, isPending } = useCreateExercise(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      const type =
        defaultCategory != null || isSwimmingOnly ? "swimming" : "fitness";
      setExerciseType(type);
      methods.reset({
        title: "",
        description: "",
        muscleGroup: defaultMuscleGroup ?? null,
        category: defaultCategory ?? null,
      });
    }
  }, [open, methods, defaultMuscleGroup, defaultCategory, isSwimmingOnly]);

  function onSubmit(values: CreateExerciseFormValues) {
    const isSwimmingMode = exerciseType === "swimming";
    create({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      muscleGroup:
        isSwimmingMode || values.muscleGroup == null
          ? null
          : (Number(values.muscleGroup) as MuscleGroup),
      category:
        !isSwimmingMode || values.category == null
          ? null
          : (Number(values.category) as SwimmingExerciseCategory),
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("exercises:createModal.title")}</DialogTitle>
          <DialogDescription>
            {t("exercises:createModal.description")}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            id="create-exercise-form"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
            noValidate
          >
            {canSwitchType && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-foreground">
                  {t("exercises:createModal.typeLabel")}
                </label>
                <div className="grid grid-cols-2 p-1 bg-muted rounded-lg gap-1 border border-border">
                  <button
                    type="button"
                    onClick={() => {
                      setExerciseType("fitness");
                      methods.setValue("category", null);
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      exerciseType === "fitness"
                        ? "bg-card text-foreground shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Dumbbell className="size-3.5" />
                    {t("exercises:createModal.fitness")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setExerciseType("swimming");
                      methods.setValue("muscleGroup", null);
                    }}
                    className={`flex items-center justify-center gap-2 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                      exerciseType === "swimming"
                        ? "bg-card text-foreground shadow-xs border border-border"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Waves className="size-3.5" />
                    {t("exercises:createModal.swimming")}
                  </button>
                </div>
              </div>
            )}

            <InputField<CreateExerciseFormValues>
              name="title"
              label={t("exercises:createModal.titleLabel")}
              placeholder={t("exercises:createModal.titlePlaceholder")}
              required
            />

            <TextareaField<CreateExerciseFormValues>
              name="description"
              label={t("exercises:createModal.descriptionLabel")}
              placeholder={t("exercises:createModal.descriptionPlaceholder")}
              rows={2}
            />

            {exerciseType === "fitness" && (
              <SelectField<CreateExerciseFormValues>
                name="muscleGroup"
                label={t("exercises:createModal.muscleGroupLabel")}
                options={getMuscleGroupOptions(t)}
                placeholder={t("exercises:createModal.muscleGroupPlaceholder")}
                valueType="number"
              />
            )}

            {exerciseType === "swimming" && (
              <SelectField<CreateExerciseFormValues>
                name="category"
                label={t("exercises:createModal.categoryLabel")}
                options={getSwimmingCategoryOptions(t)}
                placeholder={t("exercises:createModal.categoryPlaceholder")}
                valueType="number"
              />
            )}

            <DialogFooter showCloseButton>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-24 cursor-pointer"
              >
                {isPending
                  ? t("exercises:createModal.creating")
                  : t("exercises:createModal.submit")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
