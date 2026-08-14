import { useState, useEffect, useMemo } from "react";
import {
  MdAdd,
  MdCalendarToday,
  MdAccessTime,
  MdLocationOn,
  MdFactCheck,
  MdCheck,
  MdEventNote,
  MdInfoOutline,
} from "react-icons/md";
import Box from "@/components/layouts/Box";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SearchInput } from "@/components/common/SearchInput";
import { useTrainingSessions } from "../../hooks/useTrainingSessions";
import { useTrainingSession } from "../../hooks/useTrainingSession";
import { useSessionAttendance } from "../../hooks/useSessionAttendance";
import { useMarkAttendance } from "../../hooks/useMarkAttendance";
import { CreateSessionSheet } from "./CreateSessionSheet";
import { SessionDetailSheet } from "./SessionDetailSheet";
import { AttendanceStatusEnum, type TrainingSession } from "../../types/index";
import { cn } from "@/lib/utils";

const STATUS_OPTIONS = [
  {
    value: AttendanceStatusEnum.Present,
    label: "Present",
    activeClass:
      "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/40 font-semibold shadow-2xs",
  },
  {
    value: AttendanceStatusEnum.Absent,
    label: "Absent",
    activeClass:
      "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/40 font-semibold shadow-2xs",
  },
  {
    value: AttendanceStatusEnum.Late,
    label: "Late",
    activeClass:
      "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/40 font-semibold shadow-2xs",
  },
  {
    value: AttendanceStatusEnum.Excused,
    label: "Excused",
    activeClass:
      "bg-zinc-500/15 text-zinc-600 dark:text-zinc-400 border-zinc-500/40 font-semibold shadow-2xs",
  },
];

export function SessionsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const [selectedSession, setSelectedSession] =
    useState<TrainingSession | null>(null);

  const [searchAthletes, setSearchAthletes] = useState("");
  const [searchSessions, setSearchSessions] = useState("");

  // Attendance local state map: athleteId -> status
  const [attendanceMap, setAttendanceMap] = useState<Record<string, number>>(
    {},
  );
  const [initialAttendanceMap, setInitialAttendanceMap] = useState<
    Record<string, number>
  >({});

  const sessionId = selectedSession?.id ?? 0;

  // 1. Fetch Sessions List
  const {
    data: sessionsRes,
    isLoading: sessionsLoading,
    isError: sessionsError,
    refetch: refetchSessions,
  } = useTrainingSessions({ pageNumber: 1, pageSize: 50 });
  const sessions = sessionsRes?.data?.items ?? [];

  // Auto-select first session if none selected
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0]);
    }
  }, [sessions, selectedSession]);

  // 2. Fetch Single Session Detail (includes athletes via GET /api/training-sessions/{id})
  const { data: sessionDetailRes, isLoading: sessionDetailLoading } =
    useTrainingSession(sessionId, sessionId > 0);
  const sessionAthletes =
    sessionDetailRes?.data?.athletes ?? selectedSession?.athletes ?? [];

  // 3. Fetch Session Attendance Records
  const { data: attendanceRes, isLoading: attendanceLoading } =
    useSessionAttendance(sessionId, sessionId > 0);
  const backendRecords = attendanceRes?.data ?? [];

  // Initialize or Sync attendanceMap whenever backend records change
  useEffect(() => {
    if (sessionId === 0) return;

    const initialMap: Record<string, number> = {};

    if (backendRecords.length > 0) {
      backendRecords.forEach((rec) => {
        initialMap[rec.athleteId] = rec.status;
      });
    }

    setAttendanceMap(initialMap);
    setInitialAttendanceMap(initialMap);
  }, [sessionId, backendRecords]);

  // Mark attendance mutation
  const markMutation = useMarkAttendance(sessionId, () => {
    setInitialAttendanceMap({ ...attendanceMap });
  });

  // Determine list of displayed athletes retrieved from GET /api/training-sessions/{id}
  const athleteList = useMemo(() => {
    if (sessionAthletes.length > 0) {
      return sessionAthletes.map((a) => ({
        athleteId: a.athleteId,
        fullName: a.fullName,
        groupName: a.groupName ?? null,
        profilePictureUrl: a.profilePictureUrl ?? null,
      }));
    }
    return backendRecords.map((r) => ({
      athleteId: r.athleteId,
      fullName: r.athleteName,
      groupName: null,
      profilePictureUrl: null as string | null,
    }));
  }, [sessionAthletes, backendRecords]);

  // Calculate status summary metrics
  const stats = useMemo(() => {
    const values = athleteList.map((a) => attendanceMap[a.athleteId]);
    return {
      total: athleteList.length,
      present: values.filter((s) => s === AttendanceStatusEnum.Present).length,
      absent: values.filter((s) => s === AttendanceStatusEnum.Absent).length,
      late: values.filter((s) => s === AttendanceStatusEnum.Late).length,
      excused: values.filter((s) => s === AttendanceStatusEnum.Excused).length,
      unmarked: values.filter((s) => s === undefined).length,
    };
  }, [attendanceMap, athleteList]);

  const filteredAthletes = useMemo(() => {
    if (!searchAthletes.trim()) return athleteList;
    const q = searchAthletes.toLowerCase();
    return athleteList.filter((a) => a.fullName.toLowerCase().includes(q));
  }, [athleteList, searchAthletes]);

  const filteredSessions = useMemo(() => {
    if (!searchSessions.trim()) return sessions;
    const q = searchSessions.toLowerCase();
    return sessions.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.trainingPlanTitle.toLowerCase().includes(q) ||
        s.location.toLowerCase().includes(q),
    );
  }, [sessions, searchSessions]);

  function handleSetStatus(athleteId: string, status: number) {
    setAttendanceMap((prev) => ({ ...prev, [athleteId]: status }));
  }

  function handleMarkAllPresent() {
    const nextMap: Record<string, number> = {};
    athleteList.forEach((a) => {
      nextMap[a.athleteId] = AttendanceStatusEnum.Present;
    });
    setAttendanceMap(nextMap);
  }

  function handleSaveAttendance() {
    if (!sessionId) return;
    const payloadItems = Object.entries(attendanceMap).map(
      ([athleteId, status]) => ({
        athleteId,
        status,
      }),
    );
    markMutation.mutate({
      trainingSessionId: sessionId,
      attendance: payloadItems,
    });
  }

  function getInitials(name: string): string {
    if (!name) return "AT";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Panel: Sessions List */}
        <div className="lg:col-span-5 space-y-4">
          <Box className="p-0 overflow-hidden">
            <div className="p-4 flex items-center justify-between gap-3 border-b border-border">
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Sessions
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Select a session to log attendance
                </p>
              </div>
              <Button
                size="sm"
                onClick={() => setCreateOpen(true)}
                className="gap-1.5 text-xs h-8 cursor-pointer"
              >
                <MdAdd className="size-4" />
                New Session
              </Button>
            </div>

            <div className="p-3 border-b border-border bg-muted/20">
              <SearchInput
                value={searchSessions}
                onChange={setSearchSessions}
                placeholder="Search sessions..."
              />
            </div>

            <TableLoadingAndError
              isLoading={sessionsLoading}
              isError={sessionsError}
              hasNoData={filteredSessions.length === 0}
              skeletonProps={{ columns: 3, rows: 4 }}
              errorMessageProps={{ onRetry: refetchSessions }}
            >
              <div className="divide-y divide-border/60 max-h-[600px] w-full overflow-y-auto">
                {filteredSessions.map((session) => {
                  const isSelected = selectedSession?.id === session.id;
                  return (
                    <div
                      key={session.id}
                      onClick={() => setSelectedSession(session)}
                      className={cn(
                        "p-4 cursor-pointer transition-all flex flex-col gap-2",
                        isSelected
                          ? "bg-primary/10 border-l-4 border-primary font-medium"
                          : "hover:bg-accent/40",
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <MdEventNote className="size-4 text-primary shrink-0" />
                          <span className="text-sm font-semibold text-foreground truncate">
                            {session.title}
                          </span>
                        </div>
                        <Badge
                          variant="secondary"
                          className="text-[10px] shrink-0 font-normal px-2 py-0.5"
                        >
                          {session.trainingPlanTitle}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <MdCalendarToday className="size-3 text-muted-foreground/80" />
                          {session.sessionDate}
                        </span>
                        <span className="flex items-center gap-1">
                          <MdAccessTime className="size-3 text-muted-foreground/80" />
                          {session.startTime} - {session.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          <MdLocationOn className="size-3 text-muted-foreground/80" />
                          {session.location}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </TableLoadingAndError>
          </Box>
        </div>

        {/* Right Panel: Attendance Tracker */}
        <div className="lg:col-span-7 space-y-4">
          <Box className="p-4 sm:p-5 space-y-4">
            {selectedSession ? (
              <>
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
                        <span>Attendance — {selectedSession.title}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-6 text-muted-foreground hover:text-foreground cursor-pointer"
                          title="View Session Details & Exercises"
                          onClick={() => setDetailOpen(true)}
                        >
                          <MdInfoOutline className="size-4" />
                        </Button>
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-semibold px-2 py-0.5",
                          backendRecords.length > 0
                            ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
                        )}
                      >
                        {backendRecords.length > 0
                          ? "Attendance Recorded"
                          : "Not Taken Yet"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 flex flex-wrap items-center gap-2">
                      <span>{selectedSession.sessionDate}</span>
                      <span>•</span>
                      <span>
                        {selectedSession.startTime} - {selectedSession.endTime}
                      </span>
                      <span>•</span>
                      <span>{selectedSession.location}</span>
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="gap-1.5 text-xs h-8 cursor-pointer shrink-0 self-start sm:self-auto"
                    onClick={handleMarkAllPresent}
                  >
                    <MdCheck className="size-4 text-emerald-500" />
                    Mark all Present
                  </Button>
                </div>

                {/* Not Taken Yet Notice Banner */}
                {backendRecords.length === 0 && (
                  <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-800 dark:text-amber-300 text-xs leading-relaxed">
                    <MdInfoOutline className="size-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div className="flex-1">
                      <span className="font-semibold">Attendance Not Taken Yet</span> — No attendance records have been saved for this session. Mark athletes below or click &quot;Mark all Present&quot;.
                    </div>
                  </div>
                )}

                {/* Summary Metrics Bar */}
                <div className="flex flex-wrap items-center gap-2 text-xs py-2 px-3 rounded-xl bg-muted/40 border border-border">
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {stats.present} Present
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-semibold text-rose-600 dark:text-rose-400">
                    {stats.absent} Absent
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-semibold text-amber-600 dark:text-amber-400">
                    {stats.late} Late
                  </span>
                  <span className="text-muted-foreground/40">•</span>
                  <span className="font-semibold text-muted-foreground">
                    {stats.excused} Excused
                  </span>
                  {stats.unmarked > 0 && (
                    <>
                      <span className="text-muted-foreground/40">•</span>
                      <span className="font-semibold text-amber-600 dark:text-amber-400">
                        {stats.unmarked} Unmarked
                      </span>
                    </>
                  )}
                </div>

                {/* Search Bar */}
                <SearchInput
                  value={searchAthletes}
                  onChange={setSearchAthletes}
                  placeholder="Search athletes in attendance list..."
                />

                {/* Athletes Attendance List */}
                {attendanceLoading || sessionDetailLoading ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    Loading athletes & attendance records...
                  </div>
                ) : filteredAthletes.length === 0 ? (
                  <div className="py-12 text-center text-xs text-muted-foreground">
                    No athletes found for this training session.
                  </div>
                ) : (
                  <div className="space-y-2 max-h-[440px] overflow-y-auto pr-1">
                    {filteredAthletes.map((athlete) => {
                      const currentStatus = attendanceMap[athlete.athleteId];
                      const isUnmarked = currentStatus === undefined;
                      const isModified =
                        initialAttendanceMap[athlete.athleteId] !== undefined &&
                        initialAttendanceMap[athlete.athleteId] !==
                          currentStatus;

                      return (
                        <div
                          key={athlete.athleteId}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-xl border border-border bg-card hover:border-accent/60 transition-all"
                        >
                          {/* Athlete Info */}
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar className="size-9 shrink-0">
                              <AvatarImage
                                src={athlete.profilePictureUrl ?? undefined}
                              />
                              <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
                                {getInitials(athlete.fullName)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-xs font-medium text-foreground truncate">
                                {athlete.fullName}
                              </span>
                              {athlete.groupName && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] py-0 px-1.5 font-normal text-muted-foreground border-border"
                                >
                                  {athlete.groupName}
                                </Badge>
                              )}
                              {isUnmarked && (
                                <Badge
                                  variant="outline"
                                  className="text-[10px] py-0 px-1.5 font-normal text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/5"
                                >
                                  Not Marked
                                </Badge>
                              )}
                              {isModified && (
                                <Badge
                                  variant="secondary"
                                  className="text-[10px] py-0 px-1.5 bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30"
                                >
                                  Modified
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Segmented Control for Attendance Status */}
                          <div className="flex items-center gap-1 p-1 rounded-lg border border-input bg-background">
                            {STATUS_OPTIONS.map((opt) => {
                              const isSelected = currentStatus === opt.value;
                              return (
                                <button
                                  key={opt.value}
                                  type="button"
                                  onClick={() =>
                                    handleSetStatus(
                                      athlete.athleteId,
                                      opt.value,
                                    )
                                  }
                                  className={cn(
                                    "px-2.5 py-1 text-[11px] font-medium rounded-md transition-all cursor-pointer",
                                    isSelected
                                      ? opt.activeClass
                                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                  )}
                                >
                                  {opt.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Save Attendance Footer */}
                <div className="pt-3 border-t border-border flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    onClick={handleSaveAttendance}
                    disabled={markMutation.isPending}
                    className="gap-2 text-xs cursor-pointer"
                  >
                    <MdCheck className="size-4" />
                    {markMutation.isPending
                      ? "Saving Attendance..."
                      : "Save Attendance Log"}
                  </Button>
                </div>
              </>
            ) : (
              <div className="py-16 flex flex-col items-center justify-center text-center gap-3 text-muted-foreground">
                <div className="size-12 rounded-2xl bg-muted flex items-center justify-center">
                  <MdFactCheck className="size-6 text-muted-foreground" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-sm font-semibold text-foreground">
                    Attendance Tracker
                  </h3>
                  <p className="text-xs">
                    Select a session from the list on the left to mark
                    attendance and log workout status.
                  </p>
                </div>
              </div>
            )}
          </Box>
        </div>
      </div>

      <CreateSessionSheet open={createOpen} onOpenChange={setCreateOpen} />
      <SessionDetailSheet
        session={selectedSession}
        open={detailOpen}
        onOpenChange={setDetailOpen}
      />
    </>
  );
}
