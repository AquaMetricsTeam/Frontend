import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { MdDeleteOutline, MdFitnessCenter } from "react-icons/md";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import type { PlanExercise } from "@/features/training-plans/types";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  {
    value: 1,
    label: "Completed",
    className:
      "bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400",
  },
  {
    value: 2,
    label: "Partial",
    className:
      "bg-amber-500/10 text-amber-600 border-amber-500/20 dark:text-amber-400",
  },
  {
    value: 3,
    label: "Skipped",
    className:
      "bg-rose-500/10 text-rose-600 border-rose-500/20 dark:text-rose-400",
  },
  {
    value: 4,
    label: "Modified",
    className:
      "bg-blue-500/10 text-blue-600 border-blue-500/20 dark:text-blue-400",
  },
] as const;

interface ExercisePerformanceCardProps {
  index: number;
  totalExercises: number;
  planExercises: PlanExercise[];
  prefix?: string;
  onRemove: () => void;
}

export function ExercisePerformanceCard({
  index,
  totalExercises,
  planExercises,
  prefix = `exercisePerformances.${index}`,
  onRemove,
}: ExercisePerformanceCardProps) {
  const { control, setValue, formState: { errors } } = useFormContext();

  const getFieldName = (field: string) =>
    prefix ? `${prefix}.${field}` : field;

  const setFieldValue = (field: string, val: unknown) =>
    setValue(getFieldName(field), val, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });

  const currentStatus = useWatch({ control, name: getFieldName("status") });
  const currentPlanExerciseId = useWatch({
    control,
    name: getFieldName("planExerciseId"),
  });
  const rpeVal = useWatch({ control, name: getFieldName("rpe") });

  const getExerciseId = (ex: PlanExercise) =>
    ex.planExerciseId ?? ex.id ?? ex.exerciseId;

  const exerciseOptions = planExercises.map((ex) => {
    const id = getExerciseId(ex);
    return {
      value: String(id),
      label: ex.exerciseName ?? `Exercise #${ex.exerciseId ?? id}`,
    };
  });

  const selectedExercise = planExercises.find(
    (ex) => getExerciseId(ex) === Number(currentPlanExerciseId),
  );

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-xs font-bold bg-primary/10 text-primary border-primary/20 gap-1.5"
          >
            <MdFitnessCenter className="size-3" />
            Exercise {index + 1}
          </Badge>
          {selectedExercise && (
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
              <span>
                {selectedExercise.sets}×{selectedExercise.reps} planned
              </span>
              {(selectedExercise.duration || (selectedExercise as any).durationMinutes) ? (
                <>
                  <span>•</span>
                  <span>
                    {selectedExercise.duration || (selectedExercise as any).durationMinutes} min planned
                  </span>
                </>
              ) : null}
              {selectedExercise.restSeconds ? (
                <>
                  <span>•</span>
                  <span>{selectedExercise.restSeconds}s rest</span>
                </>
              ) : null}
            </span>
          )}
        </div>

        {totalExercises > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 cursor-pointer"
          >
            <MdDeleteOutline className="size-4" />
            Remove
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {/* Plan Exercise Selector */}
        <ComboboxSelect
          label="Plan Exercise *"
          placeholder={
            planExercises.length === 0
              ? "Select a session first..."
              : "Select exercise..."
          }
          searchPlaceholder="Search exercise..."
          emptyMessage="No exercises in this plan."
          options={exerciseOptions}
          value={currentPlanExerciseId ? String(currentPlanExerciseId) : ""}
          onValueChange={(val) => {
            const chosenId = Number(val);
            setFieldValue("planExerciseId", chosenId);
            const found = planExercises.find((ex) => getExerciseId(ex) === chosenId);
            if (found) {
              if (found.sets !== undefined && found.sets !== null) {
                setFieldValue("completedSets", found.sets);
              }
              if (found.reps !== undefined && found.reps !== null) {
                setFieldValue("completedReps", found.reps);
              }
              if (found.duration !== undefined && found.duration !== null) {
                setFieldValue("completedDuration", found.duration);
              }
              if (found.notes) {
                setFieldValue("coachComment", found.notes);
              }
            }
          }}
          hasValue={!!currentPlanExerciseId && Number(currentPlanExerciseId) > 0}
          disabled={planExercises.length === 0}
          error={(errors.exercisePerformances as any)?.[index]?.planExerciseId?.message}
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            name={getFieldName("completedSets") as never}
            label="Completed Sets *"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
          <InputField
            name={getFieldName("completedReps") as never}
            label="Completed Reps *"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
          <InputField
            name={getFieldName("weightUsed") as never}
            label="Weight Used (kg)"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
          <InputField
            name={getFieldName("completedDuration") as never}
            label="Duration (min)"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
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
                onClick={() => setFieldValue("status", opt.value)}
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
        <div className="space-y-2">
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
            onChange={(e) => setFieldValue("rpe", Number(e.target.value))}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
          />
          <p className="text-[11px] text-muted-foreground">
            1 = Very light effort · 10 = Maximum exertion
          </p>
        </div>

        {/* Coach Comment */}
        <TextareaField
          name={getFieldName("coachComment") as never}
          label="Coach Comment"
          placeholder="Optional note…"
          rows={2}
          textareaClassName="text-xs resize-none"
        />
      </div>
    </div>
  );
}
