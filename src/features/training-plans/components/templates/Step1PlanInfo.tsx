import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { Button } from "@/components/ui/button";
import { planInfoSchema, type PlanInfoFormValues } from "../../constants/validations";

interface Step1PlanInfoProps {
  defaultValues?: Partial<PlanInfoFormValues>;
  onNext: (data: PlanInfoFormValues) => void;
}

export function Step1PlanInfo({ defaultValues, onNext }: Step1PlanInfoProps) {
  const { t } = useTranslation("training");
  const form = useForm<PlanInfoFormValues>({
    resolver: zodResolver(planInfoSchema),
    defaultValues: { title: "", description: "", ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues) {
      form.reset({
        title: defaultValues.title ?? "",
        description: defaultValues.description ?? "",
      });
    }
  }, [defaultValues, form]);

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="flex flex-col gap-5 flex-1 pt-4"
      >
        <div className="flex flex-col gap-4 flex-1">
          <InputField<PlanInfoFormValues>
            name="title"
            label={t("wizard.step1.titleLabel")}
            placeholder={t("wizard.step1.titlePlaceholder")}
            required
          />
          <TextareaField<PlanInfoFormValues>
            name="description"
            label={t("wizard.step1.descriptionLabel")}
            placeholder={t("wizard.step1.descriptionPlaceholder")}
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" className="min-w-32 cursor-pointer">
            {t("wizard.step1.next")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
