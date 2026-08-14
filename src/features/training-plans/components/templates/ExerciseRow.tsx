import { useState } from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  MdUnfoldMore,
  MdCheck,
  MdDeleteOutline,
  MdErrorOutline,
  MdKeyboardArrowUp,
  MdKeyboardArrowDown,
  MdDragIndicator,
  MdFitnessCenter,
} from "react-icons/md";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LabelField } from "@/components/fields/LabelField";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useExercisesLookup } from "@/features/lookups/hooks/useExercisesLookup";
import type { ExercisesStepFormValues } from "../../constants/validations";

const INTENSITY_OPTIONS = [
  {
    value: 1,
    label: "Low",
    activeClass:
      "bg-emerald-500/20 text-emerald-500 dark:text-emerald-400 border border-emerald-500/40 font-semibold shadow-2xs",
  },
  {
    value: 2,
    label: "Medium",
    activeClass:
      "bg-amber-500/20 text-amber-500 dark:text-amber-400 border border-amber-500/40 font-semibold shadow-2xs",
  },
  {
    value: 3,
    label: "High",
    activeClass:
      "bg-rose-500/20 text-rose-500 dark:text-rose-400 border border-rose-500/40 font-semibold shadow-2xs",
  },
];

interface ExerciseRowProps {
  index: number;
  total: number;
  dragHandleProps?: Record<string, any> | null;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

export function ExerciseRow({
  index,
  total,
  dragHandleProps,
  onRemove,
  onMoveUp,
  onMoveDown,
}: ExerciseRowProps) {
  const {
    control,
    register,
    formState: { errors },
    watch,
  } = useFormContext<ExercisesStepFormValues>();

  const { data: lookupRes, isLoading } = useExercisesLookup();
  const exercises = lookupRes?.data ?? [];
  const [open, setOpen] = useState(false);

  const selectedId = watch(`exercises.${index}.exerciseId`);
  const selectedExercise = exercises.find((e) => e.id === selectedId);

  const rowErrors = errors.exercises?.[index];

  return (
    <div className="flex flex-col gap-3.5 p-4 rounded-xl border border-border/80 bg-card hover:border-primary/30 transition-all duration-200 shadow-2xs group relative overflow-hidden">
      {/* Accent left indicator */}
      <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary/40 group-hover:bg-primary transition-colors" />

      {/* Card Header Bar */}
      <div className="flex items-center justify-between ps-2 pb-2.5 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div
            {...(dragHandleProps ?? {})}
            className="cursor-grab active:cursor-grabbing p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/80 transition-colors touch-none"
            title="Drag to reorder"
          >
            <MdDragIndicator className="size-4" />
          </div>

          <Badge
            variant="secondary"
            className="text-[11px] font-semibold px-2 py-0.5 bg-primary/10 text-primary border-primary/20"
          >
            #{index + 1}
          </Badge>

          <span className="text-xs font-semibold text-foreground flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-xs">
            <MdFitnessCenter className="size-3.5 text-muted-foreground shrink-0" />
            {selectedExercise?.title ?? `Exercise ${index + 1}`}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === 0}
            onClick={onMoveUp}
            className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-20"
            title="Move up"
          >
            <MdKeyboardArrowUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            disabled={index === total - 1}
            onClick={onMoveDown}
            className="size-7 text-muted-foreground hover:text-foreground disabled:opacity-20"
            title="Move down"
          >
            <MdKeyboardArrowDown className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onRemove}
            className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10 ms-1"
            aria-label="Remove exercise"
            title="Remove exercise"
          >
            <MdDeleteOutline className="size-4" />
          </Button>
        </div>
      </div>

      {/* Card Content Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 items-start ps-2">
        {/* Exercise Select */}
        <div className="sm:col-span-4 h-full">
          <Controller
            name={`exercises.${index}.exerciseId`}
            control={control}
            render={({ field }) => {
              const selected = exercises.find((e) => e.id === field.value);
              return (
                <LabelField
                  htmlFor={`exercises.${index}.exerciseId`}
                  label="Exercise"
                  className="h-full"
                >
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger
                      id={`exercises.${index}.exerciseId`}
                      type="button"
                      className={cn(
                        "flex h-9 w-full items-center mt-auto justify-between rounded-lg border border-input bg-background px-3 text-xs font-medium transition-colors",
                        "hover:border-ring/50 focus:outline-none focus:ring-2 focus:ring-primary/40",
                        !selected && "text-muted-foreground",
                        rowErrors?.exerciseId && "border-destructive",
                      )}
                    >
                      <span className="truncate text-start">
                        {selected?.title ?? "Select exercise..."}
                      </span>
                      <MdUnfoldMore className="ms-2 size-4 shrink-0 text-muted-foreground" />
                    </PopoverTrigger>
                    <PopoverContent className="w-72 p-0" align="start">
                      <Command>
                        <CommandInput
                          placeholder="Search exercises..."
                          className="h-9 text-xs"
                        />
                        <CommandList>
                          <CommandEmpty className="py-2.5 text-xs text-center text-muted-foreground">
                            {isLoading ? "Loading..." : "No exercises found."}
                          </CommandEmpty>
                          <CommandGroup>
                            {exercises.map((ex) => (
                              <CommandItem
                                key={ex.id}
                                value={String(ex.id)}
                                onSelect={() => {
                                  field.onChange(ex.id);
                                  setOpen(false);
                                }}
                                className="flex items-center justify-between text-xs cursor-pointer"
                              >
                                {ex.title}
                                {field.value === ex.id && (
                                  <MdCheck className="size-4 text-primary" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {rowErrors?.exerciseId && (
                    <div className="flex items-center gap-1 text-[10px] text-destructive mt-1">
                      <MdErrorOutline className="size-3" />
                      <span>Exercise is required</span>
                    </div>
                  )}
                </LabelField>
              );
            }}
          />
        </div>

        {/* Sets */}
        <div className="col-span-3 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.sets`}
            label="Sets"
            className="h-full "
          >
            <Input
              id={`exercises.${index}.sets`}
              type="number"
              min={1}
              placeholder="3"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.sets`, { valueAsNumber: true })}
            />
          </LabelField>
        </div>

        {/* Reps */}
        <div className="col-span-3 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.reps`}
            label="Reps"
            className="h-full "
          >
            <Input
              id={`exercises.${index}.reps`}
              type="number"
              min={0}
              placeholder="10"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.reps`, { valueAsNumber: true })}
            />
          </LabelField>
        </div>

        {/* Duration (Min) */}
        <div className="col-span-3 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.duration`}
            label="Duration (min)"
            className="h-full "
          >
            <Input
              id={`exercises.${index}.duration`}
              type="number"
              min={0}
              placeholder="0"
              className="h-9 text-xs mt-auto"
              {...register(`exercises.${index}.duration`, {
                valueAsNumber: true,
              })}
            />
          </LabelField>
        </div>

        {/* Rest (Sec) */}
        <div className="col-span-3 sm:col-span-2 h-full">
          <LabelField
            htmlFor={`exercises.${index}.restSeconds`}
            label="Rest (sec)"
            className="h-full mt-auto"
          >
            <Input
              id={`exercises.${index}.restSeconds`}
              type="number"
              min={0}
              placeholder="30"
              className="h-9 text-xs"
              {...register(`exercises.${index}.restSeconds`, {
                valueAsNumber: true,
              })}
            />
          </LabelField>
        </div>

        {/* Segmented Intensity Control (Low = 1, Medium = 2, High = 3) */}
        <div className="sm:col-span-5">
          <Controller
            name={`exercises.${index}.intensity`}
            control={control}
            render={({ field }) => {
              const currentVal = field.value ?? 2;
              return (
                <LabelField label="Intensity">
                  <div className="flex items-center gap-1 p-1 rounded-lg border border-input bg-background h-9">
                    {INTENSITY_OPTIONS.map((opt) => {
                      const isSelected = currentVal === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "flex-1 h-7 rounded-md text-xs font-medium transition-all duration-150 flex items-center justify-center cursor-pointer",
                            isSelected
                              ? opt.activeClass
                              : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
                          )}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </LabelField>
              );
            }}
          />
        </div>

        {/* Notes / Instructions */}
        <div className="sm:col-span-7">
          <LabelField
            htmlFor={`exercises.${index}.notes`}
            label="Notes / Instructions"
          >
            <Textarea
              id={`exercises.${index}.notes`}
              rows={2}
              placeholder="Exercise instructions or reminders (optional)..."
              className="min-h-14 text-xs resize-y bg-background"
              {...register(`exercises.${index}.notes`)}
            />
          </LabelField>
        </div>
      </div>
    </div>
  );
}
