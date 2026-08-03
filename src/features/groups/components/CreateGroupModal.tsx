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
import { useCreateGroup } from "../hooks/useCreateGroup";
import { createGroupSchema } from "../constants/validations";
import type { CreateGroupFormValues } from "../constants/validations";

interface CreateGroupModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupModal({ open, onOpenChange }: CreateGroupModalProps) {
  const { t } = useTranslation("groups");

  const methods = useForm<CreateGroupFormValues>({
    resolver: zodResolver(createGroupSchema),
    defaultValues: { name: "", description: "" },
  });

  const { mutate: create, isPending } = useCreateGroup(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) methods.reset();
  }, [open, methods]);

  function onSubmit(values: CreateGroupFormValues) {
    create({ name: values.name, description: values.description || undefined });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("groups:createModal.title")}</DialogTitle>
          <DialogDescription>
            {t("groups:createModal.description")}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            id="create-group-form"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
            noValidate
          >
            <InputField<CreateGroupFormValues>
              name="name"
              label={t("groups:createModal.name")}
              placeholder={t("groups:createModal.namePlaceholder")}
              required
            />

            <TextareaField<CreateGroupFormValues>
              name="description"
              label={t("groups:createModal.descriptionLabel")}
              placeholder={t("groups:createModal.descriptionPlaceholder")}
              rows={3}
            />
          </form>
        </FormProvider>

        <DialogFooter showCloseButton>
          <Button
            type="submit"
            form="create-group-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending
              ? t("groups:createModal.creating")
              : t("groups:createModal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
