import { useTranslation } from "react-i18next";
import {
  MdFitnessCenter,
  MdTimer,
  MdRepeat,
  MdNotes,
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
import { useExercisesLookup } from "@/features/lookups/hooks/useExercisesLookup";
import { useMe } from "@/features/auth/hooks/useMe";
import { RepsLabel, useRepsLabel } from "@/components/common/RepsLabel";
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
  const { data: lookupRes } = useExercisesLookup(undefined, open);
  const { data: meData } = useMe();
  const roles = meData?.data?.roles ?? [];
  const isSwimmingCoach = roles.includes("SwimmingCoach") && !roles.includes("FitnessCoach");

  const exerciseLookup = lookupRes?.data ?? [];
  const lookupMap = new Map(exerciseLookup.map((e) => [e.id, e]));

  const activePlan = detailRes?.data ?? plan;
  const assignments = assignmentsRes?.data ?? [];
  const exercises = activePlan?.planExercises ?? [];

  const isSwimmingPlan =
    isSwimmingCoach ||
    exercises.some((ex) => {
      const lookup = lookupMap.get(ex.exerciseId);
      const title = ex.exerciseName || lookup?.title || "";
      return (
        (ex as any).category != null ||
        title.toLowerCase().includes("swim") ||
        title.toLowerCase().includes("freestyle") ||
        title.toLowerCase().includes("backstroke") ||
        title.toLowerCase().includes("breaststroke") ||
        title.toLowerCase().includes("butterfly") ||
        title.toLowerCase().includes("kick") ||
        title.toLowerCase().includes("pull") ||
        title.toLowerCase().includes("drill")
      );
    });

  const planRepsMeta = useRepsLabel({ isSwimming: isSwimmingPlan });

  if (!activePlan) return null;

  const totalDuration = calculatePlanDuration(activePlan);
  const totalSets = exercises.reduce(
    (acc, ex) => acc + (Number(ex.sets) || 0),
    0,
  );
  const totalReps = exercises.reduce(
    (acc, ex) => acc + (Number(ex.sets) || 0) * (Number(ex.reps) || 0),
    0,
  );

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
                    {planRepsMeta.label}
                  </span>
                  <span className="text-sm font-bold text-foreground mt-0.5">
                    {totalReps}
                    {isSwimmingPlan ? "m" : ""}
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
                    {exercises.map((ex, index) => {
                      const lookup = lookupMap.get(ex.exerciseId);
                      const exerciseTitle =
                        ex.exerciseName ||
                        lookup?.title ||
                        `Exercise #${ex.exerciseId}`;

                      const isSwimEx =
                        isSwimmingCoach ||
                        (ex as any).category != null ||
                        exerciseTitle.toLowerCase().includes("swim") ||
                        exerciseTitle.toLowerCase().includes("freestyle") ||
                        exerciseTitle.toLowerCase().includes("backstroke") ||
                        exerciseTitle.toLowerCase().includes("breaststroke") ||
                        exerciseTitle.toLowerCase().includes("butterfly") ||
                        exerciseTitle.toLowerCase().includes("kick") ||
                        exerciseTitle.toLowerCase().includes("pull") ||
                        exerciseTitle.toLowerCase().includes("drill");

                      return (
                        <div
                          key={ex.id ?? index}
                          className="rounded-xl border border-border bg-card p-3.5 transition-all hover:border-primary/40 hover:shadow-2xs"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                                {ex.orderIndex || index + 1}
                              </span>
                              <span className="text-sm font-semibold text-foreground truncate">
                                {exerciseTitle}
                              </span>
                            </div>

                            {ex.duration > 0 && (
                              <Badge
                                variant="secondary"
                                className="text-xs font-medium shrink-0 bg-muted/60"
                              >
                                <MdTimer className="size-3 me-1 text-primary" />
                                {ex.duration} min
                              </Badge>
                            )}
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
                                <RepsLabel isSwimming={isSwimEx} />:
                              </span>{" "}
                              {ex.reps}
                              {isSwimEx ? "m" : ""}
                            </span>
                            {ex.restSeconds !== undefined && ex.restSeconds !== null && ex.restSeconds > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary">
                                <span className="font-normal opacity-80">
                                  Rest:
                                </span>{" "}
                                {ex.restSeconds}s
                              </span>
                            )}
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
                              <MdNotes className="size-3.5 shrink-0 mt-0.5 text-muted-foreground/70" />
                              <span className="leading-relaxed">{ex.notes}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
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
                                assignment.athlete.profilePictureUrl ??
                                undefined
                              }
                            />
                            <AvatarFallback className="text-[10px] font-semibold">
                              {assignment.athlete.fullName
                                .slice(0, 2)
                                .toUpperCase()}
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
