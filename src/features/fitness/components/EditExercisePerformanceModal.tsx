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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { MdEdit, MdFitnessCenter } from "react-icons/md";
import { useUpdateTrainingRecord } from "@/features/training-record/hooks/useUpdateTrainingRecord";
import { TRAINING_RECORD_KEYS } from "@/features/training-record/constants/queryKeys";
import { EXERCISE_PERFORMANCE_KEYS } from "@/features/fitness/hooks/useExercisePerformancesByTrainingRecord";
import { useQueryClient } from "@tanstack/react-query";
import type {
  TrainingRecordResponse,
  ExercisePerformanceResponse,
} from "@/features/training-record/types";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const STATUS_OPTIONS = [
  {
    value: 1,
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
  },
  {
    value: 2,
    label: "Partial",
    className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
  },
  {
    value: 3,
    label: "Skipped",
    className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
  },
  {
    value: 4,
    label: "Modified",
    className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  },
] as const;

const editExerciseSchema = z.object({
  completedSets: z.number().int().min(0),
  completedReps: z.number().int().min(0),
  weightUsed: z.number().nullable().optional(),
  completedDuration: z.number().nullable().optional(),
  rpe: z.number().min(1).max(10).nullable().optional(),
  status: z.number().int().min(1).max(4),
  coachComment: z.string().nullable().optional(),
});

type EditExerciseFormValues = z.infer<typeof editExerciseSchema>;

interface EditExercisePerformanceModalProps {
  exercisePerformance: ExercisePerformanceResponse | null;
  parentRecord: TrainingRecordResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditExercisePerformanceModal({
  exercisePerformance,
  parentRecord,
  open,
  onOpenChange,
}: EditExercisePerformanceModalProps) {
  const queryClient = useQueryClient();
  const updateMutation = useUpdateTrainingRecord(parentRecord?.id ?? 0);

  const { handleSubmit, reset, watch, setValue, register, formState: { errors } } =
    useForm<EditExerciseFormValues>({
      resolver: zodResolver(editExerciseSchema),
      mode: "onSubmit",
    });

  useEffect(() => {
    if (exercisePerformance) {
      reset({
        completedSets: exercisePerformance.completedSets ?? 0,
        completedReps: exercisePerformance.completedReps ?? 0,
        weightUsed: exercisePerformance.weightUsed ?? null,
        completedDuration: exercisePerformance.completedDuration ?? null,
        rpe: exercisePerformance.rpe ?? 5,
        status: exercisePerformance.status ?? 1,
        coachComment: exercisePerformance.coachComment ?? "",
      });
    }
  }, [exercisePerformance, reset]);

  if (!exercisePerformance || !parentRecord) return null;

  function onSubmit(values: EditExerciseFormValues) {
    if (!exercisePerformance || !parentRecord) return;

    updateMutation.mutate(
      {
        performanceRating: parentRecord.performanceRating,
        fatigueLevel: parentRecord.fatigueLevel,
        sessionCompleted: parentRecord.sessionCompleted,
        injuryOccurred: parentRecord.injuryOccurred,
        overallComment: null,
        exercisePerformances: [
          {
            planExerciseId: exercisePerformance.planExerciseId,
            completedSets: values.completedSets,
            completedReps: values.completedReps,
            weightUsed: values.weightUsed ?? null,
            completedDuration: values.completedDuration ?? null,
            rpe: values.rpe ?? null,
            status: values.status,
            coachComment: values.coachComment?.trim() || null,
          },
        ],
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: TRAINING_RECORD_KEYS.all });
          queryClient.invalidateQueries({ queryKey: EXERCISE_PERFORMANCE_KEYS.all });
          toast.success("Exercise performance updated successfully");
          onOpenChange(false);
        },
        onError: (err: { message?: string }) => {
          toast.error(err?.message ?? "Failed to update exercise performance");
        },
      },
    );
  }

  const currentStatus = watch("status");
  const rpeVal = watch("rpe");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <MdFitnessCenter className="size-5 text-amber-500" />
            <DialogTitle className="text-base font-bold">
              Edit Exercise — {exercisePerformance.exerciseTitle || `Exercise #${exercisePerformance.planExerciseId}`}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-2">
          {/* Sets & Reps */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Completed Sets *
              </Label>
              <Input
                type="number"
                min={0}
                {...register("completedSets", { valueAsNumber: true })}
                className="h-9 text-xs font-semibold"
              />
              {errors.completedSets && (
                <p className="text-[11px] text-destructive">{errors.completedSets.message}</p>
              )}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Completed Reps *
              </Label>
              <Input
                type="number"
                min={0}
                {...register("completedReps", { valueAsNumber: true })}
                className="h-9 text-xs font-semibold"
              />
              {errors.completedReps && (
                <p className="text-[11px] text-destructive">{errors.completedReps.message}</p>
              )}
            </div>
          </div>

          {/* Weight & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Weight Used (kg)
              </Label>
              <Input
                type="number"
                step="0.1"
                min={0}
                {...register("weightUsed", {
                  setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                })}
                className="h-9 text-xs font-semibold"
              />
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-semibold text-muted-foreground uppercase">
                Duration (min)
              </Label>
              <Input
                type="number"
                min={0}
                {...register("completedDuration", {
                  setValueAs: (v) => (v === "" || v === null ? null : Number(v)),
                })}
                className="h-9 text-xs font-semibold"
              />
            </div>
          </div>

          {/* Status Chips */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-foreground">
              Status *
            </Label>
            <div className="flex flex-wrap gap-1.5">
              {STATUS_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("status", opt.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer",
                    currentStatus === opt.value
                      ? opt.className + " shadow-xs"
                      : "border-border bg-muted/30 text-muted-foreground hover:bg-muted hover:text-foreground",
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* RPE Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <Label className="font-semibold text-foreground">
                RPE (Exertion)
              </Label>
              <Badge
                variant="secondary"
                className="font-bold text-xs bg-primary/10 text-primary border-primary/20"
              >
                {rpeVal ? `${rpeVal} / 10` : "Not rated"}
              </Badge>
            </div>
            <input
              type="range"
              min={1}
              max={10}
              value={rpeVal ?? 5}
              onChange={(e) => setValue("rpe", Number(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
            />
          </div>

          {/* Coach Comment */}
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
              Coach Comment
            </Label>
            <Textarea
              {...register("coachComment")}
              placeholder="Optional coach note..."
              className="resize-none text-sm min-h-[70px]"
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
