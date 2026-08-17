import { useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MdEdit } from "react-icons/md";
import { SwimmingDrillForm } from "./SwimmingDrillForm";
import { useUpdateSwimmingPerformance } from "../hooks/useUpdateSwimmingPerformance";
import {
  swimmingDrillSchema,
  type SwimmingDrillFormValues,
} from "../constants/validations";
import type {
  SwimmingPerformance,
  StrokeType,
  PerformanceStatus,
  PerformanceGrade,
} from "../types";

interface EditSwimmingPerformanceModalProps {
  performance: SwimmingPerformance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditSwimmingPerformanceModal({
  performance,
  open,
  onOpenChange,
}: EditSwimmingPerformanceModalProps) {
  const { t } = useTranslation("swimming");
  const updateMutation = useUpdateSwimmingPerformance(performance?.id ?? 0);

  const form = useForm<SwimmingDrillFormValues>({
    resolver: zodResolver(swimmingDrillSchema),
    mode: "onSubmit",
  });

  useEffect(() => {
    if (performance) {
      form.reset({
        stroke: performance.stroke,
        distanceMeters: performance.distanceMeters,
        repetitions: performance.repetitions,
        duration: performance.duration ?? null,
        restIntervalSeconds: performance.restIntervalSeconds ?? 0,
        bestRepTime: performance.bestRepTime || "00:01:00",
        averageRepTime: performance.averageRepTime || "00:01:05",
        worstRepTime: performance.worstRepTime || "00:01:10",
        technique: performance.technique,
        start: performance.start,
        turns: performance.turns,
        finish: performance.finish,
        paceConsistency: performance.paceConsistency,
        rpe: performance.rpe ?? 5,
        status: performance.status,
        coachComment: performance.coachComment ?? "",
      });
    }
  }, [performance, form]);

  if (!performance) return null;

  function onSubmit(values: SwimmingDrillFormValues) {
    updateMutation.mutate(
      {
        ...values,
        restIntervalSeconds: values.restIntervalSeconds ?? 0,
        stroke: values.stroke as StrokeType,
        status: values.status as PerformanceStatus,
        technique: values.technique as PerformanceGrade,
        start: values.start as PerformanceGrade,
        turns: values.turns as PerformanceGrade,
        finish: values.finish as PerformanceGrade,
        paceConsistency: values.paceConsistency as PerformanceGrade,
        coachComment: values.coachComment?.trim() || null,
      },
      {
        onSuccess: () => onOpenChange(false),
      },
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <MdEdit className="size-5 text-primary" />
            <DialogTitle className="text-base font-bold">
              {t("table.edit")} — #{performance.id}
            </DialogTitle>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto space-y-4 py-3"
          >
            <SwimmingDrillForm />

            <DialogFooter className="pt-2 border-t border-border flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-8 text-xs cursor-pointer"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={updateMutation.isPending}
                className="h-8 text-xs cursor-pointer"
              >
                {updateMutation.isPending
                  ? t("common.saving")
                  : t("common.saveChanges")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
