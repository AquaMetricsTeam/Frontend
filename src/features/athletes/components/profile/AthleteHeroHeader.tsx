import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  MdArrowBack,
  MdMale,
  MdFemale,
  MdPerson,
  MdPersonAdd,
  MdStickyNote2,
  MdFitnessCenter,
  MdPool,
  MdPhone,
  MdRestaurant,
} from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type {
  AthleteOverviewResponse,
  AthleteOverviewPerformanceResponse,
} from "../../types/index";

interface AthleteHeroHeaderProps {
  athlete: AthleteOverviewResponse;
  performanceData?: AthleteOverviewPerformanceResponse | null;
  isAdmin?: boolean;
  onOpenAssignModal?: () => void;
  onOpenNotes?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function AthleteHeroHeader({
  athlete,
  performanceData,
  isAdmin,
  onOpenAssignModal,
  onOpenNotes,
}: AthleteHeroHeaderProps) {
  const { t } = useTranslation("athletes");

  const isMale =
    athlete.gender === 1 ||
    String(athlete.gender).toLowerCase() === "male";
  const isFemale =
    athlete.gender === 2 ||
    String(athlete.gender).toLowerCase() === "female";

  const totalSessions =
    (athlete.swimmingSessions ?? 0) + (athlete.fitnessSessions ?? 0);
  const injuredSessions = performanceData?.injuredSessions ?? 0;
  const avgRating = performanceData?.averagePerformanceRating;
  const avgFatigue = performanceData?.averageFatigueLevel;

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border/80 bg-card p-6 md:p-8 shadow-sm">
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute -end-24 -top-24 size-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -start-24 -bottom-24 size-96 rounded-full bg-cyan-500/10 blur-3xl" />

      {/* Top Bar Navigation & Actions */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-b border-border/60 pb-5">
        <Link
          to="/athletes"
          className="inline-flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-primary transition-colors"
        >
          <MdArrowBack className="size-4 rtl:rotate-180" />
          <span>{t("profile.backToAthletes")}</span>
        </Link>

        <div className="flex items-center gap-2">
          {!isAdmin && onOpenNotes && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenNotes}
              className="h-9 gap-1.5 rounded-xl border-border bg-card/60 text-xs font-semibold hover:border-primary/40 hover:bg-primary/5 cursor-pointer"
            >
              <MdStickyNote2 className="size-4 text-primary" />
              <span>{t("profile.notes")}</span>
            </Button>
          )}

          {isAdmin && onOpenAssignModal && (
            <Button
              size="sm"
              onClick={onOpenAssignModal}
              className="h-9 gap-1.5 rounded-xl text-xs font-semibold cursor-pointer shadow-xs"
            >
              <MdPersonAdd className="size-4" />
              <span>{t("table.manageCoaches")}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 mt-6 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        {/* Left: Avatar + Identity Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Avatar */}
          <div className="relative">
            {athlete.profilePictureUrl ? (
              <img
                src={athlete.profilePictureUrl}
                alt={athlete.fullName}
                className="size-20 sm:size-24 rounded-2xl object-cover border-2 border-border/60 shadow-md ring-4 ring-primary/10"
              />
            ) : (
              <div className="flex size-20 sm:size-24 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 via-primary/10 to-cyan-500/20 text-primary text-2xl font-bold border-2 border-primary/20 shadow-md ring-4 ring-primary/10">
                {getInitials(athlete.fullName)}
              </div>
            )}
          </div>

          {/* Name & Bio Pills */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h1
                className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {athlete.fullName}
              </h1>
            </div>

            <p className="text-xs text-muted-foreground">
              {athlete.email}
            </p>

            {/* Badges row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              {/* Gender */}
              <Badge
                variant="outline"
                className="rounded-lg text-xs font-medium gap-1 px-2.5 py-0.5"
              >
                {isMale ? (
                  <>
                    <MdMale className="size-3.5 text-blue-500" />
                    <span>{t("gender.male")}</span>
                  </>
                ) : isFemale ? (
                  <>
                    <MdFemale className="size-3.5 text-pink-500" />
                    <span>{t("gender.female")}</span>
                  </>
                ) : (
                  <>
                    <MdPerson className="size-3.5 text-muted-foreground" />
                    <span>{t("gender.unknown")}</span>
                  </>
                )}
              </Badge>

              {/* Age */}
              <Badge
                variant="outline"
                className="rounded-lg text-xs font-medium px-2.5 py-0.5"
              >
                {athlete.age} {t("profile.yearsOld")}
              </Badge>

              {/* Emergency Contact Chip if available */}
              {athlete.emergencyContact && (
                <a
                  href={`tel:${athlete.emergencyContact}`}
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline bg-primary/5 px-2.5 py-0.5 rounded-lg border border-primary/20"
                >
                  <MdPhone className="size-3" />
                  <span>{athlete.emergencyContact}</span>
                </a>
              )}

              {/* Injury Warning Pill if any */}
              {injuredSessions > 0 && (
                <Badge
                  variant="outline"
                  className="rounded-lg text-xs font-semibold gap-1 px-2.5 py-0.5 border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400"
                >
                  <span>{t("profile.metrics.injuryAlertTitle")}: {injuredSessions}</span>
                </Badge>
              )}

              {/* Groups pills */}
              {athlete.groups?.map((g) => {
                const name = String(g.domainName || "").toLowerCase();
                const isSwim = name.includes("swim") || g.domainId === 1;
                const isFit = name.includes("fit") || g.domainId === 2;
                const isNutri = name.includes("nutri") || g.domainId === 3;

                const badgeClass = isSwim
                  ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30"
                  : isFit
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : isNutri
                      ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                      : "bg-primary/10 text-primary border-primary/30";

                return (
                  <Badge
                    key={g.id}
                    variant="outline"
                    className={`rounded-lg text-[11px] font-medium gap-1 border ${badgeClass}`}
                  >
                    {isSwim ? (
                      <MdPool className="size-3" />
                    ) : isFit ? (
                      <MdFitnessCenter className="size-3" />
                    ) : (
                      <MdRestaurant className="size-3" />
                    )}
                    <span>{g.name}</span>
                  </Badge>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Quick Micro-KPI Glass Cards */}
        <div className="grid grid-cols-3 gap-3 lg:w-auto">
          {/* Total Sessions */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-xs text-center min-w-[100px]">
            <div className="text-xl font-bold text-foreground">
              {totalSessions}
            </div>
            <div className="text-[11px] font-medium text-muted-foreground">
              {t("profile.metrics.totalSessions")}
            </div>
          </div>

          {/* Avg Performance */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-xs text-center min-w-[100px]">
            <div className="text-xl font-bold text-primary">
              {avgRating !== undefined ? avgRating.toFixed(1) : "--"}
            </div>
            <div className="text-[11px] font-medium text-muted-foreground">
              {t("profile.metrics.avgRating")}
            </div>
          </div>

          {/* Avg Fatigue */}
          <div className="rounded-2xl border border-border/80 bg-card/60 p-3.5 backdrop-blur-xs text-center min-w-[100px]">
            <div className="text-xl font-bold text-amber-500">
              {avgFatigue !== undefined ? avgFatigue.toFixed(1) : "--"}
            </div>
            <div className="text-[11px] font-medium text-muted-foreground">
              {t("profile.metrics.avgFatigue")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
