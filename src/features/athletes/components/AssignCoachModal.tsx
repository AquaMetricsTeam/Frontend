import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdPersonAdd,
  MdDeleteOutline,
  MdSports,
  MdCheck,
} from "react-icons/md";
import { ChevronsUpDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";
import { useCoachesLookup } from "@/features/lookups/hooks/useCoachesLookup";
import { useAssignCoach } from "../hooks/useAssignCoach";
import { useRemoveCoachAssignment } from "../hooks/useRemoveCoachAssignment";
import type { AdminAthlete } from "../types/index";

interface AssignCoachModalProps {
  athlete: AdminAthlete | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Per-role color tokens
const ROLE_STYLES: Record<
  string,
  { badge: string; icon: string; avatar: string }
> = {
  SwimmingCoach: {
    badge: "border-blue-500/30 text-blue-600 dark:text-blue-400 bg-blue-500/10",
    icon: "text-blue-500",
    avatar: "bg-blue-500/15 text-blue-600 dark:text-blue-400",
  },
  FitnessCoach: {
    badge:
      "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
    icon: "text-emerald-500",
    avatar: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  NutritionSpecialist: {
    badge:
      "border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10",
    icon: "text-amber-500",
    avatar: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
};

const DEFAULT_ROLE_STYLE = {
  badge: "border-primary/30 text-primary bg-primary/10",
  icon: "text-primary",
  avatar: "bg-primary/15 text-primary",
};

function getRoleStyle(role: string) {
  return ROLE_STYLES[role] ?? DEFAULT_ROLE_STYLE;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatRole(role: string) {
  switch (role) {
    case "SwimmingCoach":
      return "Swimming Coach";
    case "FitnessCoach":
      return "Fitness Coach";
    case "NutritionSpecialist":
      return "Nutrition Specialist";
    default:
      return role;
  }
}

export function AssignCoachModal({
  athlete,
  open,
  onOpenChange,
}: AssignCoachModalProps) {
  const { t } = useTranslation("athletes");
  const [selectedCoachId, setSelectedCoachId] = useState<string>("");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [removingAssignmentId, setRemovingAssignmentId] = useState<
    number | null
  >(null);

  const { data: lookupRes, isLoading: isLoadingCoaches } =
    useCoachesLookup(open);
  const availableCoaches = lookupRes?.data ?? [];

  const assignMutation = useAssignCoach(() => {
    setSelectedCoachId("");
    onOpenChange(false);
  });

  const removeMutation = useRemoveCoachAssignment(() => {
    setRemovingAssignmentId(null);
  });

  if (!athlete) return null;

  const assignedCoachIds = new Set(
    athlete.assignedCoaches.map((c) => c.coachId),
  );
  const unassignedCoaches = availableCoaches.filter(
    (c) => !assignedCoachIds.has(c.id),
  );
  const selectedCoach = availableCoaches.find((c) => c.id === selectedCoachId);

  // Extract API error message from mutation error
  // const assignError = assignMutation.error as {
  //   message?: string;
  //   data?: null;
  //   success?: false;
  // } | null;
  // Try to extract from response body (customFetch may throw with the response body)
  // const assignErrorMsg = assignError?.message ?? null;

  function handleAssign() {
    if (!athlete || !selectedCoachId) return;
    assignMutation.mutate({
      athleteId: athlete.athleteId,
      coachId: selectedCoachId,
    });
  }

  function handleRemove(assignmentId: number) {
    if (!athlete) return;
    setRemovingAssignmentId(assignmentId);
    removeMutation.mutate({
      athleteId: athlete.athleteId,
      assignmentId,
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg p-0 overflow-hidden rounded-xl border border-border bg-card text-card-foreground shadow-2xl">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6 pb-5 border-b border-border/50">
          <DialogHeader className="gap-1">
            <div className="flex items-center gap-3">
              {athlete.profilePictureUrl ? (
                <img
                  src={athlete.profilePictureUrl}
                  alt={athlete.fullName}
                  className="h-12 w-12 rounded-full object-cover border-2 border-primary/20 shadow-sm"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-lg shadow-inner">
                  {getInitials(athlete.fullName)}
                </div>
              )}
              <div>
                <DialogTitle className="text-xl font-bold tracking-tight">
                  {t("modal.assignTitle")}
                </DialogTitle>
                <DialogDescription className="text-sm text-muted-foreground mt-0.5">
                  {t("modal.assignDescription", { name: athlete.fullName })}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1: Current Assigned Coaches */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t("modal.currentCoaches")} ({athlete.assignedCoaches.length})
            </h4>

            {athlete.assignedCoaches.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-center text-sm text-muted-foreground bg-muted/30">
                {t("modal.noAssignedCoaches")}
              </div>
            ) : (
              <div className="space-y-2.5">
                {athlete.assignedCoaches.map((c) => {
                  const isRemoving =
                    removeMutation.isPending &&
                    removingAssignmentId === c.assignmentId;
                  const style = getRoleStyle(c.role);

                  return (
                    <div
                      key={c.coachId}
                      className="flex items-center justify-between p-3 rounded-lg border border-border/80 bg-background hover:border-primary/30 transition-all shadow-xs"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-8 w-8 items-center justify-center rounded-full ${style.avatar}`}
                        >
                          <MdSports className={`size-4 ${style.icon}`} />
                        </div>
                        <div>
                          <div className="font-semibold text-sm text-foreground">
                            {c.coachName}
                          </div>
                          <Badge
                            variant="outline"
                            className={`text-[10px] py-0 px-2 rounded-full font-medium mt-0.5 ${style.badge}`}
                          >
                            {formatRole(c.role)}
                          </Badge>
                        </div>
                      </div>

                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 cursor-pointer"
                        disabled={isRemoving || !c.assignmentId}
                        onClick={() => handleRemove(c.assignmentId)}
                      >
                        <MdDeleteOutline className="size-4 me-1" />
                        {isRemoving ? t("modal.removing") : t("modal.remove")}
                      </Button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section 2: Assign New Coach — Combobox */}
          <div className="pt-2 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              {t("modal.assignNewCoach")}
            </h4>

            <div className="flex flex-col sm:flex-row gap-2.5">
              {/* Combobox */}
              <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
                <PopoverTrigger
                  render={
                    <button
                      type="button"
                      role="combobox"
                      aria-expanded={comboboxOpen}
                      disabled={isLoadingCoaches || assignMutation.isPending}
                      className="flex-1 h-10 justify-between rounded-lg border border-input bg-background px-3 font-normal text-sm cursor-pointer flex items-center gap-2 disabled:opacity-50"
                    />
                  }
                >
                  {selectedCoach ? (
                    <span className="flex items-center gap-2 flex-1 min-w-0">
                      {selectedCoach.profilePictureUrl ? (
                        <img
                          src={selectedCoach.profilePictureUrl}
                          alt={selectedCoach.fullName}
                          className="h-5 w-5 rounded-full object-cover shrink-0"
                        />
                      ) : (
                        <div
                          className={`flex h-5 w-5 items-center justify-center rounded-full text-[9px] font-bold shrink-0 ${getRoleStyle(selectedCoach.role).avatar}`}
                        >
                          {getInitials(selectedCoach.fullName)}
                        </div>
                      )}
                      <span className="truncate flex-1">
                        {selectedCoach.fullName}
                      </span>
                      <Badge
                        variant="outline"
                        className={`text-[10px] py-0 px-1.5 rounded-full shrink-0 ${getRoleStyle(selectedCoach.role).badge}`}
                      >
                        {formatRole(selectedCoach.role)}
                      </Badge>
                    </span>
                  ) : (
                    <span className="text-muted-foreground flex-1 text-start">
                      {isLoadingCoaches
                        ? t("modal.loadingCoaches")
                        : t("modal.selectCoach")}
                    </span>
                  )}
                  <ChevronsUpDown className="ms-auto size-4 shrink-0 opacity-50" />
                </PopoverTrigger>

                <PopoverContent className="p-0" align="start" side="bottom">
                  <Command>
                    <CommandInput placeholder={t("modal.searchCoach")} />
                    <CommandList>
                      <CommandEmpty>{t("modal.noCoachFound")}</CommandEmpty>
                      <CommandGroup>
                        {unassignedCoaches.map((coach) => {
                          const style = getRoleStyle(coach.role);
                          return (
                            <CommandItem
                              key={coach.id}
                              value={`${coach.fullName} ${coach.role}`}
                              onSelect={() => {
                                setSelectedCoachId(coach.id);
                                setComboboxOpen(false);
                              }}
                              data-checked={selectedCoachId === coach.id}
                              className="cursor-pointer"
                            >
                              <div className="flex items-center gap-2.5 flex-1">
                                {coach.profilePictureUrl ? (
                                  <img
                                    src={coach.profilePictureUrl}
                                    alt={coach.fullName}
                                    className="h-7 w-7 rounded-full object-cover border border-border/50 shrink-0"
                                  />
                                ) : (
                                  <div
                                    className={`flex h-7 w-7 items-center justify-center rounded-full text-[10px] font-bold border shrink-0 ${style.avatar}`}
                                  >
                                    {getInitials(coach.fullName)}
                                  </div>
                                )}
                                <div>
                                  <div className="font-medium text-sm">
                                    {coach.fullName}
                                  </div>
                                  <span
                                    className={`text-[11px] font-medium ${style.icon}`}
                                  >
                                    {formatRole(coach.role)}
                                  </span>
                                </div>
                              </div>
                              {selectedCoachId === coach.id && (
                                <MdCheck className="size-4 text-primary shrink-0" />
                              )}
                            </CommandItem>
                          );
                        })}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Button
                size="default"
                className="h-10 px-5 gap-2 rounded-lg cursor-pointer min-w-28"
                disabled={
                  !selectedCoachId ||
                  assignMutation.isPending ||
                  isLoadingCoaches
                }
                onClick={handleAssign}
              >
                {assignMutation.isPending ? (
                  t("modal.assigning")
                ) : (
                  <>
                    <MdPersonAdd className="size-4" />
                    {t("modal.assign")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
