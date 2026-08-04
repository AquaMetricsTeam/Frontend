import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StepIndicator } from "./StepIndicator";
import { Step1PlanInfo } from "./Step1PlanInfo";
import { Step2Exercises } from "./Step2Exercises";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/feedbacks/ErrorMessage";
import Spinner from "@/components/feedbacks/Spinner";
import { useTrainingPlan } from "../../hooks/useTrainingPlan";
import { useUpdateTrainingPlan } from "../../hooks/useUpdateTrainingPlan";
import type { TrainingPlan } from "../../types/index";
import type {
  PlanInfoFormValues,
  ExercisesStepFormValues,
} from "../../constants/validations";

const STEPS = [{ label: "Info" }, { label: "Exercises" }, { label: "Confirm" }];

interface EditTemplateSheetProps {
  plan: TrainingPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EditTemplateSheet({
  plan,
  open,
  onOpenChange,
}: EditTemplateSheetProps) {
  const planId = plan?.id ?? 0;
  const {
    data: planDetailRes,
    isLoading,
    isError,
    refetch,
  } = useTrainingPlan(planId, open && planId > 0);
  const fullPlan = planDetailRes?.data;

  const [step, setStep] = useState(0);
  const [planInfo, setPlanInfo] = useState<PlanInfoFormValues | null>(null);
  const [exercises, setExercises] = useState<ExercisesStepFormValues | null>(
    null,
  );

  useEffect(() => {
    if (fullPlan) {
      setPlanInfo({
        title: fullPlan.title,
        description: fullPlan.description ?? "",
      });
      setExercises({
        exercises:
          fullPlan.planExercises && fullPlan.planExercises.length > 0
            ? fullPlan.planExercises.map((ex) => ({
                exerciseId: ex.exerciseId,
                sets: ex.sets,
                reps: ex.reps,
                duration: ex.duration,
                intensity: ex.intensity ?? 2,
                notes: ex.notes ?? "",
              }))
            : [
                {
                  exerciseId: 0,
                  sets: 3,
                  reps: 10,
                  duration: 0,
                  intensity: 2,
                  notes: "",
                },
              ],
      });
    }
  }, [fullPlan]);

  const updateMutation = useUpdateTrainingPlan(planId, () => {
    onOpenChange(false);
    resetWizard();
  });

  function resetWizard() {
    setStep(0);
    setPlanInfo(null);
    setExercises(null);
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) resetWizard();
    onOpenChange(nextOpen);
  }

  function handleSave() {
    if (!planInfo || !exercises || !planId) return;

    const payload = {
      title: planInfo.title,
      description: planInfo.description ?? "",
      planExercises: exercises.exercises.map((ex, i) => ({
        exerciseId: ex.exerciseId,
        sets: ex.sets,
        reps: ex.reps,
        duration: ex.duration,
        intensity: ex.intensity,
        notes: ex.notes,
        orderIndex: i + 1,
      })),
    };

    updateMutation.mutate(payload);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-base font-semibold">
            Edit Training Plan
          </SheetTitle>
        </SheetHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center p-6">
            <Spinner />
          </div>
        ) : isError ? (
          <div className="flex-1 p-6">
            <ErrorMessage onRetry={refetch} />
          </div>
        ) : (
          <>
            <div className="px-6 pt-5">
              <StepIndicator steps={STEPS} currentStep={step} />
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {step === 0 && (
                <Step1PlanInfo
                  key={`step1-${fullPlan?.id}`}
                  defaultValues={planInfo ?? undefined}
                  onNext={(data) => {
                    setPlanInfo(data);
                    setStep(1);
                  }}
                />
              )}
              {step === 1 && (
                <Step2Exercises
                  key={`step2-${fullPlan?.id}`}
                  defaultValues={exercises ?? undefined}
                  onNext={(data) => {
                    setExercises(data);
                    setStep(2);
                  }}
                  onBack={() => setStep(0)}
                />
              )}
              {step === 2 && planInfo && exercises && (
                <div className="flex flex-col gap-6 pt-4">
                  <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                    <h3 className="font-semibold text-foreground text-sm">
                      {planInfo.title}
                    </h3>
                    {planInfo.description && (
                      <p className="text-xs text-muted-foreground">
                        {planInfo.description}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {exercises.exercises.length} Exercises
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setStep(1)}
                    >
                      Back
                    </Button>
                    <Button
                      type="button"
                      disabled={updateMutation.isPending}
                      onClick={handleSave}
                    >
                      {updateMutation.isPending
                        ? "Saving Changes..."
                        : "Save Changes"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
