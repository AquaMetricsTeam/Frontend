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
import { TextareaField } from "@/components/fields/TextareaField";
import { useUpdateCoachNote } from "../hooks/useUpdateCoachNote";
import {
  updateCoachNoteSchema,
  type UpdateCoachNoteFormValues,
} from "../constants/validations";
import type { CoachNote } from "../types/index";

interface EditCoachNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  note: CoachNote | null;
}

export function EditCoachNoteModal({
  open,
  onOpenChange,
  note,
}: EditCoachNoteModalProps) {
  const { t } = useTranslation("coachNotes");

  const methods = useForm<UpdateCoachNoteFormValues>({
    resolver: zodResolver(updateCoachNoteSchema),
    defaultValues: {
      content: note?.content ?? "",
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (open && note) {
      reset({
        content: note.content,
      });
    }
  }, [open, note, reset]);

  const updateMutation = useUpdateCoachNote(() => {
    onOpenChange(false);
  });

  function onSubmit(values: UpdateCoachNoteFormValues) {
    if (!note) return;
    updateMutation.mutate({
      noteId: note.id,
      content: values.content,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("modal.editTitle")}</DialogTitle>
          <DialogDescription>{t("modal.editDescription")}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <TextareaField
              name="content"
              label={t("modal.contentLabel")}
              placeholder={t("modal.contentPlaceholder")}
              rows={4}
              required
            />

            <DialogFooter className="gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={updateMutation.isPending}
              >
                {t("modal.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={updateMutation.isPending}
                className="cursor-pointer"
              >
                {updateMutation.isPending
                  ? t("modal.updating")
                  : t("modal.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
