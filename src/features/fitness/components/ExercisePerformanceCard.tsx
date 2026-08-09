import { useFormContext, useWatch } from "react-hook-form";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { InputField } from "@/components/fields/InputField";
import { TextareaField } from "@/components/fields/TextareaField";
import { MdDeleteOutline, MdFitnessCenter } from "react-icons/md";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useExercisesLookup } from "@/features/lookups/hooks/useExercisesLookup";
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
  prefix?: string;
  onRemove: () => void;
}

export function ExercisePerformanceCard({
  index,
  totalExercises,
  prefix = `exercisePerformances.${index}`,
  onRemove,
}: ExercisePerformanceCardProps) {
  const { control, setValue } = useFormContext();

  const getFieldName = (field: string) =>
    prefix ? `${prefix}.${field}` : field;

  const setFieldValue = (field: string, val: any) =>
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

  const { data } = useExercisesLookup();
  const exercises = data?.data ?? [];

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-4 shadow-xs">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <Badge
          variant="secondary"
          className="text-xs font-bold bg-primary/10 text-primary border-primary/20 gap-1.5"
        >
          <MdFitnessCenter className="size-3" />
          Exercise {index + 1}
        </Badge>

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
        {/* Exercise Selector */}
        <ComboboxSelect
          label="Exercise *"
          placeholder="Select exercise..."
          searchPlaceholder="Search exercise..."
          options={exercises.map((ex) => ({
            value: String(ex.id),
            label: ex.title,
          }))}
          value={currentPlanExerciseId ? String(currentPlanExerciseId) : ""}
          onValueChange={(val) => setFieldValue("planExerciseId", Number(val))}
          hasValue={!!currentPlanExerciseId}
        />

        <div className="grid grid-cols-2 gap-3">
          <InputField
            name={getFieldName("completedSets") as any}
            label="Completed Sets *"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
          <InputField
            name={getFieldName("completedReps") as any}
            label="Completed Reps *"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
          <InputField
            name={getFieldName("weightUsed") as any}
            label="Weight Used (kg)"
            type="number"
            inputClassName="h-9 text-xs font-semibold"
          />
          <InputField
            name={getFieldName("completedDuration") as any}
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
          name={getFieldName("coachComment") as any}
          label="Coach Comment"
          placeholder="Optional note…"
          rows={2}
          textareaClassName="text-xs resize-none"
        />
      </div>
    </div>
  );
}
