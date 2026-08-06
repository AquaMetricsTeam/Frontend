import { useEffect } from "react";
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
            label="Plan Title"
            placeholder="e.g. Sprint Development Week 1"
            required
          />
          <TextareaField<PlanInfoFormValues>
            name="description"
            label="Objectives / Description"
            placeholder="Describe the goals and focus of this training plan..."
            rows={4}
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-border">
          <Button type="submit" className="min-w-32">
            Next: Add Exercises
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
