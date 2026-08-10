import { useEffect } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
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
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useCreateCoachNote } from "../hooks/useCreateCoachNote";
import {
  createCoachNoteSchema,
  type CreateCoachNoteFormValues,
} from "../constants/validations";

interface CreateCoachNoteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fixedAthleteId?: string;
  fixedAthleteName?: string;
  athletesOptions?: { value: string; label: string }[];
}

export function CreateCoachNoteModal({
  open,
  onOpenChange,
  fixedAthleteId,
  fixedAthleteName,
  athletesOptions = [],
}: CreateCoachNoteModalProps) {
  const { t } = useTranslation("coachNotes");

  const methods = useForm<CreateCoachNoteFormValues>({
    resolver: zodResolver(createCoachNoteSchema),
    defaultValues: {
      athleteId: fixedAthleteId ?? "",
      content: "",
    },
  });

  const { reset, handleSubmit, control } = methods;

  useEffect(() => {
    if (open) {
      reset({
        athleteId: fixedAthleteId ?? "",
        content: "",
      });
    }
  }, [open, fixedAthleteId, reset]);

  const createMutation = useCreateCoachNote(() => {
    onOpenChange(false);
  });

  function onSubmit(values: CreateCoachNoteFormValues) {
    createMutation.mutate({
      athleteId: values.athleteId,
      content: values.content,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{t("modal.createTitle")}</DialogTitle>
          <DialogDescription>{t("modal.createDescription")}</DialogDescription>
        </DialogHeader>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Athlete select if not fixed */}
            {fixedAthleteId ? (
              <div className="rounded-lg border border-border bg-muted/40 p-3">
                <span className="text-xs font-medium text-muted-foreground block mb-0.5">
                  {t("modal.selectAthleteLabel")}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {fixedAthleteName ?? fixedAthleteId}
                </span>
              </div>
            ) : (
              <Controller
                name="athleteId"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <ComboboxSelect
                    label={t("modal.selectAthleteLabel")}
                    placeholder={t("modal.selectAthletePlaceholder")}
                    options={athletesOptions}
                    value={field.value}
                    onValueChange={field.onChange}
                    error={error?.message ? t(error.message) : undefined}
                  />
                )}
              />
            )}

            {/* Note content textarea */}
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
                disabled={createMutation.isPending}
              >
                {t("modal.cancel")}
              </Button>
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="cursor-pointer"
              >
                {createMutation.isPending
                  ? t("modal.creating")
                  : t("modal.save")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
