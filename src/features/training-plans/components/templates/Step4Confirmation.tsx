import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import type {
  PlanInfoFormValues,
  ExercisesStepFormValues,
  AssignmentStepFormValues,
} from "../../constants/validations";

interface Step4ConfirmationProps {
  planInfo: PlanInfoFormValues;
  exercises: ExercisesStepFormValues;
  assignment: AssignmentStepFormValues;
  isSaving: boolean;
  onSave: () => void;
  onBack: () => void;
}

export function Step4Confirmation({
  planInfo,
  exercises,
  assignment,
  isSaving,
  onSave,
  onBack,
}: Step4ConfirmationProps) {
  const { t } = useTranslation("training");

  return (
    <div className="flex flex-col gap-6 pt-4 flex-1">
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <h3 className="font-semibold text-foreground text-sm">{planInfo.title}</h3>
        {planInfo.description && (
          <p className="text-xs text-muted-foreground">{planInfo.description}</p>
        )}
        <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t border-border">
          <span>
            {exercises.exercises.length} {t("templates.table.exercises")}
          </span>
          <span>
            {t("wizard.steps.assignment")}:{" "}
            {assignment.assignNow
              ? `${assignment.athleteIds.length} ${t("assignments.athletesTab")}, ${assignment.groupIds.length} ${t("assignments.groupsTab")}`
              : t("wizard.step3.draft")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
        <Button type="button" variant="outline" onClick={onBack} className="cursor-pointer">
          {t("wizard.step2.back")}
        </Button>
        <Button type="button" disabled={isSaving} onClick={onSave} className="cursor-pointer">
          {isSaving ? t("wizard.step4.saving") : t("wizard.step4.saveTrainingPlan")}
        </Button>
      </div>
    </div>
  );
}
