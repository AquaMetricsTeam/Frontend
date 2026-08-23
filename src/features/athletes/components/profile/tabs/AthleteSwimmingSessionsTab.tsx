import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdPool,
  MdAccessTime,
  MdLocationOn,
  MdPerson,
  MdAssignment,
  MdCheckCircle,
  MdCancel,
  MdNotes,
  MdRefresh,
} from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { SearchInput } from "@/components/common/SearchInput";
import { TemplateDetailSheet } from "@/features/training-plans/components/templates/TemplateDetailSheet";
import type { TrainingPlan } from "@/features/training-plans/types/index";
import { useAthleteSwimmingSessions } from "../../../hooks/useAthleteSwimmingSessions";

interface AthleteSwimmingSessionsTabProps {
  athleteId: string;
}

export function AthleteSwimmingSessionsTab({
  athleteId,
}: AthleteSwimmingSessionsTabProps) {
  const { t } = useTranslation("athletes");
  const [search, setSearch] = useState("");
  const [selectedPlan, setSelectedPlan] = useState<TrainingPlan | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const { data: response, isLoading, isError, refetch } =
    useAthleteSwimmingSessions(athleteId);

  const sessions = response?.data || [];

  const filteredSessions = sessions.filter((s) => {
    const q = search.toLowerCase().trim();
    if (!q) return true;
    return (
      String(s.title || "").toLowerCase().includes(q) ||
      String(s.coachName || "").toLowerCase().includes(q) ||
      String(s.trainingPlanTitle || "").toLowerCase().includes(q) ||
      String(s.location || "").toLowerCase().includes(q)
    );
  });

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-9 w-48 rounded-xl" />
          <Skeleton className="h-9 w-72 rounded-xl" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-8 text-center shadow-xs">
        <p className="text-sm font-medium text-destructive">
          {t("profile.error.title")}
        </p>
        <Button
          size="sm"
          variant="outline"
          onClick={() => refetch()}
          className="mt-4 rounded-xl gap-1.5 text-xs font-semibold cursor-pointer"
        >
          <MdRefresh className="size-4" />
          <span>{t("profile.error.retry")}</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Controls / Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
            <MdPool className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t("profile.swimming.title")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("profile.swimming.subtitle", { count: sessions.length })}
            </p>
          </div>
        </div>

        <div className="w-full sm:w-72">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder={t("profile.swimming.searchPlaceholder")}
          />
        </div>
      </div>

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
            <MdPool className="size-6" />
          </div>
          <h4 className="mt-3 text-sm font-semibold text-foreground">
            {t("profile.swimming.noSessionsFound")}
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            {search
              ? t("profile.swimming.tryDifferentSearch")
              : t("profile.swimming.noSessionsRecorded")}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-xs hover:border-cyan-500/40 hover:shadow-md transition-all group"
            >
              <div>
                {/* Header: Date + Record Badge */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-3">
                  <span className="text-xs font-bold text-foreground">
                    {new Date(session.sessionDate).toLocaleDateString(undefined, {
                      weekday: "short",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>

                  <Badge
                    variant="outline"
                    className={`text-[11px] gap-1 font-semibold ${
                      session.attended
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                        : "border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {session.attended ? (
                      <>
                        <MdCheckCircle className="size-3.5" />
                        <span>{t("profile.sessions.attended")}</span>
                      </>
                    ) : (
                      <>
                        <MdCancel className="size-3.5" />
                        <span>{t("profile.sessions.absent")}</span>
                      </>
                    )}
                  </Badge>
                </div>

                {/* Session Title & Description */}
                <div className="mt-3 space-y-1">
                  <h4 className="text-base font-bold text-foreground group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                    {session.title}
                  </h4>
                  {session.description && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {session.description}
                    </p>
                  )}
                </div>

                {/* Meta details list */}
                <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                  {/* Time */}
                  <div className="flex items-center gap-1.5">
                    <MdAccessTime className="size-4 text-cyan-500 shrink-0" />
                    <span>
                      {session.startTime.substring(0, 5)} - {session.endTime.substring(0, 5)}
                    </span>
                  </div>

                  {/* Location */}
                  {session.location && (
                    <div className="flex items-center gap-1.5">
                      <MdLocationOn className="size-4 text-cyan-500 shrink-0" />
                      <span className="truncate">{session.location}</span>
                    </div>
                  )}

                  {/* Coach */}
                  <div className="flex items-center gap-1.5">
                    <MdPerson className="size-4 text-primary shrink-0" />
                    <span className="truncate">{session.coachName}</span>
                  </div>

                  {/* Training Plan */}
                  {session.trainingPlanTitle && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPlan({
                          id: session.trainingPlanId,
                          title: session.trainingPlanTitle,
                          description: "",
                          domainId: 1,
                          domainName: "Swimming",
                          planSource: "Coach",
                          approvalStatus: "Approved",
                          estimatedDurationMinutes: 0,
                          planExercises: [],
                        } as unknown as TrainingPlan);
                        setIsDetailOpen(true);
                      }}
                      className="flex items-center gap-1.5 hover:text-primary transition-colors text-start cursor-pointer group/plan truncate"
                      title={session.trainingPlanTitle}
                    >
                      <MdAssignment className="size-4 text-primary shrink-0" />
                      <span className="truncate underline decoration-dashed decoration-primary/40 underline-offset-2">
                        {session.trainingPlanTitle}
                      </span>
                    </button>
                  )}
                </div>

                {/* Notes if any */}
                {session.notes && (
                  <div className="mt-3.5 flex items-start gap-1.5 rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40">
                    <MdNotes className="size-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-[11px] leading-relaxed">{session.notes}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Plan Details Sheet */}
      <TemplateDetailSheet
        plan={selectedPlan}
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
      />
    </div>
  );
}
