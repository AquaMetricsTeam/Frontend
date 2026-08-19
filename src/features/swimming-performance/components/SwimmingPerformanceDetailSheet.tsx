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
  MdTimer,
  MdPool,
  MdComment,
  MdStars,
  MdWarning,
  MdCheckCircle,
  MdCancel,
  MdEdit,
} from "react-icons/md";
import type { TrainingRecordResponse } from "@/features/training-record/types";
import type { SwimmingPerformance } from "../types";
import {
  STROKE_METADATA,
  STATUS_METADATA,
  GRADE_METADATA,
} from "../constants/enums";
import { formatTimeSpanDisplay } from "./MmSsInput";
import { MiniRatingBar } from "./SegmentedRatingControl";
import { useSwimmingPerformancesByTrainingRecord } from "../hooks/useSwimmingPerformancesByTrainingRecord";
import { useTrainingRecordDetail } from "@/features/training-record/hooks/useTrainingRecordDetail";
import { EditSwimmingPerformanceModal } from "./EditSwimmingPerformanceModal";
import { InjuryDetailCard } from "@/features/training-record/components/InjuryDetailCard";
import { cn } from "@/lib/utils";

interface SwimmingPerformanceDetailSheetProps {
  record: TrainingRecordResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  canManage?: boolean;
}

export function SwimmingPerformanceDetailSheet({
  record,
  open,
  onOpenChange,
  canManage = false,
}: SwimmingPerformanceDetailSheetProps) {
  const { t } = useTranslation("swimming");
  const [selectedDrill, setSelectedDrill] =
    useState<SwimmingPerformance | null>(null);
  const [isEditDrillOpen, setIsEditDrillOpen] = useState(false);

  // 1. Fetch drills list for this training record
  const { data: detailRes, isLoading: isDrillsLoading } =
    useSwimmingPerformancesByTrainingRecord(
      record?.id ?? 0,
      open && (record?.id ?? 0) > 0,
    );

  // 2. Fetch full training record details for overallComment
  const { data: recordDetailRes } = useTrainingRecordDetail(
    record?.id ?? 0,
    open && (record?.id ?? 0) > 0,
  );

  const swimmingPerformances = detailRes?.data ?? [];
  const recordDetail = recordDetailRes?.data;

  if (!record) return null;

  const athleteName = record.athleteName || "Athlete Performance";
  const sessionTitle = record.sessionTitle || "Training Session";
  const sessionDate = record.sessionDate || "";

  const isCompleted = record.sessionCompleted ?? true;
  const hasInjury = record.injuryOccurred ?? false;
  const overallComment =
    recordDetail?.overallComment ||
    (record as { overallComment?: string }).overallComment ||
    (record as { coachComment?: string }).coachComment;

  function handleEditDrill(perf: SwimmingPerformance) {
    setSelectedDrill(perf);
    setIsEditDrillOpen(true);
  }

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
          {/* Header */}
          <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
            <div className="flex items-center justify-between gap-2">
              <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
                <MdPool className="size-5 text-primary shrink-0" />
                <span className="truncate">{athleteName}</span>
              </SheetTitle>

              <div className="flex items-center gap-1.5 shrink-0">
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-semibold px-2 py-0.5 flex items-center gap-1",
                    isCompleted
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
                  )}
                >
                  {isCompleted ? (
                    <>
                      <MdCheckCircle className="size-3" />
                      Completed
                    </>
                  ) : (
                    <>
                      <MdCancel className="size-3" />
                      Not Completed
                    </>
                  )}
                </Badge>

                {hasInjury ? (
                  <Badge
                    variant="outline"
                    className="bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30 text-xs font-bold px-2 py-0.5 flex items-center gap-1"
                  >
                    <MdWarning className="size-3.5 text-rose-500" />
                    Injury Occurred
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-muted/40 text-muted-foreground border-border text-xs px-2 py-0.5 font-medium"
                  >
                    No Injury
                  </Badge>
                )}
              </div>
            </div>

            <SheetDescription className="text-xs text-muted-foreground mt-1">
              {sessionTitle} {sessionDate ? `• ${sessionDate}` : ""}
            </SheetDescription>
          </SheetHeader>

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
            {isDrillsLoading ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-20 bg-muted/40 rounded-xl" />
                <div className="h-32 bg-muted/40 rounded-xl" />
                <div className="h-40 bg-muted/40 rounded-xl" />
              </div>
            ) : (
              <>
                {/* Overall Session Evaluation Card */}
                <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Session Evaluation
                    </h4>

                    <div className="flex items-center gap-2 text-xs">
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-primary/20 font-bold"
                      >
                        Rating: {record.performanceRating} / 10
                      </Badge>
                      <Badge
                        variant="secondary"
                        className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 font-bold"
                      >
                        Fatigue: {record.fatigueLevel} / 10
                      </Badge>
                    </div>
                  </div>

                  {overallComment && (
                    <div className="pt-2 border-t border-border/50 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1">
                        <MdComment className="size-3.5 text-primary" />
                        Overall Coach Comment
                      </span>
                      <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-2.5 rounded-lg border border-border/50">
                        &quot;{overallComment}&quot;
                      </p>
                    </div>
                  )}
                </div>

                {/* Injury Details Card if injury occurred */}
                {hasInjury && (
                  <InjuryDetailCard
                    injuryType={
                      recordDetail?.injuryType ?? record.injuryType
                    }
                    injuryBodyPart={
                      recordDetail?.injuryBodyPart ?? record.injuryBodyPart
                    }
                    injuryComment={
                      recordDetail?.injuryComment ?? record.injuryComment
                    }
                  />
                )}

                {/* Swimming Performances List */}
                {swimmingPerformances.length > 0 ? (
                  swimmingPerformances.map((perf, pIndex) => {
                    const strokeMeta = STROKE_METADATA[perf.stroke];
                    const statusMeta = STATUS_METADATA[perf.status];

                    const avgGrade =
                      (perf.technique +
                        perf.start +
                        perf.turns +
                        perf.finish +
                        perf.paceConsistency) /
                      5;

                    const ratingsList = [
                      { label: t("builder.technique"), value: perf.technique },
                      { label: t("builder.start"), value: perf.start },
                      { label: t("builder.turns"), value: perf.turns },
                      { label: t("builder.finish"), value: perf.finish },
                      {
                        label: t("builder.paceConsistency"),
                        value: perf.paceConsistency,
                      },
                    ];

                    const drillComment =
                      perf.coachComment ||
                      (perf as unknown as { comment?: string }).comment ||
                      (perf as unknown as { notes?: string }).notes;

                    return (
                      <div key={perf.id || pIndex} className="space-y-4">
                        <div className="flex items-center justify-between pt-2">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                            <MdPool className="size-4" />
                            {swimmingPerformances.length > 1
                              ? `Swimming Drill ${pIndex + 1}`
                              : "Swimming Drill"}
                          </h4>
                          {canManage && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditDrill(perf)}
                              className="h-7 gap-1.5 text-xs cursor-pointer text-amber-600 hover:text-amber-700 hover:bg-amber-500/10"
                            >
                              <MdEdit className="size-3.5" />
                              {t("table.edit")}
                            </Button>
                          )}
                        </div>

                        {/* Stroke & Set Structure */}
                        <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <Badge
                              variant="outline"
                              className={cn(
                                "text-xs font-bold px-2.5 py-0.5",
                                strokeMeta?.badgeClass,
                              )}
                            >
                              {strokeMeta
                                ? t(strokeMeta.labelKey)
                                : "Freestyle"}
                            </Badge>
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-bold text-primary">
                                {perf.distanceMeters}m × {perf.repetitions} reps
                              </span>
                              {statusMeta && (
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-xs font-semibold px-2 py-0.5",
                                    statusMeta.badgeClass,
                                  )}
                                >
                                  {t(statusMeta.labelKey)}
                                </Badge>
                              )}
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                            <span>Rest Interval:</span>
                            <span className="font-semibold text-foreground">
                              {perf.restIntervalSeconds} seconds
                            </span>
                          </div>
                        </div>

                        {/* Split Times */}
                        <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                            <MdTimer className="size-4 text-emerald-500" />
                            {t("details.splitBreakdown")}
                          </h4>

                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="p-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">
                                Best Rep
                              </span>
                              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                                {formatTimeSpanDisplay(perf.bestRepTime)}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                                Average Rep
                              </span>
                              <span className="text-sm font-bold text-foreground font-mono">
                                {formatTimeSpanDisplay(perf.averageRepTime)}
                              </span>
                            </div>

                            <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex flex-col items-center">
                              <span className="text-[10px] font-bold uppercase text-muted-foreground">
                                Worst Rep
                              </span>
                              <span className="text-sm font-bold text-muted-foreground font-mono">
                                {formatTimeSpanDisplay(perf.worstRepTime)}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Technical Grades */}
                        <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <MdStars className="size-4 text-amber-500" />
                              {t("details.ratingsHeader")}
                            </h4>
                            <Badge
                              variant="secondary"
                              className="text-xs font-bold"
                            >
                              {avgGrade.toFixed(1)} / 5.0
                            </Badge>
                          </div>

                          <div className="space-y-2 pt-1">
                            {ratingsList.map((item, idx) => {
                              const meta = GRADE_METADATA[item.value];
                              return (
                                <div
                                  key={idx}
                                  className="flex items-center justify-between p-2 rounded-lg border border-border/50 bg-muted/20 text-xs"
                                >
                                  <span className="font-medium text-foreground">
                                    {item.label}
                                  </span>
                                  <div className="flex items-center gap-2">
                                    <MiniRatingBar rating={item.value} />
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "text-[10px] font-bold px-1.5 py-0",
                                        meta?.colorClass,
                                      )}
                                    >
                                      {meta ? t(meta.labelKey) : item.value}
                                    </Badge>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Coach Comment for Drill */}
                        {drillComment && (
                          <div className="p-4 rounded-xl border border-border bg-card space-y-2 shadow-xs">
                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                              <MdComment className="size-4 text-primary" />
                              {t("details.commentHeader")}
                            </h4>
                            <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-lg border border-border/50">
                              &quot;{drillComment}&quot;
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="text-center py-8 text-xs text-muted-foreground">
                    No swimming drills recorded for this session.
                  </div>
                )}
              </>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Edit individual drill modal */}
      <EditSwimmingPerformanceModal
        performance={selectedDrill}
        open={isEditDrillOpen}
        onOpenChange={setIsEditDrillOpen}
      />
    </>
  );
}
