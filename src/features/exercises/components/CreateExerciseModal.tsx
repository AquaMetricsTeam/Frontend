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
import { useCreateExercise } from "../hooks/useCreateExercise";
import { createExerciseSchema } from "../constants/validations";
import type { CreateExerciseFormValues } from "../constants/validations";

interface CreateExerciseModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExerciseModal({
  open,
  onOpenChange,
}: CreateExerciseModalProps) {
  const { t } = useTranslation("exercises");

  const methods = useForm<CreateExerciseFormValues>({
    resolver: zodResolver(createExerciseSchema),
    defaultValues: { title: "", description: "" },
  });

  const { mutate: create, isPending } = useCreateExercise(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) methods.reset();
  }, [open, methods]);

  function onSubmit(values: CreateExerciseFormValues) {
    create({
      title: values.title,
      description: values.description || undefined,
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
          </form>
        </FormProvider>

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="create-exercise-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending
              ? t("exercises:createModal.creating")
              : t("exercises:createModal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
