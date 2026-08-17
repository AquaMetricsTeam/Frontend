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
import { useCreateExercise } from "../hooks/useCreateExercise";
import { createExerciseSchema } from "../constants/validations";
import type { CreateExerciseFormValues } from "../constants/validations";
import { MUSCLE_GROUP_OPTIONS } from "../constants/muscleGroups";
import { SWIMMING_CATEGORY_OPTIONS } from "../constants/swimmingCategories";
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

  const isFitness = roles.includes("FitnessCoach");
  const isSwimming = roles.includes("SwimmingCoach");

  const showMuscle =
    defaultMuscleGroup != null
      ? true
      : defaultCategory != null
        ? false
        : isFitness || (!isFitness && !isSwimming);

  const showCategory =
    defaultCategory != null
      ? true
      : defaultMuscleGroup != null
        ? false
        : isSwimming || (!isFitness && !isSwimming);

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
      methods.reset({
        title: "",
        description: "",
        muscleGroup: defaultMuscleGroup ?? null,
        category: defaultCategory ?? null,
      });
    }
  }, [open, methods, defaultMuscleGroup, defaultCategory]);

  function onSubmit(values: CreateExerciseFormValues) {
    create({
      title: values.title.trim(),
      description: values.description?.trim() || undefined,
      muscleGroup:
        isSwimming || defaultCategory != null
          ? null
          : values.muscleGroup
            ? (Number(values.muscleGroup) as MuscleGroup)
            : null,
      category:
        isFitness || defaultMuscleGroup != null
          ? null
          : values.category
            ? (Number(values.category) as SwimmingExerciseCategory)
            : null,
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

            {showMuscle && (
              <SelectField<CreateExerciseFormValues>
                name="muscleGroup"
                label={t("exercises:createModal.muscleGroupLabel")}
                options={MUSCLE_GROUP_OPTIONS}
                placeholder={t("exercises:createModal.muscleGroupPlaceholder")}
                valueType="number"
              />
            )}

            {showCategory && (
              <SelectField<CreateExerciseFormValues>
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
