import { useTranslation } from "react-i18next";
import {
  MdFitnessCenter,
  MdTimer,
  MdRepeat,
  MdNotes,
  MdPerson,
  MdGroup,
  MdAssignment,
  MdEdit,
  MdSportsGymnastics,
} from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loading } from "@/components/feedbacks/Loading";
import { useTrainingPlan } from "../../hooks/useTrainingPlan";
import { useAssignments } from "../../hooks/useAssignments";
import { calculatePlanDuration, type TrainingPlan } from "../../types/index";

interface TemplateDetailSheetProps {
  plan: TrainingPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEdit?: (plan: TrainingPlan) => void;
  onAssign?: (plan: TrainingPlan) => void;
}

export function TemplateDetailSheet({
  plan,
  open,
  onOpenChange,
  onEdit,
  onAssign,
}: TemplateDetailSheetProps) {
  const { t } = useTranslation("training");
  const planId = plan?.id ?? 0;

  const { data: detailRes, isLoading: planLoading } = useTrainingPlan(
    planId,
    open && planId > 0,
  );
  const { data: assignmentsRes, isLoading: assignmentsLoading } =
    useAssignments(planId, open && planId > 0);

  const activePlan = detailRes?.data ?? plan;
  const assignments = assignmentsRes?.data ?? [];

  if (!activePlan) return null;

  const totalDuration = calculatePlanDuration(activePlan);
  const exercises = activePlan.planExercises ?? [];
  const totalSets = exercises.reduce((acc, ex) => acc + (Number(ex.sets) || 0), 0);
  const totalReps = exercises.reduce((acc, ex) => acc + (Number(ex.reps) || 0), 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-xl flex flex-col gap-0 p-0 overflow-hidden">
        {/* Sheet Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border bg-card/60">
          <div className="flex items-start justify-between gap-3 pe-8">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
                <MdSportsGymnastics className="size-5" />
              </div>
              <div>
                <SheetTitle className="text-lg font-bold text-foreground">
                  {activePlan.title}
                </SheetTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge
                    variant={activePlan.isArchived ? "secondary" : "default"}
                    className={
                      activePlan.isArchived
                        ? "text-[10px] bg-muted text-muted-foreground"
                        : "text-[10px] bg-primary/15 text-primary border-primary/25 font-semibold"
                    }
                  >
                    {activePlan.isArchived
                      ? t("templates.filter.archived")
                      : t("templates.filter.active")}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    ID #{activePlan.id}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {activePlan.description && (
            <SheetDescription className="mt-3 text-xs text-muted-foreground bg-muted/30 p-3 rounded-lg border border-border/60 leading-relaxed text-start">
              {activePlan.description}
            </SheetDescription>
          )}
        </SheetHeader>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          {planLoading ? (
            <Loading label="Loading plan details…" className="py-16" />
          ) : (
            <>
              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-4 gap-2.5">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/40 border border-border/70 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <MdTimer className="size-3.5 text-primary" />
                    Duration
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {totalDuration}m
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/40 border border-border/70 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <MdFitnessCenter className="size-3.5 text-secondary-foreground" />
                    Exercises
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {exercises.length}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/40 border border-border/70 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1">
                    <MdRepeat className="size-3.5 text-amber-500" />
                    Sets
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {totalSets}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-accent/40 border border-border/70 text-center">
                  <span className="text-[11px] font-medium text-muted-foreground">
                    Reps
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {totalReps}
                  </span>
                </div>
              </div>

              {/* Exercises List Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Exercises Sequence ({exercises.length})
                  </h3>
                </div>

                {exercises.length === 0 ? (
                  <div className="py-8 text-center border border-dashed border-border rounded-xl text-xs text-muted-foreground">
                    No exercises added to this plan yet.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {exercises.map((ex, index) => (
                      <div
                        key={ex.id ?? index}
                        className="rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/40 hover:shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <span className="flex size-6 items-center justify-center rounded-lg bg-primary/10 text-primary text-xs font-bold shrink-0">
                              {index + 1}
                            </span>
                            <h4 className="text-sm font-semibold text-foreground">
                              {ex.exerciseName || `Exercise #${ex.exerciseId}`}
                            </h4>
                          </div>

                          <div className="flex items-center gap-1.5 shrink-0">
                            {ex.duration > 0 && (
                              <Badge
                                variant="outline"
                                className="text-[11px] px-2 py-0.5 gap-1 font-normal bg-accent/30"
                              >
                                <MdTimer className="size-3 text-primary" />
                                {ex.duration} min
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Exercise Metrics Badges */}
                        <div className="mt-2.5 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/20 px-2 py-1 text-xs font-medium text-foreground">
                            <span className="text-muted-foreground font-normal">
                              Sets:
                            </span>{" "}
                            {ex.sets}
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-secondary/20 px-2 py-1 text-xs font-medium text-foreground">
                            <span className="text-muted-foreground font-normal">
                              Reps:
                            </span>{" "}
                            {ex.reps}
                          </span>
                          {ex.intensity && (
                            <span className="inline-flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-600 dark:text-amber-400">
                              <span className="font-normal opacity-80">
                                Intensity:
                              </span>{" "}
                              {ex.intensity}
                            </span>
                          )}
                        </div>

                        {/* Exercise Notes */}
                        {ex.notes && (
                          <div className="mt-2.5 flex items-start gap-1.5 rounded-lg bg-muted/40 p-2 text-xs text-muted-foreground border border-border/40">
                            <MdNotes className="size-3.5 shrink-0 text-muted-foreground mt-0.5" />
                            <span className="italic">{ex.notes}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Active Assignments Section */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Current Assignments ({assignments.length})
                  </h3>
                </div>

                {assignmentsLoading ? (
                  <p className="text-xs text-muted-foreground py-2">
                    Loading assignments...
                  </p>
                ) : assignments.length === 0 ? (
                  <div className="flex items-center justify-between p-3 rounded-xl border border-dashed border-border bg-muted/10 text-xs text-muted-foreground">
                    <span>Not assigned to any athletes or groups yet.</span>
                    {onAssign && !activePlan.isArchived && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        className="h-7 text-xs gap-1 cursor-pointer"
                        onClick={() => {
                          onOpenChange(false);
                          onAssign(activePlan);
                        }}
                      >
                        <MdAssignment className="size-3.5" />
                        Assign Now
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {assignments.map((assignment) => (
                      <div
                        key={assignment.id}
                        className="flex items-center gap-2.5 p-2.5 rounded-xl border border-border bg-card/60"
                      >
                        {assignment.athlete ? (
                          <Avatar className="size-7 shrink-0">
                            <AvatarImage
                              src={
                                assignment.athlete.profilePictureUrl ?? undefined
                              }
                            />
                            <AvatarFallback className="text-[10px] font-semibold">
                              {assignment.athlete.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex size-7 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 shrink-0">
                            <MdGroup className="size-4" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground truncate">
                            {assignment.athlete?.fullName ??
                              assignment.group?.name ??
                              assignment.assignedTo}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            {assignment.athlete ? "Athlete" : "Group"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-border bg-card/60 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="cursor-pointer"
          >
            Close
          </Button>

          <div className="flex items-center gap-2">
            {!activePlan.isArchived && onAssign && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="gap-1.5 cursor-pointer"
                onClick={() => {
                  onOpenChange(false);
                  onAssign(activePlan);
                }}
              >
                <MdAssignment className="size-4" />
                Assign
              </Button>
            )}

            {!activePlan.isArchived && onEdit && (
              <Button
                type="button"
                size="sm"
                className="gap-1.5 cursor-pointer"
                onClick={() => {
                  onOpenChange(false);
                  onEdit(activePlan);
                }}
              >
                <MdEdit className="size-4" />
                Edit Plan
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
