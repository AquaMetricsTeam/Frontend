import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdDeleteOutline, MdPool } from "react-icons/md";
import { SwimmingDrillForm } from "./SwimmingDrillForm";
import type { PlanExercise } from "@/features/training-plans/types";

interface DrillCardProps {
  index: number;
  totalDrills: number;
  prefix?: string;
  plannedExercise?: PlanExercise;
  onRemove: () => void;
}

export function DrillCard({
  index,
  totalDrills,
  prefix = `swimmingPerformances.${index}`,
  plannedExercise,
  onRemove,
}: DrillCardProps) {
  const { t } = useTranslation("swimming");

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <div className="flex items-center gap-2 min-w-0 flex-wrap">
          <Badge
            variant="secondary"
            className="text-xs font-bold bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20 gap-1.5 shrink-0"
          >
            <MdPool className="size-3" />
            {t("builder.drillCardTitle", { index: index + 1 })}
          </Badge>

          {plannedExercise && (
            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1.5 flex-wrap">
              {plannedExercise.exerciseName && (
                <span className="font-semibold text-foreground">
                  {plannedExercise.exerciseName}
                </span>
              )}
              {(plannedExercise.sets || plannedExercise.reps) && (
                <>
                  {plannedExercise.exerciseName && <span>•</span>}
                  <span>
                    {plannedExercise.sets || 1}×{plannedExercise.reps || 1}m
                    planned
                  </span>
                </>
              )}
              {plannedExercise.duration ||
              (plannedExercise as any).durationMinutes ? (
                <>
                  <span>•</span>
                  <span>
                    {plannedExercise.duration ||
                      (plannedExercise as any).durationMinutes}{" "}
                    min planned
                  </span>
                </>
              ) : null}
            </span>
          )}
        </div>

        {totalDrills > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 cursor-pointer shrink-0"
          >
            <MdDeleteOutline className="size-4" />
            {t("builder.removeDrill")}
          </Button>
        )}
      </div>

      <SwimmingDrillForm prefix={prefix} />
    </div>
  );
}
