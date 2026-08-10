import { useState, useEffect } from "react";
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
  MdCheckCircle,
  MdCancel,
  MdSchedule,
  MdNotes,
} from "react-icons/md";
import { useTrainingSession } from "../../hooks/useTrainingSession";
import { useSessionAttendance } from "../../hooks/useSessionAttendance";
import { useMarkAttendance } from "../../hooks/useMarkAttendance";
import { useTrainingPlan } from "../../hooks/useTrainingPlan";
import { AttendanceStatusEnum, type TrainingSession } from "../../types/index";
import { cn } from "@/lib/utils";

import { MdPool } from "react-icons/md";
import { useSwimmingPerformancesByTrainingRecord } from "@/features/swimming-performance/hooks/useSwimmingPerformancesByTrainingRecord";
import { LogSwimmingPerformanceDrawer } from "@/features/swimming-performance/components/LogSwimmingPerformanceDrawer";
import { SwimmingPerformanceDetailSheet } from "@/features/swimming-performance/components/SwimmingPerformanceDetailSheet";
import { STROKE_METADATA, STATUS_METADATA } from "@/features/swimming-performance/constants/enums";
import { formatTimeSpanDisplay } from "@/features/swimming-performance/components/MmSsInput";
import type { SwimmingPerformance } from "@/features/swimming-performance/types";

type AttendanceStatus = "Present" | "Late" | "Absent";

type SessionTab = "overview" | "attendance" | "swimming";

const TAB_OPTIONS: {
  value: SessionTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "overview", label: "Details & Plan", icon: MdFitnessCenter },
  { value: "attendance", label: "Attendance Tracker", icon: MdFactCheck },
  { value: "swimming", label: "Swimming Drills", icon: MdPool },
];

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
  const [tab, setTab] = useState<SessionTab>("overview");
  const [search, setSearch] = useState("");
  const [attendance, setAttendance] = useState<
    Record<string, AttendanceStatus>
  >({});

  const sessionId = session?.id ?? 0;
  const planId = session?.trainingPlanId ?? 0;

  const [isLogDrawerOpen, setIsLogDrawerOpen] = useState(false);
  const [selectedSwimmingDetail, setSelectedSwimmingDetail] =
    useState<SwimmingPerformance | null>(null);
  const [isSwimmingDetailOpen, setIsSwimmingDetailOpen] = useState(false);

  const { data: swimmingRes } = useSwimmingPerformancesByTrainingRecord(
    sessionId,
    open && sessionId > 0,
  );
  const swimmingPerformances = swimmingRes?.data ?? [];

  // Fetch plan details for exercises breakdown
  const { data: planRes } = useTrainingPlan(planId, open && planId > 0);
  const planExercises = planRes?.data?.planExercises ?? [];

  // Fetch single session detail (includes athletes via GET /api/training-sessions/{id})
  const { data: sessionDetailRes } =
    useTrainingSession(sessionId, open && sessionId > 0);
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
      athletes.forEach((a) => {
        initial[a.athleteId] = "Present";
      });

      if (backendRecords.length > 0) {
        backendRecords.forEach((rec) => {
          if (rec.status === AttendanceStatusEnum.Late) initial[rec.athleteId] = "Late";
          else if (rec.status === AttendanceStatusEnum.Absent) initial[rec.athleteId] = "Absent";
          else initial[rec.athleteId] = "Present";
        });
      }

      setAttendance(initial);
    }
  }, [athletes, backendRecords]);

  if (!session) return null;

  const filteredAthletes = athletes.filter((a) =>
    (a.fullName ?? "").toLowerCase().includes(search.toLowerCase()),
  );

  const stats = {
    total: athletes.length,
    present: Object.values(attendance).filter((s) => s === "Present").length,
    late: Object.values(attendance).filter((s) => s === "Late").length,
    absent: Object.values(attendance).filter((s) => s === "Absent").length,
  };

  function setStatus(athleteId: string, status: AttendanceStatus) {
    setAttendance((prev) => ({
      ...prev,
      [athleteId]: status,
    }));
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

        {/* Tab Selector */}
        <div className="px-6 pt-4 pb-2 border-b border-border bg-card/40">
          <SegmentedControl
            options={TAB_OPTIONS}
            value={tab}
            onChange={(v) => setTab(v)}
            className="w-full"
          />
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {tab === "overview" && (
            <>
              {/* Session Meta Cards */}
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

              {/* Session Notes */}
              {session.notes && (
                <div className="p-3.5 rounded-xl border border-border bg-muted/20 space-y-1">
                  <span className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
                    <MdNotes className="size-4 text-primary" /> Instructions &
                    Notes
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {session.notes}
                  </p>
                </div>
              )}

              {/* Plan Exercises Breakdown */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <MdFitnessCenter className="size-4 text-primary" />
                    Training Plan Exercises ({planExercises.length})
                  </h4>
                </div>

                {planExercises.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-4 text-center">
                    No exercises listed for this training plan template.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {planExercises.map((ex, idx) => (
                      <div
                        key={ex.exerciseId || idx}
                        className="flex flex-col gap-1.5 p-3 rounded-xl border border-border bg-card text-xs"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-foreground">
                            #{idx + 1}{" "}
                            {ex.exerciseName ?? `Exercise #${ex.exerciseId}`}
                          </span>
                          <Badge variant="outline" className="text-[10px]">
                            {ex.intensity === 1
                              ? "Low Intensity"
                              : ex.intensity === 3
                                ? "High Intensity"
                                : "Medium Intensity"}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground text-[11px]">
                          <span>
                            Sets:{" "}
                            <strong className="text-foreground">
                              {ex.sets}
                            </strong>
                          </span>
                          <span>
                            Reps:{" "}
                            <strong className="text-foreground">
                              {ex.reps}
                            </strong>
                          </span>
                          <span>
                            Duration:{" "}
                            <strong className="text-foreground">
                              {ex.duration} min
                            </strong>
                          </span>
                        </div>
                        {ex.notes && (
                          <p className="text-[11px] text-muted-foreground/80 pt-0.5 italic">
                            &quot;{ex.notes}&quot;
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

          {tab === "attendance" && (
            <div className="space-y-4">
              {/* Stats Bar */}
              <div className="grid grid-cols-4 gap-2 text-center">
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

              {/* Search Athletes */}
              <SearchInput
                value={search}
                onChange={setSearch}
                placeholder="Search athletes for attendance..."
              />

              {/* Athletes List */}
              <div className="space-y-2">
                {filteredAthletes.map((athlete) => {
                  const currentStatus =
                    attendance[athlete.athleteId] ?? "Present";

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

                      {/* Status Toggle Group */}
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
                          <MdCheckCircle className="size-3" />
                          Present
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
                          <MdSchedule className="size-3" />
                          Late
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
                          <MdCancel className="size-3" />
                          Absent
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "swimming" && (
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

              {swimmingPerformances.length === 0 ? (
                <div className="p-8 rounded-xl border border-dashed border-border text-center space-y-2">
                  <MdPool className="size-8 text-muted-foreground/40 mx-auto" />
                  <p className="text-xs font-semibold text-foreground">
                    No swimming drills logged for this session record yet.
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    Click &quot;+ Log Drill&quot; to record swimming sets, split lap times, and technical ratings.
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
                    const statusMeta = STATUS_METADATA[item.status];
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
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-[10px] font-semibold px-1.5 py-0",
                              statusMeta?.badgeClass,
                            )}
                          >
                            {statusMeta?.labelKey ? statusMeta.badgeClass : "Completed"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawers */}
        <LogSwimmingPerformanceDrawer
          open={isLogDrawerOpen}
          onOpenChange={setIsLogDrawerOpen}
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

        {/* Footer */}
        {tab === "attendance" && (
          <div className="px-6 pb-6 pt-4 border-t border-border shrink-0">
            <Button
              onClick={handleSaveAttendance}
              disabled={markMutation.isPending}
              className="w-full cursor-pointer"
            >
              {markMutation.isPending ? "Saving Attendance..." : "Save Attendance Log"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
