import { useTranslation } from "react-i18next";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import {
  MdTimer,
  MdPool,
  MdFitnessCenter,
  MdSpeed,
  MdComment,
  MdStars,
} from "react-icons/md";
import type { SwimmingPerformance } from "../types";
import { STROKE_METADATA, STATUS_METADATA, GRADE_METADATA } from "../constants/enums";
import { formatTimeSpanDisplay } from "./MmSsInput";
import { MiniRatingBar } from "./SegmentedRatingControl";
import { cn } from "@/lib/utils";

interface SwimmingPerformanceDetailSheetProps {
  performance: SwimmingPerformance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SwimmingPerformanceDetailSheet({
  performance,
  open,
  onOpenChange,
}: SwimmingPerformanceDetailSheetProps) {
  const { t } = useTranslation("swimming");

  if (!performance) return null;

  const strokeMeta = STROKE_METADATA[performance.stroke];
  const statusMeta = STATUS_METADATA[performance.status];

  const avgGrade =
    (performance.technique +
      performance.start +
      performance.turns +
      performance.finish +
      performance.paceConsistency) /
    5;

  const ratingsList = [
    { label: t("builder.technique"), value: performance.technique },
    { label: t("builder.start"), value: performance.start },
    { label: t("builder.turns"), value: performance.turns },
    { label: t("builder.finish"), value: performance.finish },
    { label: t("builder.paceConsistency"), value: performance.paceConsistency },
  ];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="text-base font-bold text-foreground flex items-center gap-2">
              <MdPool className="size-5 text-primary" />
              {performance.athleteName ?? "Athlete Performance"}
            </SheetTitle>
            <Badge
              variant="outline"
              className={cn("text-xs font-semibold px-2 py-0.5", statusMeta?.badgeClass)}
            >
              {statusMeta ? t(statusMeta.labelKey) : "Completed"}
            </Badge>
          </div>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            {performance.trainingSessionTitle ?? "Training Session"} • {performance.sessionDate ?? "Logged Set"}
          </SheetDescription>
        </SheetHeader>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* Stroke & Set Structure Summary Card */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Badge
                variant="outline"
                className={cn("text-xs font-bold px-2.5 py-0.5", strokeMeta?.badgeClass)}
              >
                {strokeMeta ? t(strokeMeta.labelKey) : "Freestyle"}
              </Badge>

              <span className="text-xs font-bold text-primary">
                {performance.distanceMeters} meters × {performance.repetitions} reps
              </span>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
              <span>Rest Interval:</span>
              <span className="font-semibold text-foreground">
                {performance.restIntervalSeconds} seconds
              </span>
            </div>
          </div>

          {/* Split Laps Timing Card */}
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
                  {formatTimeSpanDisplay(performance.bestRepTime)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Average Rep
                </span>
                <span className="text-sm font-bold text-foreground font-mono">
                  {formatTimeSpanDisplay(performance.averageRepTime)}
                </span>
              </div>

              <div className="p-2.5 rounded-lg border border-border bg-muted/30 flex flex-col items-center">
                <span className="text-[10px] font-bold uppercase text-muted-foreground">
                  Worst Rep
                </span>
                <span className="text-sm font-bold text-muted-foreground font-mono">
                  {formatTimeSpanDisplay(performance.worstRepTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Coach Technical Grades */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <MdStars className="size-4 text-amber-500" />
                {t("details.ratingsHeader")}
              </h4>
              <Badge variant="secondary" className="text-xs font-bold">
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
                    <span className="font-medium text-foreground">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <MiniRatingBar rating={item.value} />
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold px-1.5 py-0", meta?.colorClass)}
                      >
                        {meta ? t(meta.labelKey) : item.value}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RPE Exertion */}
          {performance.rpe && (
            <div className="p-4 rounded-xl border border-border bg-card space-y-2 shadow-xs">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-muted-foreground uppercase flex items-center gap-1.5">
                  <MdFitnessCenter className="size-4 text-primary" />
                  {t("details.rpeHeader")}
                </span>
                <Badge
                  variant="outline"
                  className={cn(
                    "text-xs font-bold px-2 py-0.5",
                    performance.rpe >= 8
                      ? "bg-rose-500/10 text-rose-600 border-rose-500/30"
                      : performance.rpe >= 5
                        ? "bg-amber-500/10 text-amber-600 border-amber-500/30"
                        : "bg-emerald-500/10 text-emerald-600 border-emerald-500/30",
                  )}
                >
                  RPE {performance.rpe} / 10
                </Badge>
              </div>

              {/* Progress gauge */}
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all rounded-full",
                    performance.rpe >= 8
                      ? "bg-rose-500"
                      : performance.rpe >= 5
                        ? "bg-amber-500"
                        : "bg-emerald-500",
                  )}
                  style={{ width: `${(performance.rpe / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Coach Comments */}
          <div className="p-4 rounded-xl border border-border bg-card space-y-2 shadow-xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <MdComment className="size-4 text-primary" />
              {t("details.commentHeader")}
            </h4>

            {performance.coachComment ? (
              <p className="text-xs text-foreground leading-relaxed italic bg-muted/30 p-3 rounded-lg border border-border/50">
                &quot;{performance.coachComment}&quot;
              </p>
            ) : (
              <p className="text-xs text-muted-foreground italic">
                {t("details.noComment")}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
