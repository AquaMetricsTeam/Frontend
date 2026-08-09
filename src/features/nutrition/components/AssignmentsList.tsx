import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdGroup, MdPerson } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
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
      return "bg-[#10B981]/10 text-[#10B981] border-[#10B981]/30";
    case "upcoming":
      return "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/30";
    case "ended":
      return "bg-[#64748B]/10 text-[#64748B] border-[#64748B]/30";
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

  const selectCls =
    "w-full px-3 py-1.5 text-xs border border-slate-700 rounded-md bg-slate-800/80 text-slate-300 focus:outline-none focus:ring-1 focus:ring-primary/50 appearance-none";

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex gap-2">
        <select value={planFilter} onChange={(e) => setPlanFilter(e.target.value)} className={selectCls}>
          <option value="all">{t("assignments.filters.allPlans")}</option>
          {plans.map((plan) => (
            <option key={plan.id} value={plan.id}>{plan.name}</option>
          ))}
        </select>

        <select
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value as AssignmentSource)}
          className={selectCls}
        >
          <option value="all">{t("assignments.filters.allSources")}</option>
          <option value="group">{t("assignments.filters.groupOnly")}</option>
          <option value="individual">{t("assignments.filters.individualOnly")}</option>
        </select>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as AssignmentStatus | "all")}
          className={selectCls}
        >
          <option value="all">{t("assignments.filters.allStatuses")}</option>
          <option value="active">{t("assignments.status.active")}</option>
          <option value="upcoming">{t("assignments.status.upcoming")}</option>
          <option value="ended">{t("assignments.status.ended")}</option>
        </select>
      </div>

      {/* Count */}
      <div className="text-right text-[11px] text-slate-500">
        {filteredAssignments.length} {t("assignments.assignmentsCount")}
      </div>

      {/* Grouped Assignments */}
      <div className="space-y-4">
        {assignmentsLoading ? (
          <div className="text-center py-10 text-xs text-slate-500">
            {t("common:loading")}
          </div>
        ) : filteredAssignments.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-500">
            {t("assignments.noAssignments")}
          </div>
        ) : (
          Array.from(groupedAssignments.entries()).map(([groupKey, groupAssignments]) => {
            const isGroup = groupKey !== "individual";
            const groupName = isGroup ? (groupMap.get(Number(groupKey)) ?? `Group ${groupKey}`) : null;

            return (
              <div
                key={groupKey}
                className="rounded-lg border border-slate-700/70 bg-slate-800/30 overflow-hidden"
              >
                {/* Group Header */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/60 bg-slate-800/50">
                  <div>
                    <div className="flex items-center gap-1.5">
                      {isGroup ? (
                        <MdGroup className="size-3.5 text-primary shrink-0" />
                      ) : (
                        <MdPerson className="size-3.5 text-slate-400 shrink-0" />
                      )}
                      <span className="text-sm font-semibold text-white">
                        {isGroup ? (groupName ?? `Group ${groupKey}`) : "Individual Assignments"}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mt-0.5 ms-5">
                      {isGroup ? "Assigned via group" : "Direct assignments"} · {groupAssignments.length} athletes
                    </p>
                  </div>
                  {isGroup ? (
                    <MdGroup className="size-4 text-slate-600" />
                  ) : (
                    <MdPerson className="size-4 text-slate-600" />
                  )}
                </div>

                {/* Assignment Rows */}
                <div className="divide-y divide-slate-700/40">
                  {groupAssignments.map((assignment) => {
                    const status = getAssignmentStatus(assignment);

                    const athleteName = assignment.athleteId
                      ? (assignment as any).athleteName || athleteMap.get(assignment.athleteId) || assignment.athleteId
                      : "—";
                    const assignedViaName = assignment.groupId != null
                      ? (groupMap.get(assignment.groupId) ?? `Group ${assignment.groupId}`)
                      : null;

                    return (
                      <div
                        key={assignment.id}
                        onClick={() => onAssignmentClick?.(assignment)}
                        className="flex items-center gap-4 px-4 py-2.5 hover:bg-slate-700/30 cursor-pointer transition-colors"
                      >
                        {/* Athlete Name */}
                        <div className="w-36 shrink-0">
                          <span className="text-sm font-medium text-white truncate block">
                            {athleteName}
                          </span>
                        </div>

                        {/* Plan Name */}
                        <div className="flex-1 min-w-0">
                          <span className="text-xs text-slate-400 truncate block">
                            {assignment.nutritionPlanName ?? "—"}
                          </span>
                        </div>

                        {/* Source Tag */}
                        <div className="hidden sm:block">
                          {assignment.groupId != null ? (
                            <span className="text-[11px] text-slate-400 whitespace-nowrap">
                              assigned via {assignedViaName ?? "Group"}
                            </span>
                          ) : (
                            <span className="text-[11px] text-slate-500">individual</span>
                          )}
                        </div>

                        {/* Date Range */}
                        <div className="text-[11px] text-slate-400 whitespace-nowrap min-w-[110px] text-right">
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
