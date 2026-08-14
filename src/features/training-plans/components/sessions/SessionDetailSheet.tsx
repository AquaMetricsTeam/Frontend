import { useState, useEffect, useMemo } from "react";
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
import { SearchInput } from "@/components/common/SearchInput";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import {
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdFactCheck,
  MdFitnessCenter,
  MdSportsGymnastics,
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdNotes,
  MdInfoOutline,
  MdPool,
} from "react-icons/md";
import { useAuth } from "@/components/Providers/AuthProvider";
import { Loading } from "@/components/feedbacks/Loading";
import { useTrainingSession } from "../../hooks/useTrainingSession";
import { useSessionAttendance } from "../../hooks/useSessionAttendance";
import { useMarkAttendance } from "../../hooks/useMarkAttendance";
import { useTrainingPlan } from "../../hooks/useTrainingPlan";
import { AttendanceStatusEnum, type TrainingSession } from "../../types/index";
import { cn } from "@/lib/utils";

import { useSwimmingPerformancesByTrainingRecord } from "@/features/swimming-performance/hooks/useSwimmingPerformancesByTrainingRecord";
import { LogSwimmingPerformanceDrawer } from "@/features/swimming-performance/components/LogSwimmingPerformanceDrawer";
import { SwimmingPerformanceDetailSheet } from "@/features/swimming-performance/components/SwimmingPerformanceDetailSheet";
import { STROKE_METADATA } from "@/features/swimming-performance/constants/enums";
import { formatTimeSpanDisplay } from "@/features/swimming-performance/components/MmSsInput";
import type { SwimmingPerformance } from "@/features/swimming-performance/types";

import { useTrainingRecords } from "@/features/training-record/hooks/useTrainingRecords";
import { LogFitnessRecordDrawer } from "@/features/fitness/components/LogFitnessRecordDrawer";
import { FitnessRecordDetailSheet } from "@/features/fitness/components/FitnessRecordDetailSheet";
import type { TrainingRecordResponse } from "@/features/training-record/types";

type AttendanceStatus = "Present" | "Late" | "Absent";

type SessionTab = "overview" | "attendance" | "swimming" | "fitness";

interface SessionDetailSheetProps {
  session: TrainingSession | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SessionDetailSheet({
  session,
  open,
  onOpenChange,
}: SessionDetailSheetProps) {
  const { hasRole } = useAuth();
  const isSwimmingCoach = hasRole("SwimmingCoach");
  const isFitnessCoach = hasRole("FitnessCoach");
  const isAdminOrHead = hasRole("Admin");

  // Determine tab access based on role
  const canViewSwimming =
    isSwimmingCoach || isAdminOrHead || (!isSwimmingCoach && !isFitnessCoach);
  const canViewFitness =
    isFitnessCoach || isAdminOrHead || (!isSwimmingCoach && !isFitnessCoach);

  const tabOptions = useMemo(() => {
    const opts: {
      value: SessionTab;
      label: string;
      icon: React.ElementType;
    }[] = [
      { value: "overview", label: "Details & Plan", icon: MdSportsGymnastics },
      { value: "attendance", label: "Attendance Tracker", icon: MdFactCheck },
    ];
    if (canViewSwimming) {
      opts.push({ value: "swimming", label: "Swimming Drills", icon: MdPool });
    }
    if (canViewFitness) {
      opts.push({
        value: "fitness",
        label: "Fitness Drills",
        icon: MdFitnessCenter,
      });
    }
    return opts;
  }, [canViewSwimming, canViewFitness]);

  const [tab, setTab] = useState<SessionTab>("overview");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const sessionId = session?.id ?? 0;
  const planId = session?.trainingPlanId ?? 0;

  // Auto-switch to valid tab if current tab is hidden for role
  useEffect(() => {
    if (!tabOptions.some((o) => o.value === tab)) {
      setTab(tabOptions[0]?.value || "overview");
    }
  }, [tabOptions, tab]);

  // Swimming state & query
  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [selectedSwimmingDetail, setSelectedSwimmingDetail] =
    useState<SwimmingPerformance | null>(null);
  const [isSwimmingDetailOpen, setIsSwimmingDetailOpen] = useState(false);

  const { data: swimmingRes, isLoading: swimmingLoading } =
    useSwimmingPerformancesByTrainingRecord(
      sessionId,
      open && sessionId > 0 && canViewSwimming,
    );
  const swimmingPerformances = swimmingRes?.data ?? [];

  // Fitness state & query
  const [isFitnessDrawerOpen, setIsFitnessDrawerOpen] = useState(false);
  const [selectedFitnessDetail, setSelectedFitnessDetail] =
    useState<TrainingRecordResponse | null>(null);
  const [isFitnessDetailOpen, setIsFitnessDetailOpen] = useState(false);

  const { data: fitnessRes, isLoading: fitnessLoading } = useTrainingRecords({
    trainingSessionId: sessionId,
    pageSize: 50,
  });
  const fitnessRecords = fitnessRes?.data?.items ?? [];

  // Fetch plan details for exercises breakdown
  const { data: planRes } = useTrainingPlan(planId, open && planId > 0);
  const planExercises = planRes?.data?.planExercises ?? [];

  // Fetch single session detail (includes athletes via GET /api/training-sessions/{id})
  const { data: sessionDetailRes } = useTrainingSession(
    sessionId,
    open && sessionId > 0,
  );
  const athletes = sessionDetailRes?.data?.athletes ?? session?.athletes ?? [];

  // Fetch session attendance records
  const { data: attendanceRes } = useSessionAttendance(
    sessionId,
    open && sessionId > 0,
  );
  const backendRecords = attendanceRes?.data ?? [];

  const markMutation = useMarkAttendance(sessionId);

  // Initialize attendance state for athletes
  useEffect(() => {
    if (athletes.length > 0) {
      const initial: Record<string, AttendanceStatus> = {};

      if (backendRecords.length > 0) {
        backendRecords.forEach((rec) => {
          if (rec.status === AttendanceStatusEnum.Late)
            initial[rec.athleteId] = "Late";
          else if (rec.status === AttendanceStatusEnum.Absent)
            initial[rec.athleteId] = "Absent";
          else if (rec.status === AttendanceStatusEnum.Present)
            initial[rec.athleteId] = "Present";
        });
      }

      setAttendance(initial);
    }
  }, [athletes, backendRecords]);

  if (!session) return null;

  const hasTakenAttendance = backendRecords.length > 0;

  const filteredAthletes = athletes.filter((a) =>
    (a.fullName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: athletes.length,
    present: Object.values(attendance).filter((s) => s === "Present").length,
    late: Object.values(attendance).filter((s) => s === "Late").length,
    absent: Object.values(attendance).filter((s) => s === "Absent").length,
    unmarked: athletes.filter((a) => !attendance[a.athleteId]).length,
  };

  function setStatus(athleteId: string, status: AttendanceStatus) {
    setAttendance((prev) => {
      const next = { ...prev };
      if (next[athleteId] === status) {
        delete next[athleteId];
      } else {
        next[athleteId] = status;
      }
      return next;
    });
  }

  function handleSaveAttendance() {
    if (!sessionId) return;
    const payloadItems = Object.entries(attendance).map(
      ([athleteId, statusStr]) => {
        let statusNum: AttendanceStatusEnum = AttendanceStatusEnum.Present;
        if (statusStr === "Late") statusNum = AttendanceStatusEnum.Late;
        if (statusStr === "Absent") statusNum = AttendanceStatusEnum.Absent;
        return { athleteId, status: statusNum };
      },
    );

    markMutation.mutate({
      trainingSessionId: sessionId,
      attendance: payloadItems,
    });
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col gap-0 p-0">
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between gap-2">
            <SheetTitle className="text-base font-semibold text-foreground">
              {session.title}
            </SheetTitle>
            <Badge
              variant="secondary"
              className="text-xs bg-primary/10 text-primary border-primary/20"
            >
              {session.trainingPlanTitle}
            </Badge>
          </div>
          <SheetDescription className="text-xs text-muted-foreground mt-1">
            Session #{session.id} • {session.sessionDate}
          </SheetDescription>
        </SheetHeader>

        <div className="px-6 pt-4 pb-2 border-b border-border bg-card/40">
          <SegmentedControl
            options={tabOptions}
            value={tab}
            onChange={(v) => setTab(v as SessionTab)}
            className="w-full"
          />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {tab === "overview" && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-card">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
                    <MdCalendarToday className="size-3.5 text-primary" /> Date
                  </span>
                  <span className="text-xs font-semibold text-foreground">
                    {session.sessionDate}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-card">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
                    <MdAccessTime className="size-3.5 text-primary" /> Time
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {session.startTime} - {session.endTime}
                  </span>
                </div>

                <div className="flex flex-col gap-1 p-3 rounded-xl border border-border bg-card">
                  <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground uppercase">
                    <MdLocationOn className="size-3.5 text-primary" /> Location
                  </span>
                  <span className="text-xs font-semibold text-foreground truncate">
                    {session.location}
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Assigned Plan
                  </span>
                  <Badge variant="outline" className="text-xs font-semibold">
                    {session.trainingPlanTitle}
                  </Badge>
                </div>

                {planRes?.data?.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {planRes.data.description}
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MdFitnessCenter className="size-4 text-primary" />
                  Plan Exercises ({planExercises.length})
                </h4>

                {planExercises.length === 0 ? (
                  <div className="p-6 rounded-xl border border-dashed border-border text-center text-xs text-muted-foreground">
                    No exercises defined in this plan template.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {planExercises.map((pe, idx) => (
                      <div
                        key={pe.id}
                        className="flex items-start justify-between gap-3 p-3 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all"
                      >
                        <div className="flex items-start gap-3 min-w-0">
                          <span className="flex size-6 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary mt-0.5">
                            {pe.orderIndex || idx + 1}
                          </span>
                          <div className="min-w-0">
                            <span className="text-xs font-semibold text-foreground truncate block">
                              {pe.exerciseName}
                            </span>
                            {pe.notes && (
                              <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1">
                                <MdNotes className="size-3 shrink-0" />
                                {pe.notes}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5 shrink-0">
                          {pe.sets && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {pe.sets} sets
                            </Badge>
                          )}
                          {pe.reps && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {pe.reps} reps
                            </Badge>
                          )}
                          {pe.duration && (
                            <Badge
                              variant="secondary"
                              className="text-[10px] px-1.5 py-0"
                            >
                              {pe.duration}m
                            </Badge>
                          )}
                          {pe.restSeconds && (
                            <Badge
                              variant="outline"
                              className="text-[10px] px-1.5 py-0 text-muted-foreground"
                            >
                              {pe.restSeconds}s rest
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "attendance" && (
            <div className="space-y-4">
              {!hasTakenAttendance && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                  <MdInfoOutline className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                  <div className="flex-1">
                    <span className="font-semibold">
                      Attendance Not Taken Yet
                    </span>{" "}
                    — No attendance records have been saved for this session.
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
                <div className="p-2.5 rounded-xl border border-border bg-card flex flex-col items-center">
                  <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                    Total
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {stats.total}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-semibold text-emerald-500">
                    Present
                  </span>
                  <span className="text-sm font-bold text-emerald-500">
                    {stats.present}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border border-amber-500/20 bg-amber-500/10 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-semibold text-amber-500">
                    Late
                  </span>
                  <span className="text-sm font-bold text-amber-500">
                    {stats.late}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 flex flex-col items-center">
                  <span className="text-[10px] uppercase font-semibold text-rose-500">
                    Absent
                  </span>
                  <span className="text-sm font-bold text-rose-500">
                    {stats.absent}
                  </span>
                </div>
              </div>

              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search athletes for attendance..."
              />

              <div className="space-y-2">
                {filteredAthletes.map((athlete) => {
                  const currentStatus = attendance[athlete.athleteId];
                  return (
                    <div
                      key={athlete.athleteId}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card gap-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Avatar className="size-8 shrink-0">
                          <AvatarImage
                            src={athlete.profilePictureUrl ?? undefined}
                          />
                          <AvatarFallback className="text-xs font-semibold">
                            {athlete.fullName.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium text-foreground truncate">
                          {athlete.fullName}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setStatus(athlete.athleteId, "Present")
                          }
                          className={cn(
                            "px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                            currentStatus === "Present"
                              ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/40"
                              : "text-muted-foreground hover:bg-muted/40",
                          )}
                        >
                          <MdCheckCircle className="size-3" /> Present
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(athlete.athleteId, "Late")}
                          className={cn(
                            "px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                            currentStatus === "Late"
                              ? "bg-amber-500/20 text-amber-500 border border-amber-500/40"
                              : "text-muted-foreground hover:bg-muted/40",
                          )}
                        >
                          <MdSchedule className="size-3" /> Late
                        </button>
                        <button
                          type="button"
                          onClick={() => setStatus(athlete.athleteId, "Absent")}
                          className={cn(
                            "px-2 py-1 rounded-md text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1",
                            currentStatus === "Absent"
                              ? "bg-rose-500/20 text-rose-500 border border-rose-500/40"
                              : "text-muted-foreground hover:bg-muted/40",
                          )}
                        >
                          <MdCancel className="size-3" /> Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "swimming" && canViewSwimming && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MdPool className="size-4 text-primary" />
                  Logged Swimming Performances ({swimmingPerformances.length})
                </h4>
                <Button
                  size="sm"
                  onClick={() => setIsLogDrawerOpen(true)}
                  className="h-8 text-xs rounded-lg gap-1.5 cursor-pointer"
                >
                  + Log Drill
                </Button>
              </div>

              {swimmingLoading ? (
                <Loading label="Loading swimming drills…" className="py-12" />
              ) : swimmingPerformances.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-2">
                  <MdPool className="size-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">
                    No swimming drills logged for this session record yet.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsLogDrawerOpen(true)}
                    className="mt-2 text-xs rounded-lg cursor-pointer"
                  >
                    + Log Drill Set
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {swimmingPerformances.map((item) => {
                    const strokeMeta = STROKE_METADATA[item.stroke];
                    return (
                      <div
                        key={item.id}
                        onClick={() => {
                          setSelectedSwimmingDetail(item);
                          setIsSwimmingDetailOpen(true);
                        }}
                        className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-2 shadow-xs"
                      >
                        <div className="flex items-center justify-between">
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-bold px-2 py-0.5",
                              strokeMeta?.badgeClass,
                            )}
                          >
                            {strokeMeta?.shortLabel || "Free"}
                          </Badge>
                          <span className="text-xs font-bold text-primary">
                            {item.distanceMeters}m × {item.repetitions} reps
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                            Best: {formatTimeSpanDisplay(item.bestRepTime)}
                          </span>
                          <span className="text-foreground">
                            Avg: {formatTimeSpanDisplay(item.averageRepTime)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {tab === "fitness" && canViewFitness && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                  <MdFitnessCenter className="size-4 text-amber-500" />
                  Logged Fitness Records ({fitnessRecords.length})
                </h4>
                <Button
                  size="sm"
                  onClick={() => setIsFitnessDrawerOpen(true)}
                  className="h-8 text-xs rounded-lg gap-1.5 cursor-pointer"
                >
                  + Log Fitness Record
                </Button>
              </div>

              {fitnessLoading ? (
                <Loading label="Loading fitness records…" className="py-12" />
              ) : fitnessRecords.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-2">
                  <MdFitnessCenter className="size-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">
                    No fitness performance records logged for this session yet.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Click &quot;+ Log Fitness Record&quot; to record workout
                    data.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsFitnessDrawerOpen(true)}
                    className="mt-2 text-xs rounded-lg cursor-pointer"
                  >
                    + Log Fitness Record
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {fitnessRecords.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setSelectedFitnessDetail(item);
                        setIsFitnessDetailOpen(true);
                      }}
                      className="p-3.5 rounded-xl border border-border bg-card hover:bg-muted/30 transition-all cursor-pointer space-y-2 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar className="size-7">
                            <AvatarFallback className="text-[10px] font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400">
                              {(item.athleteName || "AT")
                                .slice(0, 2)
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-xs font-semibold text-foreground">
                            {item.athleteName}
                          </span>
                        </div>
                        <Badge
                          variant="outline"
                          className={cn(
                            "text-[10px] font-semibold px-2 py-0.5",
                            item.sessionCompleted
                              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30"
                              : "bg-rose-500/10 text-rose-600 border-rose-500/30",
                          )}
                        >
                          {item.sessionCompleted ? "Completed" : "Incomplete"}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between text-xs font-mono text-muted-foreground">
                        <span className="text-amber-600 dark:text-amber-400 font-medium">
                          Rating: {item.performanceRating}/10
                        </span>
                        <span>Fatigue: {item.fatigueLevel}/10</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {canViewSwimming && (
          <>
            <LogSwimmingPerformanceDrawer
              open={isLogDrawerOpen}
              onOpenChange={setIsLogDrawerOpen}
              defaultSessionId={sessionId}
            />
            <SwimmingPerformanceDetailSheet
              record={
                selectedSwimmingDetail
                  ? {
                      id: selectedSwimmingDetail.trainingRecordId || sessionId,
                      athleteId: selectedSwimmingDetail.athleteId || "",
                      athleteName:
                        selectedSwimmingDetail.athleteName ||
                        session?.title ||
                        "Athlete",
                      trainingSessionId: sessionId,
                      sessionTitle: session?.title || "Training Session",
                      sessionDate: session?.sessionDate || "",
                      performanceRating: 8,
                      fatigueLevel: 5,
                      sessionCompleted: true,
                      injuryOccurred: false,
                    }
                  : null
              }
              open={isSwimmingDetailOpen}
              onOpenChange={setIsSwimmingDetailOpen}
            />
          </>
        )}

        {canViewFitness && (
          <>
            <LogFitnessRecordDrawer
              open={isFitnessDrawerOpen}
              onOpenChange={setIsFitnessDrawerOpen}
              defaultSessionId={sessionId}
            />
            <FitnessRecordDetailSheet
              record={selectedFitnessDetail}
              open={isFitnessDetailOpen}
              onOpenChange={setIsFitnessDetailOpen}
            />
          </>
        )}

        {tab === "attendance" && (
          <div className="px-6 pb-6 pt-4 border-t border-border shrink-0">
            <Button
              onClick={handleSaveAttendance}
              disabled={markMutation.isPending}
              className="w-full cursor-pointer"
            >
              {markMutation.isPending
                ? "Saving Attendance..."
                : "Save Attendance Log"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
