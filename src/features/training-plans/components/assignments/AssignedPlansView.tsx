import { useState, useEffect } from "react";
import {
  MdPeople,
  MdPerson,
  MdDeleteOutline,
  MdAdd,
  MdTimer,
  MdFitnessCenter,
  MdAssignment,
} from "react-icons/md";
import Box from "@/components/layouts/Box";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchInput } from "@/components/common/SearchInput";
import { useTrainingPlans } from "../../hooks/useTrainingPlans";
import { useAssignments } from "../../hooks/useAssignments";
import { useDeleteAssignment } from "../../hooks/useDeleteAssignment";
import { AssignPlanSheet } from "./AssignPlanSheet";
import type { TrainingPlan } from "../../types/index";

export function AssignedPlansView() {
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [assignOpen, setAssignOpen] = useState(false);

  const {
    data: plansRes,
    isLoading: plansLoading,
    isError: plansError,
    refetch: refetchPlans,
  } = useTrainingPlans({ pageSize: 100, isArchived: false });
  const plans = plansRes?.data?.items ?? [];

  const searchLower = (search ?? "").toLowerCase();
  const filteredPlans = plans.filter((p) =>
    (p.title ?? "").toLowerCase().includes(searchLower),
  );

  useEffect(() => {
    if (!selectedPlan && filteredPlans.length > 0) {
      setSelectedPlan(filteredPlans[0]);
    }
  }, [filteredPlans, selectedPlan]);

  const activePlanId = selectedPlan?.id ?? 0;

  const {
    data: assignmentsRes,
    isLoading: assignmentsLoading,
    isError: assignmentsError,
    refetch: refetchAssignments,
  } = useAssignments(activePlanId, activePlanId > 0);
  const assignments = assignmentsRes?.data ?? [];

  const deleteMutation = useDeleteAssignment(activePlanId);

  function getInitials(name?: string): string {
    if (!name) return "AP";
    return name
      .split(" ")
      .map((part) => part[0])
      .filter(Boolean)
      .slice(0, 2)
      .join("")
      .toUpperCase();
  }

  function formatDate(dateStr: string): string {
    try {
      return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Training Plans List */}
        <div className="lg:col-span-6 space-y-4">
          <Box className="p-0 overflow-hidden">
            <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Training Plans
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a plan to manage its assigned athletes & teams
                </p>
              </div>
              <div className="w-full sm:w-48">
                <SearchInput
                  value={search}
                  onChange={setSearch}
                  placeholder="Search plans..."
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground ps-5">
                    Plan
                  </TableHead>
                  <TableHead className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground text-end pe-5">
                    Exercises
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableLoadingAndError
                  isLoading={plansLoading}
                  isError={plansError}
                  hasNoData={filteredPlans.length === 0}
                  skeletonProps={{ columns: 2, rows: 5 }}
                  errorMessageProps={{ onRetry: refetchPlans }}
                >
                  {filteredPlans.map((plan) => {
                    const isSelected = selectedPlan?.id === plan.id;
                    return (
                      <TableRow
                        key={plan.id}
                        onClick={() => setSelectedPlan(plan)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-accent/80 font-medium border-l-2 border-primary"
                            : "hover:bg-accent/30"
                        }`}
                      >
                        <TableCell className="ps-5 py-3.5">
                          <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-medium text-foreground">
                              {plan.title}
                            </span>
                            {plan.description && (
                              <span className="text-xs text-muted-foreground line-clamp-1">
                                {plan.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="pe-5 py-3.5 text-end">
                          <div className="flex items-center justify-end gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <MdFitnessCenter className="size-3.5 text-primary" />
                              {plan.planExercises?.length ?? 0}
                            </span>
                            <span className="flex items-center gap-1">
                              <MdTimer className="size-3.5" />~
                              {plan.estimatedDurationMinutes ?? 0}m
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableLoadingAndError>
              </TableBody>
            </Table>
          </Box>
        </div>

        {/* Right Panel: Active Plan Assignments */}
        <div className="lg:col-span-6 space-y-4">
          <Box className="p-4 sm:p-5 space-y-4">
            {selectedPlan ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">
                      {selectedPlan.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Current Assignments ({assignments.length})
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gap-1.5 self-start sm:self-auto text-xs"
                    onClick={() => setAssignOpen(true)}
                  >
                    <MdAdd className="size-4" />
                    Assign Plan
                  </Button>
                </div>

                {assignmentsLoading ? (
                  <div className="py-8 text-center text-xs text-muted-foreground">
                    Loading assignments...
                  </div>
                ) : assignmentsError ? (
                  <div className="py-8 text-center text-xs text-destructive">
                    Failed to load assignments.{" "}
                    <button
                      onClick={() => refetchAssignments()}
                      className="underline font-medium"
                    >
                      Retry
                    </button>
                  </div>
                ) : assignments.length === 0 ? (
                  <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                    <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                      <MdAssignment className="size-5" />
                    </div>
                    <p className="text-xs font-medium">No assignments yet</p>
                    <p className="text-[11px] max-w-xs">
                      This plan hasn&apos;t been assigned to any athletes or
                      teams. Click &quot;Assign Plan&quot; to assign it now.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {assignments.map((item) => {
                      const targetName =
                        item.athlete?.fullName ??
                        item.group?.name ??
                        item.assignedTo ??
                        "Assignment";
                      const isGroup =
                        !!item.group ||
                        item.assignedToType === 2 ||
                        targetName.toLowerCase().includes("group");

                      return (
                        <div
                          key={item.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-border bg-card hover:border-accent transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="size-9">
                              <AvatarImage
                                src={
                                  item.athlete?.profilePictureUrl ?? undefined
                                }
                              />
                              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                                {getInitials(targetName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-foreground truncate">
                                  {targetName}
                                </span>
                                {isGroup ? (
                                  <Badge
                                    variant="outline"
                                    className="gap-1 text-[10px] py-0 h-4"
                                  >
                                    <MdPeople className="size-3" />
                                    Group
                                  </Badge>
                                ) : (
                                  <Badge
                                    variant="outline"
                                    className="gap-1 text-[10px] py-0 h-4"
                                  >
                                    <MdPerson className="size-3" />
                                    Athlete
                                  </Badge>
                                )}
                              </div>
                              <span className="text-[11px] text-muted-foreground">
                                Assigned {formatDate(item.assignedAt)}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {item.status === "Completed" ? (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-zinc-500/10 text-zinc-400 border-zinc-500/20 px-2 py-0.5"
                              >
                                Completed
                              </Badge>
                            ) : (
                              <Badge
                                variant="secondary"
                                className="text-[10px] bg-emerald-500/10 text-emerald-500 border-emerald-500/20 px-2 py-0.5"
                              >
                                Active
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-destructive"
                              disabled={deleteMutation.isPending}
                              onClick={() => deleteMutation.mutate(item.id)}
                            >
                              <MdDeleteOutline className="size-4" />
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            ) : (
              <div className="py-12 flex flex-col items-center justify-center text-center gap-2 text-muted-foreground">
                <div className="size-10 rounded-full bg-muted flex items-center justify-center">
                  <MdAssignment className="size-5" />
                </div>
                <p className="text-xs font-medium">No Plan Selected</p>
                <p className="text-[11px]">
                  Select a training plan from the left list to view its
                  assignments.
                </p>
              </div>
            )}
          </Box>
        </div>
      </div>

      <AssignPlanSheet
        plan={selectedPlan}
        open={assignOpen}
        onOpenChange={setAssignOpen}
      />
    </>
  );
}
