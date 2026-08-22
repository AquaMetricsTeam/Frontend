import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  MdFitnessCenter,
  MdCheckCircle,
  MdCancel,
  MdWarning,
  MdEdit,
} from "react-icons/md";
import { cn } from "@/lib/utils";
import type {
  TrainingRecordResponse,
  ExercisePerformanceResponse,
} from "@/features/training-record/types";
import { useTrainingRecordDetail } from "@/features/training-record/hooks/useTrainingRecordDetail";
import { useExercisePerformancesByTrainingRecord } from "@/features/fitness/hooks/useExercisePerformancesByTrainingRecord";
import { EditExercisePerformanceModal } from "./EditExercisePerformanceModal";
import { InjuryDetailCard } from "@/features/training-record/components/InjuryDetailCard";

interface FitnessRecordDetailSheetProps {
  record: TrainingRecordResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (record: TrainingRecordResponse) => void;
}

export function FitnessRecordDetailSheet({
  record,
  open,
  onOpenChange,
  onEdit,
}: FitnessRecordDetailSheetProps) {
  const { t } = useTranslation(["fitness", "swimming", "common"]);
  const [selectedExercise, setSelectedExercise] =
    useState<ExercisePerformanceResponse | null>(null);
  const [isEditExerciseOpen, setIsEditExerciseOpen] = useState(false);

  const statusMap: Record<number, { label: string; className: string }> = {
    1: {
      label: t("swimming:statuses.completed"),
      className: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    },
    2: {
      label: t("swimming:statuses.partiallyCompleted"),
      className: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    },
    3: {
      label: t("swimming:statuses.skipped"),
      className: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    },
    4: {
      label: t("swimming:statuses.modified"),
      className: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    },
  };

  // 1. Fetch training record overall detail
  const { data: detailRes, isLoading: isRecordLoading } = useTrainingRecordDetail(
    record?.id ?? 0,
    open && (record?.id ?? 0) > 0,
  );

  // 2. Fetch exercise performances directly from /Exercise-Performance/training-record/{id}
  const { data: exerciseRes, isLoading: isExerciseLoading } =
    useExercisePerformancesByTrainingRecord(
      record?.id ?? 0,
      open && (record?.id ?? 0) > 0,
    );

  const detail = detailRes?.data;

  if (!record) return null;

  const athleteName = detail?.athleteName || record.athleteName;
  const sessionTitle = detail?.sessionTitle || record.sessionTitle;
  const sessionDate = detail?.sessionDate || record.sessionDate;
  const isCompleted = detail?.sessionCompleted ?? record.sessionCompleted;
  const hasInjury = detail?.injuryOccurred ?? record.injuryOccurred;

  const fetchedExercises = exerciseRes?.data ?? [];
  const exercisePerformances =
    detail?.exercisePerformances && detail.exercisePerformances.length > 0
      ? detail.exercisePerformances
      : fetchedExercises;

  const isLoading = isRecordLoading || isExerciseLoading;

  function handleEditExercise(ex: ExercisePerformanceResponse) {
    setSelectedExercise(ex);
    setIsEditExerciseOpen(true);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <MdFitnessCenter className="size-5 text-amber-500 shrink-0" />
                <span className="truncate">{athleteName}</span>
              </SheetTitle>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 flex items-center gap-1",
                    isCompleted
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 border-rose-500/20",
                  )}
                >
                  {isCompleted ? (
                    <>
                      <MdCheckCircle className="size-3" />
                      {t("fitness:table.completed")}
                    </>
                  ) : (
                    <>
                      <MdCancel className="size-3" />
                      {t("fitness:table.incomplete")}
                    </>
                  )}
                </Badge>

                {hasInjury && (
                  <Badge
                    variant="outline"
                    className="bg-rose-500/15 text-rose-600 border-rose-500/30 text-xs font-bold px-2 py-0.5 flex items-center gap-1"
                  >
                    <MdWarning className="size-3.5" />
                    {t("fitness:table.injuryReported")}
                  </Badge>
                )}
              </div>
            </div>

            <SheetDescription className="text-xs text-muted-foreground mt-1 flex items-center justify-between">
              <span>
                {sessionTitle}
                {sessionDate ? ` • ${sessionDate}` : ""}
              </span>
              {onEdit && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(record)}
                  className="h-7 gap-1.5 text-xs cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 shrink-0"
                >
                  <MdEdit className="size-3.5" />
                  {t("fitness:detailSheet.editRecord")}
                </Button>
              )}
            </SheetDescription>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {isLoading && !detail && fetchedExercises.length === 0 ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-muted/40 rounded-xl" />
                <div className="h-32 bg-muted/40 rounded-xl" />
                <div className="h-32 bg-muted/40 rounded-xl" />
              </div>
            ) : (
              <>
                {/* Session Evaluation Card */}
                {detail && (
                  <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                        {t("fitness:detailSheet.sessionDetails")}
                      </h4>
                      <div className="flex items-center gap-2 text-xs">
                        <Badge
                          variant="secondary"
                          className="bg-primary/10 text-primary border-primary/20 font-bold"
                        >
                          {t("fitness:drawer.ratingLabel")}: {detail.performanceRating} / 10
                        </Badge>
                        <Badge
                          variant="secondary"
                          className="bg-amber-500/10 text-amber-600 border-amber-500/20 font-bold"
                        >
                          {t("fitness:drawer.fatigueLabel")}: {detail.fatigueLevel} / 10
                        </Badge>
                      </div>
                    </div>

                    {detail.overallComment && (
                      <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-2.5 rounded-lg border border-border/50">
                        &quot;{detail.overallComment}&quot;
                      </p>
                    )}
                  </div>
                )}

                {/* Injury Details Card if injury occurred */}
                {hasInjury && (
                  <InjuryDetailCard
                    injuryType={detail?.injuryType ?? record.injuryType}
                    injuryBodyPart={
                      detail?.injuryBodyPart ?? record.injuryBodyPart
                    }
                    injuryComment={detail?.injuryComment ?? record.injuryComment}
                  />
                )}

                {/* Exercise Performances */}
                {exercisePerformances.length > 0 ? (
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                      <MdFitnessCenter className="size-4" />
                      {t("fitness:detailSheet.exercisePerformances")} ({exercisePerformances.length})
                    </h4>

                    {exercisePerformances.map((ex, idx) => {
                      const statusMeta = statusMap[ex.status];
                      return (
                        <div
                          key={ex.id || idx}
                          className="p-4 rounded-xl border border-border bg-card space-y-3 text-xs shadow-xs"
                        >
                          {/* Exercise header */}
                          <div className="flex items-center justify-between border-b border-border/60 pb-2">
                            <span className="font-bold text-foreground text-sm">
                              {ex.exerciseTitle || `Plan Exercise #${ex.planExerciseId || ex.id || idx + 1}`}
                            </span>
                            <div className="flex items-center gap-2">
                              {statusMeta && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[10px] font-bold px-2 py-0.5",
                                    statusMeta.className,
                                  )}
                                >
                                  {statusMeta.label}
                                </Badge>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditExercise(ex)}
                                className="h-6 gap-1 text-[11px] cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-500/10 px-2"
                              >
                                <MdEdit className="size-3" />
                                {t("fitness:table.edit")}
                              </Button>
                            </div>
                          </div>

                          {/* Planned vs Actual */}
                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-bold uppercase text-muted-foreground tracking-wide">
                                {t("fitness:detailSheet.planned")}
                              </p>
                              <div className="flex flex-wrap gap-2.5 text-muted-foreground">
                                <span>
                                  {t("fitness:detailSheet.sets")}:{" "}
                                  <strong className="text-foreground">
                                    {ex.plannedSets ?? 0}
                                  </strong>
                                </span>
                                <span>
                                  {t("fitness:detailSheet.reps")}:{" "}
                                  <strong className="text-foreground">
                                    {ex.plannedReps ?? 0}
                                  </strong>
                                </span>
                                {ex.plannedDuration != null && ex.plannedDuration > 0 && (
                                  <span>
                                    {t("fitness:drawer.durationLabel")}:{" "}
                                    <strong className="text-foreground">
                                      {ex.plannedDuration}m
                                    </strong>
                                  </span>
                                )}
                                {ex.plannedRestSeconds != null && ex.plannedRestSeconds > 0 && (
                                  <span>
                                    {t("fitness:detailSheet.rest")}:{" "}
                                    <strong className="text-foreground">
                                      {ex.plannedRestSeconds}s
                                    </strong>
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400 tracking-wide">
                                {t("fitness:detailSheet.completed")}
                              </p>
                              <div className="flex flex-wrap gap-2.5 text-muted-foreground">
                                <span>
                                  {t("fitness:detailSheet.sets")}:{" "}
                                  <strong className="text-foreground">
                                    {ex.completedSets ?? 0}
                                  </strong>
                                </span>
                                <span>
                                  {t("fitness:detailSheet.reps")}:{" "}
                                  <strong className="text-foreground">
                                    {ex.completedReps ?? 0}
                                  </strong>
                                </span>
                                {ex.completedDuration != null && ex.completedDuration > 0 && (
                                  <span>
                                    {t("fitness:drawer.durationLabel")}:{" "}
                                    <strong className="text-foreground">
                                      {ex.completedDuration}m
                                    </strong>
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* Extra fields */}
                          <div className="flex flex-wrap gap-3 text-muted-foreground pt-1 border-t border-border/40">
                            {ex.weightUsed != null && (
                              <span>
                                {t("fitness:drawer.weightLabel")}:{" "}
                                <strong className="text-foreground">
                                  {ex.weightUsed} kg
                                </strong>
                              </span>
                            )}
                            {ex.completedDuration != null && (
                              <span>
                                {t("fitness:drawer.durationLabel")}:{" "}
                                <strong className="text-foreground">
                                  {ex.completedDuration} min
                                </strong>
                              </span>
                            )}
                            {ex.rpe != null && (
                              <span>
                                {t("fitness:drawer.rpeLabel")}:{" "}
                                <strong
                                  className={cn(
                                    ex.rpe >= 8
                                      ? "text-rose-600"
                                      : ex.rpe >= 5
                                        ? "text-amber-600"
                                        : "text-emerald-600",
                                  )}
                                >
                                  {ex.rpe} / 10
                                </strong>
                              </span>
                            )}
                          </div>

                          {ex.coachComment && (
                            <p className="text-[11px] italic text-muted-foreground bg-muted/30 p-2 rounded-lg border border-border/50">
                              &quot;{ex.coachComment}&quot;
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  !isLoading && (
                    <div className="text-center py-8 text-xs text-muted-foreground">
                      {t("fitness:detailSheet.noExercises")}
                    </div>
                  )
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit individual exercise performance modal */}
      <EditExercisePerformanceModal
        exercisePerformance={selectedExercise}
        parentRecord={record}
        open={isEditExerciseOpen}
        onOpenChange={setIsEditExerciseOpen}
      />
    </>
  );
}
