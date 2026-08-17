import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
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
import { useUpdateExercise } from "../hooks/useUpdateExercise";
import { updateExerciseSchema } from "../constants/validations";
import type { UpdateExerciseFormValues } from "../constants/validations";
import { MUSCLE_GROUP_OPTIONS } from "../constants/muscleGroups";
import { SWIMMING_CATEGORY_OPTIONS } from "../constants/swimmingCategories";
import type {
  Exercise,
  MuscleGroup,
  SwimmingExerciseCategory,
} from "../types/index";

interface EditExerciseModalProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExerciseModal({
  exercise,
  open,
  onOpenChange,
}: EditExerciseModalProps) {
  const { t } = useTranslation("exercises");
  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];

  const isFitness = roles.includes("FitnessCoach");
  const isSwimming = roles.includes("SwimmingCoach");

  const showMuscle =
    isFitness || (!isSwimming && (exercise.muscleGroup != null || exercise.category == null));
  const showCategory =
    isSwimming || (!isFitness && (exercise.category != null || exercise.muscleGroup == null));

  const methods = useForm<UpdateExerciseFormValues>({
    resolver: zodResolver(updateExerciseSchema),
    defaultValues: {
      title: exercise.title || "",
      description: exercise.description ?? "",
      muscleGroup: exercise.muscleGroup ?? null,
      category: exercise.category ?? null,
    },
  });

  const { mutate: update, isPending } = useUpdateExercise(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      methods.reset({
        title: exercise.title || "",
        description: exercise.description ?? "",
        muscleGroup: exercise.muscleGroup ?? null,
        category: exercise.category ?? null,
      });
    }
  }, [open, exercise, methods]);

  function onSubmit(values: UpdateExerciseFormValues) {
    update({
      id: exercise.id,
      payload: {
        title: values.title.trim(),
        description: values.description?.trim() || undefined,
        muscleGroup: isSwimming
          ? null
          : values.muscleGroup
            ? (Number(values.muscleGroup) as MuscleGroup)
            : null,
        category: isFitness
          ? null
          : values.category
            ? (Number(values.category) as SwimmingExerciseCategory)
            : null,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("exercises:editModal.title")}</DialogTitle>
          <DialogDescription>
            {t("exercises:editModal.description")}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit, (errors) => {
              console.error("EditExercise form validation errors:", errors);
            })}
            className="flex flex-col gap-4 py-2"
            noValidate
          >
            <InputField<UpdateExerciseFormValues>
              name="title"
              label={t("exercises:createModal.titleLabel")}
              placeholder={t("exercises:createModal.titlePlaceholder")}
              required
            />

            <TextareaField<UpdateExerciseFormValues>
              name="description"
              label={t("exercises:createModal.descriptionLabel")}
              placeholder={t("exercises:createModal.descriptionPlaceholder")}
              rows={2}
            />

            {showMuscle && (
              <SelectField<UpdateExerciseFormValues>
                name="muscleGroup"
                label={t("exercises:createModal.muscleGroupLabel")}
                options={MUSCLE_GROUP_OPTIONS}
                placeholder={t("exercises:createModal.muscleGroupPlaceholder")}
                valueType="number"
              />
            )}

            {showCategory && (
              <SelectField<UpdateExerciseFormValues>
                name="category"
                label={t("exercises:createModal.categoryLabel")}
                options={SWIMMING_CATEGORY_OPTIONS}
                placeholder={t("exercises:createModal.categoryPlaceholder")}
                valueType="number"
              />
            )}

            <DialogFooter showCloseButton>
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-24"
              >
                {isPending
                  ? t("exercises:editModal.saving")
                  : t("exercises:editModal.submit")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
