import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { SelectField } from "@/components/fields/SelectField";
import { useTrainingPlansLookup } from "@/features/lookups/hooks/useTrainingPlansLookup";
import { useCreateTrainingSession } from "../../hooks/useCreateTrainingSession";
import {
  sessionSchema,
  type SessionFormValues,
} from "../../constants/validations";

interface CreateSessionSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSessionSheet({
  open,
  onOpenChange,
}: CreateSessionSheetProps) {
  const { t } = useTranslation("training");
  const form = useForm<SessionFormValues>({
    resolver: zodResolver(sessionSchema),
    defaultValues: {
      title: "",
      description: "",
      trainingPlanId: 0,
      sessionDate: "",
      startTime: "",
      endTime: "",
      location: "",
      notes: "",
    },
  });

  const { data: plansRes } = useTrainingPlansLookup(open);
  const plans = plansRes?.data ?? [];
  const planOptions = plans.map((p) => ({
    value: String(p.id),
    label: p.title,
  }));

  const createMutation = useCreateTrainingSession(() => {
    onOpenChange(false);
    form.reset();
  });

  function handleSubmit(data: SessionFormValues) {
    createMutation.mutate(data);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-base font-semibold">
            {t("sessions.form.title")}
          </SheetTitle>
        </SheetHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4"
          >
            <InputField<SessionFormValues>
              name="title"
              label={t("sessions.form.titleLabel")}
              placeholder={t("sessions.form.titlePlaceholder")}
              required
            />

            <SelectField<SessionFormValues>
              name="trainingPlanId"
              label={t("sessions.form.planLabel")}
              options={planOptions}
              placeholder={t("sessions.form.planPlaceholder")}
              required
            />

            <div className="grid grid-cols-2 gap-3">
              <InputField<SessionFormValues>
                name="sessionDate"
                label={t("sessions.form.dateLabel")}
                type="date"
                required
              />
              <InputField<SessionFormValues>
                name="location"
                label={t("sessions.form.locationLabel")}
                placeholder={t("sessions.form.locationPlaceholder")}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <InputField<SessionFormValues>
                name="startTime"
                label={t("sessions.form.startTime")}
                type="time"
                required
              />
              <InputField<SessionFormValues>
                name="endTime"
                label={t("sessions.form.endTime")}
                type="time"
                required
              />
            </div>

            <TextareaField<SessionFormValues>
              name="notes"
              label={t("sessions.form.notes")}
              placeholder={t("sessions.form.notesPlaceholder")}
              rows={3}
            />

            <div className="pt-4 border-t border-border mt-auto">
              <Button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full cursor-pointer"
              >
                {createMutation.isPending
                  ? t("sessions.form.submitting")
                  : t("sessions.form.submit")}
              </Button>
            </div>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}
