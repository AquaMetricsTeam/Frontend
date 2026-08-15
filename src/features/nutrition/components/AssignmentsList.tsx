import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdGroup, MdPerson } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { usePlanAssignments, useAllPlanAssignments } from "../hooks/usePlanAssignments";
import { useNutritionPlans } from "../hooks/useNutritionPlans";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { useGroupsLookup } from "@/features/lookups/hooks/useGroupsLookup";
import type { NutritionPlanAssignment } from "../types/index";

interface AssignmentsListProps {
  onAssignmentClick?: (assignment: NutritionPlanAssignment) => void;
}

type AssignmentStatus = "active" | "upcoming" | "ended";
type AssignmentSource = "group" | "individual" | "all";

function getAssignmentStatus(assignment: NutritionPlanAssignment): AssignmentStatus {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const startDate = new Date(assignment.startDate);
  startDate.setHours(0, 0, 0, 0);

  if (today < startDate) return "upcoming";
  if (!assignment.endDate) return "active";

  const endDate = new Date(assignment.endDate);
  endDate.setHours(0, 0, 0, 0);

  return today > endDate ? "ended" : "active";
}

function getStatusColor(status: AssignmentStatus): string {
  switch (status) {
    case "active":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    case "upcoming":
      return "bg-primary/10 text-primary border-primary/20";
    case "ended":
      return "bg-muted text-muted-foreground border-border";
  }
}

function formatDateRange(startDate: string, endDate: string | null): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = new Date(startDate);
  if (!endDate) return `${fmt(start)} – ongoing`;
  return `${fmt(start)} – ${fmt(new Date(endDate))}`;
}

export function AssignmentsList({ onAssignmentClick }: AssignmentsListProps) {
  const { t } = useTranslation("nutrition");
  const [planFilter, setPlanFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<AssignmentSource>("all");
  const [statusFilter, setStatusFilter] = useState<AssignmentStatus | "all">("all");

  const { data: plansResponse } = useNutritionPlans({ pageSize: 100 });
  const plans = plansResponse?.data?.items ?? [];

  const planOptions = useMemo(
    () => plans.map((p) => ({ value: String(p.id), label: p.name })),
    [plans],
  );

  const isAllPlans = planFilter === "all";

  const { data: singleAssignmentsRes, isLoading: singleLoading } = usePlanAssignments(
    planFilter,
    { pageSize: 100 },
    !isAllPlans,
  );

  const allAssignmentsQueries = useAllPlanAssignments(
    plans.map(p => p.id),
    { pageSize: 100 },
    isAllPlans && plans.length > 0
  );

  const assignmentsLoading = isAllPlans
    ? allAssignmentsQueries.some(q => q.isLoading)
    : singleLoading;

  const assignments = useMemo(() => {
    if (isAllPlans) {
      return allAssignmentsQueries.flatMap(q =>
        Array.isArray(q.data?.data) ? q.data.data : []
      );
    } else {
      return Array.isArray(singleAssignmentsRes?.data) ? singleAssignmentsRes.data : [];
    }
  }, [isAllPlans, singleAssignmentsRes, allAssignmentsQueries]);

  const { data: athletesRes } = useAthletesLookup();
  const { data: groupsRes } = useGroupsLookup();

  const athleteMap = useMemo(
    () => new Map((athletesRes?.data ?? []).map((a) => [a.athleteId, a.fullName])),
    [athletesRes],
  );

  const groupMap = useMemo(
    () => new Map((groupsRes?.data ?? []).map((g) => [g.id, g.name])),
    [groupsRes],
  );

  const filteredAssignments = useMemo(() => {
    let filtered = assignments;

    if (planFilter !== "all") {
      filtered = filtered.filter((a) => String(a.nutritionPlanId) === planFilter);
    }

    if (sourceFilter !== "all") {
      if (sourceFilter === "group") {
        filtered = filtered.filter((a) => !!a.groupId);
      } else if (sourceFilter === "individual") {
        filtered = filtered.filter((a) => !a.groupId);
      }
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((a) => getAssignmentStatus(a) === statusFilter);
    }

    return filtered;
  }, [assignments, planFilter, sourceFilter, statusFilter]);

  const groupedAssignments = useMemo(() => {
    const groups = new Map<string, NutritionPlanAssignment[]>();

    filteredAssignments.forEach((assignment) => {
      const key =
        assignment.groupId != null ? String(assignment.groupId) : "individual";
      if (!groups.has(key)) {
        groups.set(key, []);
      }
      groups.get(key)!.push(assignment);
    });

    return groups;
  }, [filteredAssignments]);

  const activeFilterCount = [
    planFilter !== "all",
    sourceFilter !== "all",
    statusFilter !== "all",
  ].filter(Boolean).length;

  const getSourceLabel = (source: AssignmentSource) => {
    switch (source) {
      case "all":
        return t("assignments.filters.allSources");
      case "group":
        return t("assignments.filters.groupOnly");
      case "individual":
        return t("assignments.filters.individualOnly");
    }
  };

  const getStatusLabel = (status: AssignmentStatus | "all") => {
    switch (status) {
      case "all":
        return t("assignments.filters.allStatuses");
      case "active":
        return t("assignments.status.active");
      case "upcoming":
        return t("assignments.status.upcoming");
      case "ended":
        return t("assignments.status.ended");
    }
  };

  return (
    <div className="space-y-5">
      {/* Controls Bar & Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pb-4 border-b border-border">
        {/* 3 Filters Row Side-by-Side */}
        <div className="flex flex-wrap items-end gap-3">
          {/* Plan Filter */}
          <ComboboxSelect
            label={t("assignments.filters.planLabel")}
            placeholder={t("assignments.filters.allPlans")}
            clearLabel={t("assignments.filters.allPlans")}
            searchPlaceholder={t("assignments.filters.searchPlans")}
            options={planOptions}
            value={planFilter === "all" ? "" : planFilter}
            onValueChange={(val) => setPlanFilter(val || "all")}
            hasValue={planFilter !== "all"}
            className="w-full sm:w-44"
          />

          {/* Source Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-44">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
              {t("assignments.filters.sourceLabel")}
            </Label>
            <Select
              value={sourceFilter}
              onValueChange={(val) => setSourceFilter(val as AssignmentSource)}
            >
              <SelectTrigger className="h-9 w-full text-xs rounded-lg cursor-pointer">
                <SelectValue>{getSourceLabel(sourceFilter)}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="all" className="text-xs text-muted-foreground">
                  {t("assignments.filters.allSources")}
                </SelectItem>
                <SelectItem value="group" className="text-xs">
                  {t("assignments.filters.groupOnly")}
                </SelectItem>
                <SelectItem value="individual" className="text-xs">
                  {t("assignments.filters.individualOnly")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="flex flex-col gap-1 w-full sm:w-44">
            <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
              {t("assignments.filters.statusLabel")}
            </Label>
            <Select
              value={statusFilter}
              onValueChange={(val) => setStatusFilter(val as AssignmentStatus | "all")}
            >
              <SelectTrigger className="h-9 w-full text-xs rounded-lg cursor-pointer">
                <SelectValue>{getStatusLabel(statusFilter)}</SelectValue>
              </SelectTrigger>
              <SelectContent alignItemWithTrigger={false}>
                <SelectItem value="all" className="text-xs text-muted-foreground">
                  {t("assignments.filters.allStatuses")}
                </SelectItem>
                <SelectItem value="active" className="text-xs">
                  {t("assignments.status.active")}
                </SelectItem>
                <SelectItem value="upcoming" className="text-xs">
                  {t("assignments.status.upcoming")}
                </SelectItem>
                <SelectItem value="ended" className="text-xs">
                  {t("assignments.status.ended")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Assignments Count on the Far Opposite Side */}
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground sm:self-end mb-1 shrink-0">
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs font-semibold px-2.5 py-0.5"
          >
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400 me-1">{filteredAssignments.length}</span>
            {t("assignments.assignmentsCount")}
          </Badge>
          {activeFilterCount > 0 && (
            <Badge
              variant="secondary"
              className="text-[11px] bg-primary/10 text-primary border-primary/20"
            >
              {activeFilterCount}
            </Badge>
          )}
        </div>
      </div>

      {/* Grouped Assignments */}
      <div className="space-y-4">
        {assignmentsLoading ? (
          <div className="text-center py-10 text-xs text-muted-foreground">
            {t("common:loading")}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-10 text-xs text-muted-foreground">
            {t("assignments.noAssignments")}
          </div>
        ) : (
          Array.from(groupedAssignments.entries()).map(([groupKey, groupAssignments]) => {
            const isGroup = groupKey !== "individual";
            const groupName = isGroup ? (groupMap.get(Number(groupKey)) ?? `Group ${groupKey}`) : null;

            return (
              <div
                key={groupKey}
                className="rounded-lg border border-border bg-card overflow-hidden"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/50">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {isGroup ? (
                        <MdGroup className="size-3.5 text-primary shrink-0" />
                      ) : (
                        <MdPerson className="size-3.5 text-muted-foreground shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-foreground">
                        {isGroup ? (groupName ?? `Group ${groupKey}`) : "Individual Assignments"}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5 ms-5">
                      {isGroup ? "Assigned via group" : "Direct assignments"} · {groupAssignments.length} athletes
                    </p>
                  </div>
                  {isGroup ? (
                    <MdGroup className="size-4 text-muted-foreground" />
                  ) : (
                    <MdPerson className="size-4 text-muted-foreground" />
                  )}
                </div>

                {/* Assignment Rows */}
                <div className="divide-y divide-border">
                  {groupAssignments.map((assignment) => {
                    const status = getAssignmentStatus(assignment);

                    const athleteName = assignment.athleteId
                      ? assignment.athleteName || athleteMap.get(assignment.athleteId) || `Athlete (${assignment.athleteId})`
                      : "—";
                    const assignedViaName = assignment.groupId != null
                      ? (groupMap.get(assignment.groupId) ?? `Group ${assignment.groupId}`)
                      : null;

                    return (
                      <div
                        key={assignment.id}
                        onClick={() => onAssignmentClick?.(assignment)}
                        className="flex items-center gap-4 px-4 py-2.5 hover:bg-muted/50 cursor-pointer transition-colors"
                      >
                        {/* Athlete Name */}
                        <div className="w-36 shrink-0">
                          <span className="text-sm font-medium text-foreground truncate block">
                            {athleteName}
                          </span>
                        </div>

                        {/* Plan Name */}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-muted-foreground truncate block">
                            {assignment.nutritionPlanName ?? "—"}
                          </span>
                        </div>

                        {/* Source Tag */}
                        <div className="hidden sm:block">
                          {assignment.groupId != null ? (
                            <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                              assigned via {assignedViaName ?? "Group"}
                            </span>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/80">individual</span>
                          )}
                        </div>

                        {/* Date Range */}
                        <div className="text-[11px] text-muted-foreground whitespace-nowrap min-w-[110px] text-end">
                          {formatDateRange(assignment.startDate, assignment.endDate)}
                        </div>

                        {/* Status Badge */}
                        <div className="shrink-0">
                          <Badge
                            variant="outline"
                            className={`${getStatusColor(status)} text-[10px] font-semibold px-2 py-0 h-5`}
                          >
                            {t(`assignments.status.${status}`)}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

