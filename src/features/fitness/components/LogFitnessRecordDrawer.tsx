import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { MdAdd, MdFitnessCenter } from "react-icons/md";
import { TextareaField } from "@/components/fields/TextareaField";
import { ExercisePerformanceCard } from "./ExercisePerformanceCard";
import { InjuryFormFields } from "@/features/training-record/components/InjuryFormFields";
import { useCreateTrainingRecord } from "@/features/training-record/hooks/useCreateTrainingRecord";
import { useTrainingSessions } from "@/features/training-plans/hooks/useTrainingSessions";
import type { PerformanceStatus } from "@/features/swimming-performance/types";
import { useTrainingSession } from "@/features/training-plans/hooks/useTrainingSession";
import { useTrainingPlan } from "@/features/training-plans/hooks/useTrainingPlan";
import {
  createFitnessRecordSchema,
  type CreateFitnessRecordFormValues,
  type ExercisePerformanceFormValues,
} from "../constants/validations";

const DEFAULT_EXERCISE: ExercisePerformanceFormValues = {
  planExerciseId: 0,
  completedSets: 3,
  completedReps: 10,
  completedDuration: null,
  weightUsed: null,
  rpe: 5,
  status: 1,
  coachComment: "",
};

interface LogFitnessRecordDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSessionId?: number;
  defaultAthleteId?: string;
}

export function LogFitnessRecordDrawer({
  open,
  onOpenChange,
  defaultSessionId,
  defaultAthleteId,
}: LogFitnessRecordDrawerProps) {
  const createMutation = useCreateTrainingRecord();

  // 1. All sessions list
  const { data: sessionsRes } = useTrainingSessions({ pageSize: 100 });
  const sessions = sessionsRes?.data?.items ?? [];

  const sessionOptions = sessions.map((s) => ({
    value: String(s.id),
    label: `${s.title || "Session"} (${s.sessionDate || ""})`,
  }));

  const form = useForm<CreateFitnessRecordFormValues>({
    resolver: zodResolver(createFitnessRecordSchema),
    defaultValues: {
      athleteId: defaultAthleteId || "",
      trainingSessionId: defaultSessionId || 0,
      performanceRating: 7,
      fatigueLevel: 5,
      sessionCompleted: true,
      injuryOccurred: false,
      injuryType: null,
      injuryBodyPart: null,
      injuryComment: "",
      overallComment: "",
      exercisePerformances: [{ ...DEFAULT_EXERCISE }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "exercisePerformances",
  });

  const selectedSessionId = form.watch("trainingSessionId");

  // 2. Session detail → athletes + trainingPlanId
  const { data: sessionDetailRes, isLoading: sessionAthletesLoading } =
    useTrainingSession(Number(selectedSessionId), !!selectedSessionId, true);

  const sessionDetail = sessionDetailRes?.data;
  const sessionAthletes = sessionDetail?.athletes ?? [];
  const trainingPlanId = sessionDetail?.trainingPlanId ?? 0;

  const athleteOptions = sessionAthletes.map((a) => ({
    value: a.athleteId,
    label: a.fullName,
  }));

  // 3. Training plan → plan exercises (the ones athletes should perform)
  const { data: planRes, isLoading: planLoading } = useTrainingPlan(
    trainingPlanId,
    !!trainingPlanId,
  );
  const planExercises = planRes?.data?.planExercises ?? [];

  // Reset form on open
  useEffect(() => {
    if (open) {
      form.reset({
        athleteId: defaultAthleteId || "",
        trainingSessionId: defaultSessionId || 0,
        performanceRating: 7,
        fatigueLevel: 5,
        sessionCompleted: true,
        injuryOccurred: false,
        injuryType: null,
        injuryBodyPart: null,
        injuryComment: "",
        overallComment: "",
        exercisePerformances: [{ ...DEFAULT_EXERCISE }],
      });
    }
  }, [open, form, defaultSessionId, defaultAthleteId]);

  // When plan exercises load for selected session, auto-fill exercise cards with plan values
  useEffect(() => {
    if (open && selectedSessionId && planExercises.length > 0) {
      const mappedExercises: ExercisePerformanceFormValues[] =
        planExercises.map((pe) => ({
          planExerciseId: pe.planExerciseId ?? pe.id ?? pe.exerciseId,
          completedSets: pe.sets ?? 3,
          completedReps: pe.reps ?? 10,
          completedDuration: pe.duration ?? null,
          weightUsed: null,
          rpe: 7,
          status: 1,
          coachComment: pe.notes || "",
        }));
      form.setValue("exercisePerformances", mappedExercises);
    }
  }, [open, selectedSessionId, planExercises, form]);

  // When session changes: clear athlete if not default
  useEffect(() => {
    if (selectedSessionId && selectedSessionId !== (defaultSessionId ?? 0)) {
      form.setValue("athleteId", "");
    }
  }, [selectedSessionId, form, defaultSessionId]);

  function handleAddExercise() {
    append({ ...DEFAULT_EXERCISE });
  }

  function onSubmit(values: CreateFitnessRecordFormValues) {
    if (!values.athleteId || !values.trainingSessionId) {
      if (!values.athleteId)
        form.setError("athleteId", { message: "Athlete is required" });
      if (!values.trainingSessionId)
        form.setError("trainingSessionId", {
          message: "Training session is required",
        });
      return;
    }

    createMutation.mutate(
      {
        athleteId: values.athleteId,
        trainingSessionId: Number(values.trainingSessionId),
        performanceRating: values.performanceRating,
        fatigueLevel: values.fatigueLevel,
        sessionCompleted: values.sessionCompleted,
        injuryOccurred: values.injuryOccurred,
        injuryType: values.injuryOccurred ? Number(values.injuryType) : null,
        injuryBodyPart: values.injuryOccurred
          ? Number(values.injuryBodyPart)
          : null,
        injuryComment: values.injuryOccurred
          ? values.injuryComment || null
          : null,
        overallComment: values.overallComment || null,
        exercisePerformances: values.exercisePerformances.map((ep) => ({
          planExerciseId: Number(ep.planExerciseId) || 0,
          completedSets: Number(ep.completedSets || 0),
          completedReps: Number(ep.completedReps || 0),
          completedDuration: ep.completedDuration
            ? Number(ep.completedDuration)
            : null,
          weightUsed: ep.weightUsed ? Number(ep.weightUsed) : null,
          rpe: ep.rpe ? Number(ep.rpe) : null,
          status: Number(ep.status) as PerformanceStatus,
          coachComment: ep.coachComment?.trim() || null,
        })),
        swimmingPerformances: [],
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  const athleteId = form.watch("athleteId");
  const rating = form.watch("performanceRating");
  const fatigue = form.watch("fatigueLevel");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-600 shrink-0">
              <MdFitnessCenter className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                Log Fitness Record
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                Record an athlete's fitness session performance
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Session header fields */}
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                Session Info
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Session */}
                <ComboboxSelect
                  label="Training Session *"
                  placeholder="Select session..."
                  searchPlaceholder="Search session..."
                  options={sessionOptions}
                  value={selectedSessionId ? String(selectedSessionId) : ""}
                  onValueChange={(val) => {
                    form.setValue("trainingSessionId", Number(val), {
                      shouldValidate: true,
                    });
                  }}
                  hasValue={!!selectedSessionId}
                  error={form.formState.errors.trainingSessionId?.message}
                />

                {/* 2. Athlete — gated on session */}
                <ComboboxSelect
                  label="Athlete *"
                  placeholder={
                    !selectedSessionId
                      ? "Select session first..."
                      : sessionAthletesLoading
                        ? "Loading athletes..."
                        : sessionAthletes.length === 0
                          ? "No athletes in this session"
                          : "Select athlete..."
                  }
                  searchPlaceholder="Search athlete..."
                  emptyMessage="No athletes in this session."
                  options={athleteOptions}
                  value={athleteId}
                  onValueChange={(val) =>
                    form.setValue("athleteId", val, { shouldValidate: true })
                  }
                  disabled={
                    !selectedSessionId ||
                    sessionAthletesLoading ||
                    sessionAthletes.length === 0
                  }
                  hasValue={!!athleteId}
                  error={form.formState.errors.athleteId?.message}
                />
              </div>

              {/* Plan exercises hint */}
              {selectedSessionId ? (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {planLoading ? (
                    <span className="animate-pulse">
                      Loading plan exercises…
                    </span>
                  ) : planExercises.length > 0 ? (
                    <>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 text-xs font-semibold"
                      >
                        {planExercises.length} plan exercise
                        {planExercises.length !== 1 ? "s" : ""} available
                      </Badge>
                      <span>from this session's training plan</span>
                    </>
                  ) : (
                    <span className="text-amber-600">
                      ⚠ No exercises found in this session's training plan
                    </span>
                  )}
                </div>
              ) : null}

              {/* Rating & Fatigue */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label className="font-semibold text-foreground">
                      Performance Rating
                    </Label>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-primary/10 text-primary border-primary/20"
                    >
                      {rating} / 10
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={rating}
                    onChange={(e) =>
                      form.setValue("performanceRating", Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <Label className="font-semibold text-foreground">
                      Fatigue Level
                    </Label>
                    <Badge
                      variant="secondary"
                      className="text-xs bg-amber-500/10 text-amber-600 border-amber-500/20"
                    >
                      {fatigue} / 10
                    </Badge>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={10}
                    value={fatigue}
                    onChange={(e) =>
                      form.setValue("fatigueLevel", Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500 bg-muted"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() =>
                    form.setValue(
                      "sessionCompleted",
                      !form.watch("sessionCompleted"),
                    )
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    form.watch("sessionCompleted")
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : "bg-muted/30 text-muted-foreground border-border"
                  }`}
                >
                  {form.watch("sessionCompleted")
                    ? "✓ Session Completed"
                    : "Session Not Completed"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    const next = !form.watch("injuryOccurred");
                    form.setValue("injuryOccurred", next, {
                      shouldValidate: true,
                    });
                    if (!next) {
                      form.setValue("injuryType", null);
                      form.setValue("injuryBodyPart", null);
                      form.setValue("injuryComment", null);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    form.watch("injuryOccurred")
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                      : "bg-muted/30 text-muted-foreground border-border"
                  }`}
                >
                  {form.watch("injuryOccurred")
                    ? "⚠ Injury Occurred"
                    : "No Injury"}
                </button>
              </div>

              {/* Dynamic Injury Form Section */}
              <InjuryFormFields />

              <TextareaField
                name="overallComment"
                label="Overall Comment"
                placeholder="General session notes…"
                rows={2}
                textareaClassName="text-xs resize-none"
              />
            </div>

            {/* Exercise cards */}
            <div className="space-y-5">
              {fields.map((fieldItem, index) => (
                <ExercisePerformanceCard
                  key={fieldItem.id}
                  index={index}
                  totalExercises={fields.length}
                  planExercises={planExercises}
                  prefix={`exercisePerformances.${index}`}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAddExercise}
              className="h-9 text-xs rounded-lg gap-1.5 cursor-pointer"
            >
              <MdAdd className="size-4" />
              Add Exercise
            </Button>

            <DialogFooter className="border-t border-border pt-4 flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs rounded-lg cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={createMutation.isPending || fields.length === 0}
                className="h-9 text-xs rounded-lg gap-1.5 cursor-pointer"
              >
                {createMutation.isPending ? "Saving…" : "Save Record"}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
