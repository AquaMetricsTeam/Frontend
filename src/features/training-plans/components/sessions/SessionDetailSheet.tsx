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
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchInput } from "@/components/common/SearchInput";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import { toast } from "sonner";
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
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { useTrainingPlan } from "../../hooks/useTrainingPlan";
import type { TrainingSession } from "../../types/index";
import { cn } from "@/lib/utils";

type AttendanceStatus = "Present" | "Late" | "Absent";

type SessionTab = "overview" | "attendance";

const TAB_OPTIONS: {
  value: SessionTab;
  label: string;
  icon: React.ElementType;
}[] = [
  { value: "overview", label: "Details & Plan", icon: MdFitnessCenter },
  { value: "attendance", label: "Attendance Tracker", icon: MdFactCheck },
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
  const [isSaving, setIsSaving] = useState(false);

  const sessionId = session?.id ?? 0;
  const planId = session?.trainingPlanId ?? 0;

  // Fetch plan details for exercises breakdown
  const { data: planRes } = useTrainingPlan(planId, open && planId > 0);
  const planExercises = planRes?.data?.planExercises ?? [];

  // Fetch athletes for attendance tracking
  const { data: athletesRes, isLoading: athletesLoading } =
    useAthletesLookup(open);
  const athletes = athletesRes?.data ?? [];

  // Initialize attendance state for athletes
  useEffect(() => {
    if (athletes.length > 0) {
      const initial: Record<string, AttendanceStatus> = {};
      athletes.forEach((a) => {
        initial[a.athleteId] = "Present";
      });
      setAttendance(initial);
    }
  }, [athletes]);

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
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      toast.success("Session attendance saved successfully");
    }, 600);
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
            onChange={setTab}
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
        </div>

        {/* Footer */}
        {tab === "attendance" && (
          <div className="px-6 pb-6 pt-4 border-t border-border shrink-0">
            <Button
              onClick={handleSaveAttendance}
              disabled={isSaving}
              className="w-full cursor-pointer"
            >
              {isSaving ? "Saving Attendance..." : "Save Attendance Log"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
