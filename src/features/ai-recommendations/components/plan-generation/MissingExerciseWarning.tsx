import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";

interface MissingExerciseWarningProps {
  notes: string;
}

export default function MissingExerciseWarning({ notes }: MissingExerciseWarningProps) {
  const { t } = useTranslation("aiPlan");

  return (
    <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
      <div className="flex gap-3">
        <MdWarning className="mt-0.5 size-5 shrink-0 text-amber-600 dark:text-amber-400" />
        <div className="space-y-1">
          <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
            {t("warning.missingExercises")}
          </p>
          <div className="text-sm text-amber-700/90 dark:text-amber-400/90">
            <p className="font-medium">{t("warning.missingExercisesNotes")}</p>
            <p className="mt-1 whitespace-pre-wrap">{notes}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
