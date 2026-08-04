import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { StepIndicator } from "./StepIndicator";
import { Step1PlanInfo } from "./Step1PlanInfo";
import { Step2Exercises } from "./Step2Exercises";
import { Step3Assignment } from "./Step3Assignment";
import { Step4Confirmation } from "./Step4Confirmation";
import { useCreateTrainingPlan } from "../../hooks/useCreateTrainingPlan";
import type { PlanInfoFormValues } from "../../constants/validations";
import type { ExercisesStepFormValues } from "../../constants/validations";
import type { AssignmentStepFormValues } from "../../constants/validations";

const STEPS = [
  { label: "Info" },
  { label: "Exercises" },
  { label: "Assignment" },
  { label: "Confirm" },
];

interface CreateTemplateSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateTemplateSheet({ open, onOpenChange }: CreateTemplateSheetProps) {
  const [step, setStep] = useState(0);
  const [planInfo, setPlanInfo] = useState<PlanInfoFormValues | null>(null);
  const [exercises, setExercises] = useState<ExercisesStepFormValues | null>(null);
  const [assignment, setAssignment] = useState<AssignmentStepFormValues | null>(null);

  const createMutation = useCreateTrainingPlan(() => {
    onOpenChange(false);
    resetWizard();
  });

  function resetWizard() {
    setStep(0);
    setPlanInfo(null);
    setExercises(null);
    setAssignment(null);
  }

  function handleClose(nextOpen: boolean) {
    if (!nextOpen) resetWizard();
    onOpenChange(nextOpen);
  }

  function handleSave() {
    if (!planInfo || !exercises || !assignment) return;

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
      ...(assignment.assignNow && {
        assignment: {
          athleteIds: assignment.athleteIds,
          groupIds: assignment.groupIds,
        },
      }),
    };

    createMutation.mutate(payload);
  }

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-base font-semibold">New Training Plan</SheetTitle>
        </SheetHeader>

        <div className="px-6 pt-5">
          <StepIndicator steps={STEPS} currentStep={step} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {step === 0 && (
            <Step1PlanInfo
              defaultValues={planInfo ?? undefined}
              onNext={(data) => {
                setPlanInfo(data);
                setStep(1);
              }}
            />
          )}
          {step === 1 && (
            <Step2Exercises
              defaultValues={exercises ?? undefined}
              onNext={(data) => {
                setExercises(data);
                setStep(2);
              }}
              onBack={() => setStep(0)}
            />
          )}
          {step === 2 && (
            <Step3Assignment
              defaultValues={assignment ?? undefined}
              onNext={(data) => {
                setAssignment(data);
                setStep(3);
              }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && planInfo && exercises && assignment && (
            <Step4Confirmation
              planInfo={planInfo}
              exercises={exercises}
              assignment={assignment}
              isSaving={createMutation.isPending}
              onSave={handleSave}
              onBack={() => setStep(2)}
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
