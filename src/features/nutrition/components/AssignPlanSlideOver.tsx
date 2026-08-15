import { useState, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import {
  MdClose,
  MdCheckCircle,
  MdWarning,
  MdPeople,
  MdPerson,
} from "react-icons/md";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { SearchInput } from "@/components/common/SearchInput";
import { useAssignMultipleAthletes } from "../hooks/useAssignMultipleAthletes";
import { useAssignPlanToGroup } from "../hooks/useAssignPlanToGroup";
import { useGroupsLookup } from "@/features/lookups/hooks/useGroupsLookup";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import type { MultiAthleteAssignmentResult, NutritionPlan } from "../types/index";
import type { AthleteLookupItem, GroupLookupItem } from "@/features/lookups/types/index";

// ─── Props ────────────────────────────────────────────────────────────────────

interface AssignPlanSlideOverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  plan: NutritionPlan | null;
}

type TargetMode = "athlete" | "group";

// ─── Small pure sub-components (defined outside to avoid re-creating on render)

/** Primary pill showing the plan name under the drawer title */
function PlanNamePill({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-1.5 py-px text-[11px] font-medium text-primary max-w-full">
      <span className="truncate">{name}</span>
    </span>
  );
}

/** Segmented mode toggle: Individual Athletes | Group */
function ModeToggle({
  value,
  onChange,
  disabled,
}: {
  value: TargetMode;
  onChange: (v: TargetMode) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation("nutrition");
  const modes: { key: TargetMode; icon: React.ReactNode }[] = [
    { key: "athlete", icon: <MdPerson className="size-3.5 shrink-0" /> },
    { key: "group",   icon: <MdPeople  className="size-3.5 shrink-0" /> },
  ];
  return (
    <div className="flex rounded-lg border border-border bg-muted/50 p-0.5 gap-0.5">
      {modes.map(({ key, icon }) => (
        <button
          key={key}
          type="button"
          disabled={disabled}
          onClick={() => onChange(key)}
          className={[
            "flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-all select-none cursor-pointer",
            value === key
              ? "border border-primary/30 bg-primary/15 text-primary shadow-xs"
              : "border border-transparent text-muted-foreground hover:text-foreground",
          ].join(" ")}
        >
          {icon}
          {t(`assign.mode.${key}`)}
        </button>
      ))}
    </div>
  );
}

/** Single athlete row with avatar initials, name, and custom checkbox */
function AthleteRow({
  athlete,
  checked,
  onToggle,
}: {
  athlete: AthleteLookupItem;
  checked: boolean;
  onToggle: (id: string) => void;
}) {
  const initials = athlete.fullName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <button
      type="button"
      onClick={() => onToggle(athlete.athleteId)}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer",
        checked
          ? "border border-primary/30 bg-primary/10"
          : "border border-transparent hover:bg-muted/50",
      ].join(" ")}
    >
      {/* Avatar */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {athlete.profilePictureUrl ? (
          <img
            src={athlete.profilePictureUrl}
            alt={athlete.fullName}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Name */}
      <span className="flex-1 truncate text-sm font-medium text-foreground">
        {athlete.fullName}
      </span>

      {/* Custom checkbox */}
      <span
        aria-hidden="true"
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors",
          checked
            ? "border-primary bg-primary"
            : "border-border bg-transparent",
        ].join(" ")}
      >
        {checked && (
          <svg
            viewBox="0 0 10 8"
            className="h-2.5 w-2.5"
            fill="none"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M1 4l2.5 2.5L9 1" />
          </svg>
        )}
      </span>
    </button>
  );
}

/** Single group row with icon, name, member count, and radio-style indicator */
function GroupRow({
  group,
  checked,
  onToggle,
}: {
  group: GroupLookupItem;
  checked: boolean;
  onToggle: (id: number) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onToggle(group.id)}
      className={[
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-start transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary/50 cursor-pointer",
        checked
          ? "border border-primary/30 bg-primary/10"
          : "border border-transparent hover:bg-muted/50",
      ].join(" ")}
    >
      {/* Icon */}
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <MdPeople className="size-4" />
      </div>

      <div className="flex flex-1 flex-col min-w-0">
        <span className="truncate text-sm font-medium text-foreground">{group.name}</span>
        {group.athleteCount != null && (
          <span className="text-xs text-muted-foreground">{group.athleteCount} athletes</span>
        )}
      </div>

      {/* Radio indicator */}
      <span
        aria-hidden="true"
        className={[
          "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors",
          checked
            ? "border-primary bg-primary"
            : "border-border bg-transparent",
        ].join(" ")}
      >
        {checked && (
          <span className="h-1.5 w-1.5 rounded-full bg-white" />
        )}
      </span>
    </button>
  );
}

/** Inline result panel shown after all assignment requests have settled */
function BatchResultPanel({
  result,
  onDone,
}: {
  result: MultiAthleteAssignmentResult;
  onDone: () => void;
}) {
  const { t } = useTranslation("nutrition");
  const { succeeded, failed } = result;

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex-1 overflow-y-auto space-y-5 p-4">
        {succeeded.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MdCheckCircle className="size-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
              <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">
                {t("modal.assignmentResult.assigned")}
              </span>
              <Badge className="ms-auto border-0 bg-emerald-600 text-white">
                {succeeded.length}
              </Badge>
            </div>
            <div className="divide-y divide-emerald-500/10 rounded-lg border border-emerald-500/20 bg-emerald-500/5">
              {succeeded.map((r) => (
                <div key={r.athleteId} className="flex items-center gap-2 px-3 py-2">
                  <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-500" />
                  <span className="text-sm text-foreground">{r.fullName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {failed.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <MdWarning className="size-4 shrink-0 text-amber-600 dark:text-amber-400" />
              <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">
                {t("modal.assignmentResult.skipped")}
              </span>
              <Badge className="ms-auto border-0 bg-amber-600 text-white">
                {failed.length}
              </Badge>
            </div>
            <div className="divide-y divide-amber-500/10 rounded-lg border border-amber-500/20 bg-amber-500/5">
              {failed.map((r) => (
                <div key={r.athleteId} className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                    <span className="text-sm text-foreground">{r.fullName}</span>
                  </div>
                  {r.message && (
                    <p className="ms-3.5 mt-0.5 text-xs text-muted-foreground">{r.message}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-t border-border p-4">
        <Button
          className="w-full cursor-pointer"
          onClick={onDone}
        >
          {t("common:close")}
        </Button>
      </div>
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function AssignPlanSlideOver({
  open,
  onOpenChange,
  plan,
}: AssignPlanSlideOverProps) {
  const { t } = useTranslation("nutrition");

  // ── Form state (no RHF needed — simple controlled inputs) ──────────────────
  const [targetMode, setTargetMode] = useState<TargetMode>("athlete");
  const [athleteSearch, setAthleteSearch] = useState("");
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<Set<string>>(new Set());
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // "result" view replaces the form after batch assignment finishes
  const [batchResult, setBatchResult] = useState<MultiAthleteAssignmentResult | null>(null);

  // Group-mode: count of successfully created assignments returned by the API
  const [groupAssignedCount, setGroupAssignedCount] = useState<number | null>(null);

  // ── Validation errors ──────────────────────────────────────────────────────
  const [touched, setTouched] = useState(false);

  const endDateInvalid =
    !!endDate && !!startDate && new Date(endDate) < new Date(startDate);

  const selectionError =
    touched &&
    (targetMode === "athlete"
      ? selectedAthleteIds.size === 0
        ? t("assign.validation.selectAtLeastOne")
        : null
      : selectedGroupId === null
      ? t("assign.validation.selectGroup")
      : null);

  const startDateError =
    touched && !startDate ? t("assign.validation.startDateRequired") : null;

  const canSubmit =
    !!startDate &&
    !endDateInvalid &&
    (targetMode === "athlete" ? selectedAthleteIds.size > 0 : selectedGroupId !== null);

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: athletesRes, isLoading: athletesLoading, isError: athletesError } = useAthletesLookup(open);
  const { data: groupsRes, isLoading: groupsLoading, isError: groupsError } = useGroupsLookup(open);

  const athletes: AthleteLookupItem[] = athletesRes?.data ?? [];
  const groups: GroupLookupItem[] = groupsRes?.data ?? [];

  const filteredAthletes = useMemo(() => {
    const q = athleteSearch.trim().toLowerCase();
    if (!q) return athletes;
    return athletes.filter((a) => a.fullName.toLowerCase().includes(q));
  }, [athletes, athleteSearch]);

  // ── Mutations ──────────────────────────────────────────────────────────────
  const { assign: assignMultiple, isPending: isAssigningAthletes } =
    useAssignMultipleAthletes();

  const { mutate: assignToGroup, isPending: isAssigningGroup } =
    useAssignPlanToGroup();

  const isLoading = isAssigningAthletes || isAssigningGroup;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const toggleAthlete = useCallback((id: string) => {
    setSelectedAthleteIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  function handleModeChange(mode: TargetMode) {
    setTargetMode(mode);
    setSelectedAthleteIds(new Set());
    setSelectedGroupId(null);
    setTouched(false);
  }

  function resetAll() {
    setTargetMode("athlete");
    setAthleteSearch("");
    setSelectedAthleteIds(new Set());
    setSelectedGroupId(null);
    setStartDate("");
    setEndDate("");
    setBatchResult(null);
    setGroupAssignedCount(null);
    setTouched(false);
  }

  function handleClose() {
    onOpenChange(false);
    setTimeout(resetAll, 300);
  }

  async function handleConfirm() {
    setTouched(true);
    if (!plan || !canSubmit) return;

    if (targetMode === "athlete") {
      const athleteList = athletes
        .filter((a) => selectedAthleteIds.has(a.athleteId))
        .map((a) => ({ id: a.athleteId, fullName: a.fullName }));

      const result = await assignMultiple({
        nutritionPlanId: Number(plan.id),
        athleteIds: athleteList,
        startDate,
        endDate,
      });
      setBatchResult(result);
    } else {
      assignToGroup(
        {
          nutritionPlanId: Number(plan.id),
          groupId: selectedGroupId as number,
          startDate,
          endDate: endDate.trim() ? endDate.trim() : null,
        },
        {
          onSuccess: (response) => {
            const count = Array.isArray(response?.data) ? response.data.length : 0;
            setGroupAssignedCount(count);
          },
        },
      );
    }
  }

  // ── Summary text for confirm step ─────────────────────────────────────────
  const selectedGroupName =
    groups.find((g) => g.id === selectedGroupId)?.name ?? "";

  const dateLabel = (() => {
    if (!startDate) return "";
    const fmt = (d: string) =>
      new Date(d).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return endDate ? `${fmt(startDate)} – ${fmt(endDate)}` : `${fmt(startDate)} – ongoing`;
  })();

  if (!plan) return null;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <Drawer open={open} onOpenChange={handleClose} direction="right" modal={true}>
      <DrawerContent className="w-full sm:max-w-xl flex flex-col overflow-hidden">

        {/* ── Header ───────────────────────────────────────────────────── */}
        <DrawerHeader className="shrink-0 flex flex-col gap-2 border-b border-border pb-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-col gap-1.5 min-w-0">
              <h2 className="text-base font-semibold text-foreground leading-snug">
                {t("assign.title")}
              </h2>
              <PlanNamePill name={plan.name} />
            </div>
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={handleClose}
              disabled={isLoading}
              className="mt-0.5 shrink-0 cursor-pointer"
            >
              <MdClose className="size-5" />
            </Button>
          </div>
        </DrawerHeader>

        {/* ── Body: form OR result ──────────────────────────────────────── */}
        {batchResult ? (
          <BatchResultPanel result={batchResult} onDone={handleClose} />
        ) : groupAssignedCount !== null ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <MdCheckCircle className="size-12 text-emerald-600 dark:text-emerald-400" />
            <div className="space-y-1">
              <p className="text-base font-semibold text-foreground">
                {t("modal.assignmentResult.assigned")}
              </p>
              <p className="text-sm text-muted-foreground">
                {groupAssignedCount}{" "}
                {groupAssignedCount === 1 ? "athlete" : "athletes"} assigned successfully
              </p>
            </div>
            <Button
              className="mt-2 cursor-pointer"
              onClick={handleClose}
            >
              {t("common:close")}
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-5">

              {/* Mode toggle */}
              <div className="space-y-2">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("assign.targetMode")}
                </p>
                <ModeToggle
                  value={targetMode}
                  onChange={handleModeChange}
                  disabled={isLoading}
                />
              </div>

              {/* ── Athlete mode ────────────────────────────────────────── */}
              {targetMode === "athlete" && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                      {t("assign.selectAthlete")}
                      <span className="text-destructive ms-0.5">*</span>
                    </p>
                    {selectedAthleteIds.size > 0 && (
                      <span className="text-xs text-primary font-medium">
                        {selectedAthleteIds.size}{" "}
                        {selectedAthleteIds.size === 1 ? "athlete" : "athletes"} selected
                      </span>
                    )}
                  </div>

                  {/* Search */}
                  <SearchInput
                    value={athleteSearch}
                    onChange={setAthleteSearch}
                    placeholder={t("assign.athleteSearch")}
                    className="w-full sm:max-w-full"
                  />

                  {/* Scrollable list */}
                  <div className="max-h-52 overflow-y-auto rounded-lg border border-border bg-card p-2 space-y-0.5">
                    {athletesLoading ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        {t("common:loading")}
                      </div>
                    ) : athletesError ? (
                      <div className="py-8 text-center text-xs text-destructive">
                        Failed to load athletes. Please try again.
                      </div>
                    ) : filteredAthletes.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        {athleteSearch
                          ? t("assign.noAthletesFound")
                          : t("assign.noAthletesAvailable")}
                      </div>
                    ) : (
                      filteredAthletes.map((a) => (
                        <AthleteRow
                          key={a.athleteId}
                          athlete={a}
                          checked={selectedAthleteIds.has(a.athleteId)}
                          onToggle={toggleAthlete}
                        />
                      ))
                    )}
                  </div>

                  {selectionError && (
                    <p className="text-xs text-destructive">{selectionError}</p>
                  )}
                </div>
              )}

              {/* ── Group mode ──────────────────────────────────────────── */}
              {targetMode === "group" && (
                <div className="space-y-2">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("assign.selectGroup")}
                    <span className="text-destructive ms-0.5">*</span>
                  </p>

                  <div className="max-h-52 overflow-y-auto rounded-lg border border-border bg-card p-2 space-y-0.5">
                    {groupsLoading ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        {t("common:loading")}
                      </div>
                    ) : groupsError ? (
                      <div className="py-8 text-center text-xs text-destructive">
                        Failed to load groups. Please try again.
                      </div>
                    ) : groups.length === 0 ? (
                      <div className="py-8 text-center text-xs text-muted-foreground">
                        No groups available
                      </div>
                    ) : (
                      groups.map((g) => (
                        <GroupRow
                          key={g.id}
                          group={g}
                          checked={selectedGroupId === g.id}
                          onToggle={setSelectedGroupId}
                        />
                      ))
                    )}
                  </div>

                  {selectionError && (
                    <p className="text-xs text-destructive">{selectionError}</p>
                  )}
                </div>
              )}

              {/* ── Date range ──────────────────────────────────────────── */}
              <div className="space-y-3">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {t("assign.dateRange")}
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {t("assign.startDate")}
                      <span className="text-destructive ms-0.5">*</span>
                    </label>
                    <Input
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:![filter:none]"
                    />
                    {startDateError && (
                      <p className="text-xs text-destructive">{startDateError}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-medium text-muted-foreground">
                      {t("assign.endDate")}
                      <span className="text-muted-foreground/60 ms-1 font-normal text-[10px]">
                        ({t("assign.endDateOptional")})
                      </span>
                    </label>
                    <Input
                      type="date"
                      value={endDate}
                      min={startDate || undefined}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer [&::-webkit-calendar-picker-indicator]:opacity-70 [&::-webkit-calendar-picker-indicator]:hover:opacity-100 dark:[&::-webkit-calendar-picker-indicator]:![filter:none]"
                    />
                    {endDateInvalid && (
                      <p className="text-xs text-destructive">{t("assign.endDateError")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── Assignment summary ──────────────────────────────────── */}
              {canSubmit && (
                <div className="rounded-lg border border-border bg-muted/40 px-4 py-3 space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    {t("assign.summary.title")}
                  </p>
                  <p className="text-sm text-foreground leading-snug">
                    <span className="font-medium text-primary">"{plan.name}"</span>
                    {" → "}
                    {targetMode === "athlete" ? (
                      <span className="text-foreground">
                        {selectedAthleteIds.size === 1
                          ? athletes.find((a) => selectedAthleteIds.has(a.athleteId))?.fullName
                          : `${selectedAthleteIds.size} athletes`}
                      </span>
                    ) : (
                      <span className="text-foreground">{selectedGroupName}</span>
                    )}
                  </p>
                  {dateLabel && (
                    <p className="text-xs text-muted-foreground">{dateLabel}</p>
                  )}
                </div>
              )}

            </div>

            {/* ── Footer ───────────────────────────────────────────────── */}
            <DrawerFooter className="shrink-0 border-t border-border flex-row items-center justify-between gap-3 px-6 py-4 bg-card">
              <Button
                size="sm"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="cursor-pointer"
              >
                {t("common:cancel")}
              </Button>
              <Button
                size="sm"
                disabled={isLoading}
                onClick={handleConfirm}
                className="min-w-32 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-1.5">
                    <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    {t("common:processing")}
                  </span>
                ) : (
                  t("assign.confirmButton")
                )}
              </Button>
            </DrawerFooter>
          </>
        )}
      </DrawerContent>
    </Drawer>
  );
}

