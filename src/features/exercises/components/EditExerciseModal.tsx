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
import { useUpdateExercise } from "../hooks/useUpdateExercise";
import { updateExerciseSchema } from "../constants/validations";
import type { UpdateExerciseFormValues } from "../constants/validations";
import type { Exercise } from "../types/index";

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

  const methods = useForm<UpdateExerciseFormValues>({
    resolver: zodResolver(updateExerciseSchema),
    defaultValues: {
      title: exercise.title,
      description: exercise.description ?? "",
    },
  });

  const { mutate: update, isPending } = useUpdateExercise(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      methods.reset({
        title: exercise.title,
        description: exercise.description ?? "",
      });
    }
  }, [open, exercise, methods]);

  function onSubmit(values: UpdateExerciseFormValues) {
    update({
      id: exercise.id,
      payload: {
        title: values.title,
        description: values.description || undefined,
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
            id="edit-exercise-form"
            onSubmit={methods.handleSubmit(onSubmit)}
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
          </form>
        </FormProvider>

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="edit-exercise-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending
              ? t("exercises:editModal.saving")
              : t("exercises:editModal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
