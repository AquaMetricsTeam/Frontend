import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { MdAdd, MdTimer } from "react-icons/md";
import {
  DragDropContext,
  Droppable,
  Draggable,
  type DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { ExerciseRow } from "./ExerciseRow";
import {
  exercisesStepSchema,
  type ExercisesStepFormValues,
} from "../../constants/validations";
import type { PlanExerciseFormValues } from "../../constants/validations";

const DEFAULT_EXERCISE: PlanExerciseFormValues = {
  exerciseId: 0,
  sets: 3,
  reps: 10,
  duration: 0,
  restSeconds: 30,
  restAfter: 0,
  intensity: 2,
  notes: "",
};

interface Step2ExercisesProps {
  defaultValues?: Partial<ExercisesStepFormValues>;
  onNext: (data: ExercisesStepFormValues) => void;
  onBack: () => void;
}

export function Step2Exercises({
  defaultValues,
  onNext,
  onBack,
}: Step2ExercisesProps) {
  const { t } = useTranslation("training");
  const form = useForm<ExercisesStepFormValues>({
    resolver: zodResolver(exercisesStepSchema),
    defaultValues: { exercises: [DEFAULT_EXERCISE], ...defaultValues },
  });

  useEffect(() => {
    if (defaultValues?.exercises && defaultValues.exercises.length > 0) {
      form.reset({ exercises: defaultValues.exercises });
    }
  }, [defaultValues, form]);

  const { fields, append, remove, move } = useFieldArray({
    control: form.control,
    name: "exercises",
  });

  const exercises = form.watch("exercises");
  const totalMinutes = exercises.reduce(
    (sum, ex) => sum + (ex?.duration || 0),
    0,
  );

  function handleOnDragEnd(result: DropResult) {
    if (!result.destination) return;
    const sourceIdx = result.source.index;
    const destIdx = result.destination.index;
    if (sourceIdx !== destIdx) {
      move(sourceIdx, destIdx);
    }
  }

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(onNext)}
        className="flex flex-col gap-4 h-full flex-1 pt-4"
      >
        {/* Duration summary */}
        <div className="flex items-center justify-between">
          <p className="text-xs font-medium text-muted-foreground">
            {fields.length === 1
              ? t("wizard.step2.exercisesAdded", {
                  count: fields.length,
                  defaultValue: "1 exercise added",
                })
              : t("wizard.step2.exercisesAdded_plural", {
                  count: fields.length,
                  defaultValue: `${fields.length} exercises added`,
                })}{" "}
            {t("wizard.step2.dragToReorder", {
              defaultValue: "• Drag to reorder",
            })}
          </p>
          <Badge variant="secondary" className="gap-1.5 text-xs">
            <MdTimer className="size-3.5" />~{totalMinutes}{" "}
            {t("wizard.step2.minutesEstimated", {
              defaultValue: "min estimated",
            })}
          </Badge>
        </div>

        {/* Drag & Drop Exercise cards list */}
        <DragDropContext onDragEnd={handleOnDragEnd}>
          <Droppable droppableId="exercises-droppable-list">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="flex flex-col gap-3 flex-1 overflow-y-auto  pr-1"
              >
                {fields.map((field, index) => (
                  <Draggable
                    key={field.id}
                    draggableId={field.id}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={cn(
                          "transition-shadow duration-150 rounded-xl",
                          snapshot.isDragging &&
                            "shadow-lg ring-2 ring-primary/40 z-50 bg-card",
                        )}
                      >
                        <ExerciseRow
                          index={index}
                          total={fields.length}
                          dragHandleProps={provided.dragHandleProps}
                          onRemove={() => remove(index)}
                          onMoveUp={() => move(index, index - 1)}
                          onMoveDown={() => move(index, index + 1)}
                        />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append(DEFAULT_EXERCISE)}
          className="self-start gap-1.5 cursor-pointer"
        >
          <MdAdd className="size-4" />
          {t("wizard.step2.addExercise")}
        </Button>

        {form.formState.errors.exercises?.root?.message && (
          <p className="text-xs text-destructive">
            {form.formState.errors.exercises.root.message}
          </p>
        )}

        <div className="flex justify-between pt-4 border-t border-border mt-auto">
          <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">
            {t("wizard.step2.back")}
          </Button>
          <Button type="submit" className="min-w-32 cursor-pointer">
            {t("wizard.step2.next", { defaultValue: "Next" })}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}
