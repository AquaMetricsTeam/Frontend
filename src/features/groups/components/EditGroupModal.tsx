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
import { useUpdateGroup } from "../hooks/useUpdateGroup";
import { updateGroupSchema } from "../constants/validations";
import type { UpdateGroupFormValues } from "../constants/validations";
import type { Group } from "../types/index";

interface EditGroupModalProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditGroupModal({
  group,
  open,
  onOpenChange,
}: EditGroupModalProps) {
  const { t } = useTranslation("groups");

  const methods = useForm<UpdateGroupFormValues>({
    resolver: zodResolver(updateGroupSchema),
    defaultValues: {
      name: group.name,
      description: group.description ?? "",
    },
  });

  const { mutate: update, isPending } = useUpdateGroup(() => {
    onOpenChange(false);
  });

  useEffect(() => {
    if (open) {
      methods.reset({
        name: group.name,
        description: group.description ?? "",
      });
    }
  }, [open, group, methods]);

  function onSubmit(values: UpdateGroupFormValues) {
    update({
      id: group.id,
      payload: {
        name: values.name,
        description: values.description || undefined,
      },
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("groups:editModal.title")}</DialogTitle>
          <DialogDescription>
            {t("groups:editModal.description")}
          </DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form
            id="edit-group-form"
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4 py-2"
            noValidate
          >
            <InputField<UpdateGroupFormValues>
              name="name"
              label={t("groups:createModal.name")}
              placeholder={t("groups:createModal.namePlaceholder")}
              required
            />

            <TextareaField<UpdateGroupFormValues>
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
            form="edit-group-form"
            disabled={isPending}
            className="min-w-24"
          >
            {isPending
              ? t("groups:editModal.saving")
              : t("groups:editModal.submit")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
