import { useTranslation } from "react-i18next";
import { MdInfoOutline } from "react-icons/md";

interface PlanLineageNoteProps {
  overrideOfAssignmentId: number | null;
}

export default function PlanLineageNote({ overrideOfAssignmentId }: PlanLineageNoteProps) {
  const { t } = useTranslation("aiPlanView");

  if (overrideOfAssignmentId == null) return null;

  return (
    <div className="flex items-center gap-3 rounded-2xl border border-blue-500/30 bg-blue-500/10 p-3.5 text-blue-700 dark:text-blue-400 backdrop-blur-xs">
      <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
        <MdInfoOutline className="size-4" />
      </div>
      <p className="text-xs font-medium leading-relaxed">{t("lineage.overrideNote")}</p>
    </div>
  );
}