import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { MdPerson, MdGroup, MdCheck, MdDeleteOutline } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Loading } from "@/components/feedbacks/Loading";
import { cn } from "@/lib/utils";
import { useAvailableAthletesLookup } from "@/features/lookups/hooks/useAvailableAthletesLookup";
import { useGroupsLookup } from "@/features/lookups/hooks/useGroupsLookup";
import { useAssignments } from "../../hooks/useAssignments";
import { useCreateAssignment } from "../../hooks/useCreateAssignment";
import { useDeleteAssignment } from "../../hooks/useDeleteAssignment";
import type { TrainingPlan } from "../../types/index";

type AssignTarget = "athletes" | "groups";

interface AssignPlanSheetProps {
  plan: TrainingPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AssignPlanSheet({
  plan,
  open,
  onOpenChange,
}: AssignPlanSheetProps) {
  const { t } = useTranslation(["training", "common"]);
  const [target, setTarget] = useState<AssignTarget>("athletes");
  const [selectedAthletes, setSelectedAthletes] = useState<string[]>([]);
  const [selectedGroups, setSelectedGroups] = useState<number[]>([]);

  const planId = plan?.id ?? 0;

  // Prefetch both lookups when drawer opens
  const { data: athleteRes, isLoading: athletesLoading } =
    useAvailableAthletesLookup(open);
  const { data: groupRes, isLoading: groupsLoading } = useGroupsLookup(open);

  // Fetch current assignments for default status & unassigning
  const { data: assignmentsRes, isLoading: assignmentsLoading } =
    useAssignments(planId, open && planId > 0);

  const athletes = athleteRes?.data ?? [];
  const groups = groupRes?.data ?? [];
  const existingAssignments = assignmentsRes?.data ?? [];

  useEffect(() => {
    if (!open) {
      setSelectedAthletes([]);
      setSelectedGroups([]);
      setTarget("athletes");
    }
  }, [open]);

  const assignMutation = useCreateAssignment(planId, () => {
    onOpenChange(false);
    setSelectedAthletes([]);
    setSelectedGroups([]);
  });

  const deleteMutation = useDeleteAssignment(planId);

  function toggleAthlete(id: string) {
    setSelectedAthletes((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  function toggleGroup(id: number) {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }

  const canAssign = selectedAthletes.length > 0 || selectedGroups.length > 0;

  const getConfirmLabel = () => {
    const parts: string[] = [];
    if (selectedGroups.length > 0) {
      parts.push(
        selectedGroups.length === 1
          ? t("training:assign.confirmGroups", { count: selectedGroups.length })
          : t("training:assign.confirmGroups_plural", { count: selectedGroups.length })
      );
    }
    if (selectedAthletes.length > 0) {
      parts.push(
        selectedAthletes.length === 1
          ? t("training:assign.confirm", { count: selectedAthletes.length })
          : t("training:assign.confirm_plural", { count: selectedAthletes.length })
      );
    }
    return parts.join(" & ");
  };

  function handleAssign() {
    if (!plan) return;
    assignMutation.mutate({
      trainingPlanId: plan.id,
      athleteIds: selectedAthletes,
      groupIds: selectedGroups,
    });
  }

  const isLoadingData =
    assignmentsLoading ||
    (target === "athletes" ? athletesLoading : groupsLoading);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md flex flex-col gap-0 p-0">
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <SheetTitle className="text-base font-semibold">
            {t("training:assign.title")}
          </SheetTitle>
          {plan && (
            <SheetDescription className="text-sm text-muted-foreground">
              &quot;{plan.title}&quot;
            </SheetDescription>
          )}
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Separated Tabs for Athletes & Groups */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setTarget("athletes")}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                target === "athletes"
                  ? "border-blue-500 bg-blue-500/10 text-blue-500"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <MdPerson className="size-4 shrink-0" />
                {t("training:assignments.athletesTab")}
              </span>
              {selectedAthletes.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-blue-500 text-white font-bold shrink-0"
                >
                  {selectedAthletes.length}
                </Badge>
              )}
            </button>

            <button
              type="button"
              onClick={() => setTarget("groups")}
              className={cn(
                "flex items-center justify-between rounded-xl border-2 px-3.5 py-2.5 text-xs font-semibold transition-all duration-200 cursor-pointer",
                target === "groups"
                  ? "border-amber-500 bg-amber-500/10 text-amber-500"
                  : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/40",
              )}
            >
              <span className="flex items-center gap-1.5 truncate">
                <MdGroup className="size-4 shrink-0" />
                {t("training:assignments.groupsTab")}
              </span>
              {selectedGroups.length > 0 && (
                <Badge
                  variant="secondary"
                  className="text-[10px] px-1.5 py-0 h-4 bg-amber-500 text-white font-bold shrink-0"
                >
                  {selectedGroups.length}
                </Badge>
              )}
            </button>
          </div>

          {isLoadingData ? (
            <Loading label={t("common:loading")} className="py-12" />
          ) : (
            <>
              {/* Athletes Tab List */}
              {target === "athletes" && (
                <div className="flex flex-col gap-2">
                  {athletes.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      {t("training:assignments.noAthletesAvailable")}
                    </p>
                  ) : (
                    athletes.map((athlete) => {
                      const existing = existingAssignments.find(
                        (a) =>
                          a.athlete?.athleteId === athlete.athleteId ||
                          (a.assignedTo ?? "").toLowerCase() ===
                            (athlete.fullName ?? "").toLowerCase(),
                      );
                      const isSelected = selectedAthletes.includes(
                        athlete.athleteId,
                      );

                      return (
                        <div
                          key={athlete.athleteId}
                          className={cn(
                            "flex items-center gap-3 rounded-xl p-2.5 border transition-all duration-150",
                            existing
                              ? "border-emerald-500/40 bg-emerald-500/10"
                              : isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-accent/50",
                          )}
                        >
                          <Avatar className="size-8 shrink-0">
                            <AvatarImage
                              src={athlete.profilePictureUrl ?? undefined}
                            />
                            <AvatarFallback className="text-xs font-semibold">
                              {athlete.fullName.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="flex-1 text-xs font-medium text-foreground truncate">
                            {athlete.fullName}
                          </span>

                          {existing ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2.5 gap-1.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30 transition-all duration-150 group/unassign cursor-pointer"
                              title={t("training:assignments.unassign")}
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(existing.id)}
                            >
                              <MdCheck className="size-3.5 group-hover/unassign:hidden" />
                              <MdDeleteOutline className="size-3.5 hidden group-hover/unassign:inline-block" />
                              <span className="group-hover/unassign:hidden">{t("training:assignments.active")}</span>
                              <span className="hidden group-hover/unassign:inline-block">{t("training:assignments.unassign")}</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-xs px-2.5 cursor-pointer"
                              onClick={() => toggleAthlete(athlete.athleteId)}
                            >
                              {isSelected ? (
                                <>
                                  <MdCheck className="size-3.5 me-1" /> {t("common:actions.selected", { defaultValue: "Selected" })}
                                </>
                              ) : (
                                t("common:actions.select", { defaultValue: "Select" })
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* Groups Tab List */}
              {target === "groups" && (
                <div className="flex flex-col gap-2">
                  {groups.length === 0 ? (
                    <p className="py-6 text-center text-xs text-muted-foreground">
                      {t("training:assignments.noGroupsAvailable")}
                    </p>
                  ) : (
                    groups.map((group) => {
                      const existing = existingAssignments.find(
                        (a) =>
                          a.group?.id === group.id ||
                          (a.assignedTo ?? "").toLowerCase() ===
                            (group.name ?? "").toLowerCase(),
                      );
                      const isSelected = selectedGroups.includes(group.id);

                      return (
                        <div
                          key={group.id}
                          className={cn(
                            "flex items-center gap-3 rounded-xl p-2.5 border transition-all duration-150",
                            existing
                              ? "border-emerald-500/40 bg-emerald-500/10"
                              : isSelected
                                ? "border-primary bg-primary/10"
                                : "border-border hover:bg-accent/50",
                          )}
                        >
                          <div className="flex size-8 items-center justify-center rounded-lg bg-amber-500/15 shrink-0">
                            <MdGroup className="size-4 text-amber-600 dark:text-amber-400" />
                          </div>
                          <span className="flex-1 text-xs font-medium text-foreground truncate">
                            {group.name}
                          </span>
                          {group.athleteCount !== undefined && (
                            <Badge variant="secondary" className="text-[10px]">
                              {group.athleteCount} {t("training:assignments.athletesTab")}
                            </Badge>
                          )}

                          {existing ? (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="h-7 text-xs px-2.5 gap-1.5 bg-emerald-500/10 text-emerald-500 border-emerald-500/30 hover:bg-destructive/15 hover:text-destructive hover:border-destructive/30 transition-all duration-150 group/unassign cursor-pointer"
                              title={t("training:assignments.unassign")}
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(existing.id)}
                            >
                              <MdCheck className="size-3.5 group-hover/unassign:hidden" />
                              <MdDeleteOutline className="size-3.5 hidden group-hover/unassign:inline-block" />
                              <span className="group-hover/unassign:hidden">{t("training:assignments.active")}</span>
                              <span className="hidden group-hover/unassign:inline-block">{t("training:assignments.unassign")}</span>
                            </Button>
                          ) : (
                            <Button
                              type="button"
                              variant={isSelected ? "default" : "outline"}
                              size="sm"
                              className="h-7 text-xs px-2.5 cursor-pointer"
                              onClick={() => toggleGroup(group.id)}
                            >
                              {isSelected ? (
                                <>
                                  <MdCheck className="size-3.5 me-1" /> {t("common:actions.selected", { defaultValue: "Selected" })}
                                </>
                              ) : (
                                t("common:actions.select", { defaultValue: "Select" })
                              )}
                            </Button>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </>
          )}
        </div>

        <div className="px-6 pb-6 pt-4 border-t border-border">
          <Button
            onClick={handleAssign}
            disabled={!canAssign || assignMutation.isPending}
            className="w-full cursor-pointer"
          >
            {assignMutation.isPending
              ? t("training:assign.assigning")
              : canAssign
                ? getConfirmLabel()
                : t("training:assign.selectTargets")}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
