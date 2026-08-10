import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MdEdit } from "react-icons/md";
import { useUpdateTrainingRecord } from "@/features/training-record/hooks/useUpdateTrainingRecord";
import { TRAINING_RECORD_KEYS } from "@/features/training-record/constants/queryKeys";
import { useQueryClient } from "@tanstack/react-query";
import type { TrainingRecordResponse } from "@/features/training-record/types";
import { toast } from "sonner";

const editSchema = z.object({
  performanceRating: z.number().int().min(1).max(10),
  fatigueLevel: z.number().int().min(1).max(10),
  sessionCompleted: z.boolean(),
  injuryOccurred: z.boolean(),
  overallComment: z.string().optional().nullable(),
});

type EditFormValues = z.infer<typeof editSchema>;

interface EditFitnessRecordModalProps {
  record: TrainingRecordResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditFitnessRecordModal({
  record,
  open,
  onOpenChange,
}: EditFitnessRecordModalProps) {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateTrainingRecord(record?.id ?? 0);

  const { handleSubmit, reset, watch, setValue, register } =
    useForm<EditFormValues>({
      resolver: zodResolver(editSchema),
      mode: "onSubmit",
    });

  useEffect(() => {
    if (record) {
      reset({
        performanceRating: record.performanceRating,
        fatigueLevel: record.fatigueLevel,
        sessionCompleted: record.sessionCompleted,
        injuryOccurred: record.injuryOccurred,
        overallComment: "",
      });
    }
  }, [record, reset]);

  if (!record) return null;

  function onSubmit(values: EditFormValues) {
    updateMutation.mutate(
      {
        ...values,
        overallComment: values.overallComment?.trim() || null,
        exercisePerformances: [],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: TRAINING_RECORD_KEYS.all });
          toast.success("Training record updated successfully");
          onOpenChange(false);
        },
        onError: (err: { message?: string }) => {
          toast.error(err?.message ?? "Failed to update training record");
        },
      },
    );
  }

  const performanceRating = watch("performanceRating");
  const fatigueLevel = watch("fatigueLevel");
  const sessionCompleted = watch("sessionCompleted");
  const injuryOccurred = watch("injuryOccurred");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <MdEdit className="size-5 text-amber-500" />
            <DialogTitle className="text-base font-bold">
              Edit Record — #{record.id}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Performance Rating slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-semibold text-foreground text-xs">
                Performance Rating
              </Label>
              <Badge
                variant="secondary"
                className="text-xs bg-primary/10 text-primary border-primary/20"
              >
                {performanceRating} / 10
              </Badge>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={performanceRating}
              onChange={(e) =>
                setValue("performanceRating", Number(e.target.value))
              }
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
            />
          </div>

          {/* Fatigue Level slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-semibold text-foreground text-xs">
                Fatigue Level
              </Label>
              <Badge
                variant="secondary"
                className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20"
              >
                {fatigueLevel} / 10
              </Badge>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={fatigueLevel}
              onChange={(e) =>
                setValue("fatigueLevel", Number(e.target.value))
              }
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500 bg-muted"
            />
          </div>

          {/* Pill toggles */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setValue("sessionCompleted", !sessionCompleted)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                sessionCompleted
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                  : "bg-muted/30 text-muted-foreground border-border"
              }`}
            >
              {sessionCompleted ? "✓ Session Completed" : "Session Incomplete"}
            </button>

            <button
              type="button"
              onClick={() => setValue("injuryOccurred", !injuryOccurred)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                injuryOccurred
                  ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                  : "bg-muted/30 text-muted-foreground border-border"
              }`}
            >
              {injuryOccurred ? "⚠ Injury Occurred" : "No Injury"}
            </button>
          </div>

          {/* Overall Comment */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Overall Comment
            </Label>
            <Textarea
              {...register("overallComment")}
              placeholder="Optional coach comment..."
              className="resize-none text-sm min-h-[80px]"
            />
          </div>

          <DialogFooter className="pt-2 border-t border-border flex flex-row items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 text-xs cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={updateMutation.isPending}
              className="h-8 text-xs cursor-pointer"
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
