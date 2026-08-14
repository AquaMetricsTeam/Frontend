import { useEffect } from "react";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { MdAdd, MdContentCopy, MdPool } from "react-icons/md";
import { DrillCard } from "./DrillCard";
import { useCreateTrainingRecord } from "@/features/training-record/hooks/useCreateTrainingRecord";
import { useTrainingSessions } from "@/features/training-plans/hooks/useTrainingSessions";
import { useTrainingSession } from "@/features/training-plans/hooks/useTrainingSession";
import {
  StrokeType,
  PerformanceStatus,
  PerformanceGrade,
  type SwimmingDrillRequest,
} from "../types";
import { useTrainingPlan } from "@/features/training-plans/hooks/useTrainingPlan";

const DEFAULT_DRILL: SwimmingDrillRequest = {
  stroke: StrokeType.Freestyle,
  distanceMeters: 100,
  repetitions: 4,
  restIntervalSeconds: 30,
  bestRepTime: "00:01:08",
  averageRepTime: "00:01:10",
  worstRepTime: "00:01:13",
  technique: PerformanceGrade.Excellent,
  start: PerformanceGrade.Excellent,
  turns: PerformanceGrade.Good,
  finish: PerformanceGrade.Excellent,
  paceConsistency: PerformanceGrade.Good,
  rpe: 7,
  status: PerformanceStatus.Completed,
  coachComment: "",
};

function mapPlanExerciseToDrill(pe: PlanExercise): SwimmingDrillRequest {
  const name = pe.exerciseName?.toLowerCase() || "";
  let stroke = StrokeType.Freestyle;
  if (name.includes("back")) stroke = StrokeType.Backstroke;
  else if (name.includes("breast")) stroke = StrokeType.Breaststroke;
  else if (name.includes("fly") || name.includes("butterfly"))
    stroke = StrokeType.Butterfly;
  else if (name.includes("medley") || name.includes("im"))
    stroke = StrokeType.IndividualMedley;

  const distMatch = pe.exerciseName?.match(/(\d+)\s*m/i);
  const distanceMeters = distMatch ? Number(distMatch[1]) : 100;

  return {
    stroke,
    distanceMeters,
    repetitions: pe.sets || pe.reps || 4,
    restIntervalSeconds: pe.restSeconds || 30,
    bestRepTime: "00:01:08",
    averageRepTime: "00:01:10",
    worstRepTime: "00:01:13",
    technique: PerformanceGrade.Excellent,
    start: PerformanceGrade.Excellent,
    turns: PerformanceGrade.Good,
    finish: PerformanceGrade.Excellent,
    paceConsistency: PerformanceGrade.Good,
    rpe: 7,
    status: PerformanceStatus.Completed,
    coachComment: pe.notes || "",
  };
}

interface LogFormValues {
  athleteId: string;
  trainingSessionId: number;
  performanceRating: number;
  fatigueLevel: number;
  sessionCompleted: boolean;
  injuryOccurred: boolean;
  overallComment?: string | null;
  swimmingPerformances: SwimmingDrillRequest[];
}

interface LogSwimmingPerformanceDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultSessionId?: number;
  defaultAthleteId?: string;
}

export function LogSwimmingPerformanceDrawer({
  open,
  onOpenChange,
  defaultSessionId,
  defaultAthleteId,
}: LogSwimmingPerformanceDrawerProps) {
  const { t } = useTranslation("swimming");
  const createMutation = useCreateTrainingRecord();

  // 1. Fetch available training sessions first
  const { data: sessionsRes } = useTrainingSessions({ pageSize: 100 });
  const sessions = sessionsRes?.data?.items ?? [];

  const sessionOptions = sessions.map((s) => ({
    value: String(s.id),
    label: `${s.title || "Session"} (${s.sessionDate || ""})`,
  }));

  const form = useForm<LogFormValues>({
    defaultValues: {
      athleteId: defaultAthleteId || "",
      trainingSessionId: defaultSessionId || 0,
      performanceRating: 7,
      fatigueLevel: 5,
      sessionCompleted: true,
      injuryOccurred: false,
      overallComment: "",
      swimmingPerformances: [{ ...DEFAULT_DRILL }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "swimmingPerformances",
  });

  // Watch session ID to fetch session-specific athletes
  const selectedSessionId = form.watch("trainingSessionId");

  // 2. Fetch session details strictly to get athletes and plan
  const { data: sessionDetailRes, isLoading: sessionAthletesLoading } =
    useTrainingSession(Number(selectedSessionId), !!selectedSessionId);

  const sessionDetail = sessionDetailRes?.data;
  const sessionAthletes = sessionDetail?.athletes ?? [];
  const trainingPlanId = sessionDetail?.trainingPlanId ?? 0;

  const athleteOptions = sessionAthletes.map((a) => ({
    value: a.athleteId,
    label: a.fullName,
  }));

  // 3. Fetch training plan for drills auto-population
  const { data: planRes } = useTrainingPlan(trainingPlanId, !!trainingPlanId);
  const planExercises = planRes?.data?.planExercises ?? [];

  // Reset form when dialog is opened
  useEffect(() => {
    if (open) {
      form.reset({
        athleteId: defaultAthleteId || "",
        trainingSessionId: defaultSessionId || 0,
        performanceRating: 7,
        fatigueLevel: 5,
        sessionCompleted: true,
        injuryOccurred: false,
        overallComment: "",
        swimmingPerformances: [{ ...DEFAULT_DRILL }],
      });
    }
  }, [open, form, defaultSessionId, defaultAthleteId]);

  // When plan exercises load for selected session, auto-fill drill cards
  useEffect(() => {
    if (open && selectedSessionId && planExercises.length > 0) {
      const mappedDrills = planExercises.map(mapPlanExerciseToDrill);
      form.setValue("swimmingPerformances", mappedDrills);
    }
  }, [open, selectedSessionId, planExercises, form]);

  // When session changes: clear athlete if not default
  useEffect(() => {
    if (selectedSessionId && selectedSessionId !== (defaultSessionId ?? 0)) {
      form.setValue("athleteId", "");
    }
  }, [selectedSessionId, form, defaultSessionId]);

  function handleDuplicateLast() {
    const currentList = form.getValues("swimmingPerformances");
    if (currentList.length === 0) return;
    const last = currentList[currentList.length - 1];
    append({
      ...DEFAULT_DRILL,
      stroke: last.stroke,
      distanceMeters: last.distanceMeters,
      repetitions: last.repetitions,
      restIntervalSeconds: last.restIntervalSeconds,
    });
  }

  function onSubmit(values: LogFormValues) {
    if (!values.athleteId || !values.trainingSessionId) {
      form.setError("athleteId", { message: "Athlete is required" });
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
        overallComment: values.overallComment || null,
        exercisePerformances: [],
        swimmingPerformances: values.swimmingPerformances.map((p) => ({
          ...p,
          coachComment: p.coachComment?.trim() || null,
        })),
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      },
    );
  }

  const athleteId = form.watch("athleteId");
  const performanceRating = form.watch("performanceRating");
  const fatigueLevel = form.watch("fatigueLevel");
  const sessionCompleted = form.watch("sessionCompleted");
  const injuryOccurred = form.watch("injuryOccurred");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 shrink-0">
              <MdPool className="size-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold text-foreground">
                {t("builder.title")}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                {t("builder.description")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <FormProvider {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto p-6 space-y-6"
          >
            {/* Session Header Fields */}
            <div className="space-y-4 p-4 rounded-xl border border-border bg-muted/20">
              <p className="text-xs font-bold text-foreground uppercase tracking-wider">
                {t("builder.selectSession")}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 1. Session Combobox */}
                <ComboboxSelect
                  label={t("builder.selectSession") + " *"}
                  placeholder="Select session..."
                  searchPlaceholder="Search session..."
                  options={sessionOptions}
                  value={selectedSessionId ? String(selectedSessionId) : ""}
                  onValueChange={(val) => {
                    form.setValue("trainingSessionId", Number(val), {
                      shouldValidate: true,
                    });
                    form.setValue("athleteId", "", { shouldValidate: true });
                  }}
                  hasValue={!!selectedSessionId}
                  error={form.formState.errors.trainingSessionId?.message}
                />

                {/* 2. Athlete Combobox (Strictly athletes in selected session) */}
                <ComboboxSelect
                  label={t("builder.selectAthlete") + " *"}
                  placeholder={
                    !selectedSessionId
                      ? "Select session first..."
                      : sessionAthletesLoading
                        ? "Loading session athletes..."
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

              {/* Performance Rating & Fatigue Sliders */}
              <div className="grid grid-cols-2 gap-4 pt-2">
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
                      form.setValue("performanceRating", Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-primary bg-muted"
                  />
                </div>

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
                      form.setValue("fatigueLevel", Number(e.target.value))
                    }
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer accent-amber-500 bg-muted"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-2 pt-1">
                <button
                  type="button"
                  onClick={() =>
                    form.setValue("sessionCompleted", !sessionCompleted)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    sessionCompleted
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                      : "bg-muted/30 text-muted-foreground border-border"
                  }`}
                >
                  {sessionCompleted
                    ? "✓ Session Completed"
                    : "Session Incomplete"}
                </button>

                <button
                  type="button"
                  onClick={() =>
                    form.setValue("injuryOccurred", !injuryOccurred)
                  }
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    injuryOccurred
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                      : "bg-muted/30 text-muted-foreground border-border"
                  }`}
                >
                  {injuryOccurred ? "⚠ Injury Occurred" : "No Injury"}
                </button>
              </div>
            </div>

            {/* Drill Cards */}
            <div className="space-y-5">
              {fields.map((field, index) => (
                <DrillCard
                  key={field.id}
                  index={index}
                  totalDrills={fields.length}
                  prefix={`swimmingPerformances.${index}`}
                  plannedExercise={planExercises[index]}
                  onRemove={() => remove(index)}
                />
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ ...DEFAULT_DRILL })}
                className="h-9 text-xs rounded-lg gap-1.5 cursor-pointer"
              >
                <MdAdd className="size-4" />
                {t("builder.addDrill")}
              </Button>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleDuplicateLast}
                className="h-9 text-xs rounded-lg gap-1.5 cursor-pointer"
              >
                <MdContentCopy className="size-4" />
                {t("builder.duplicateLast")}
              </Button>
            </div>

            <DialogFooter className="border-t border-border pt-4 flex flex-row items-center justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => onOpenChange(false)}
                className="h-9 text-xs rounded-lg cursor-pointer"
              >
                {t("common.cancel")}
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  createMutation.isPending ||
                  fields.length === 0 ||
                  !athleteId ||
                  !selectedSessionId
                }
                className="h-9 text-xs rounded-lg gap-1.5 cursor-pointer"
              >
                {createMutation.isPending
                  ? t("builder.saving")
                  : t("builder.savePerformances")}
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
