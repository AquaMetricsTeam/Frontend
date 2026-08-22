import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdLocalHospital,
  MdWarningAmber,
  MdCalendarToday,
  MdNotes,
  MdArrowForward,
  MdHealthAndSafety,
  MdAccessibilityNew,
} from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getInjuryBodyPartLabel,
  getInjuryTypeLabel,
} from "@/features/training-record/constants/injury";
import type { InjuredAthlete } from "../types/index";

interface InjuredAthletesCardProps {
  athletes?: InjuredAthlete[];
}

function getInitials(name: string): string {
  if (!name) return "AT";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function InjuredAthletesCard({ athletes = [] }: InjuredAthletesCardProps) {
  const { t } = useTranslation("swimming");

  if (!athletes || athletes.length === 0) {
    return (
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MdHealthAndSafety className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground">
                Squad Health Status
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                No active injuries reported across all training sessions.
              </p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold px-3 py-1 rounded-full shrink-0"
          >
            100% Fit & Ready
          </Badge>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400">
            <MdLocalHospital className="size-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-foreground">
                Injured Athletes
              </h3>
              <Badge
                variant="outline"
                className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold px-2 py-0.5 rounded-full"
              >
                {athletes.length} {athletes.length === 1 ? "Case" : "Cases"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Athletes requiring medical follow-up or load modification.
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Injured Athletes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {athletes.map((athlete) => {
          const bodyPartLabel = getInjuryBodyPartLabel(
            athlete.injuryBodyPart,
            t,
          );
          const typeLabel = getInjuryTypeLabel(athlete.injuryType, t);
          const formattedDate = athlete.injuryDate
            ? new Date(athlete.injuryDate).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : null;

          return (
            <div
              key={`${athlete.athleteId}-${athlete.injuryDate}`}
              className="rounded-2xl border border-border/80 bg-muted/15 p-4.5 hover:border-rose-500/35 hover:bg-card hover:shadow-xs transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                {/* Athlete Identity Row */}
                <div className="flex items-center gap-3">
                  <Avatar className="size-11 rounded-xl ring-1 ring-border/60 shrink-0">
                    <AvatarImage
                      src={athlete.profilePictureUrl || undefined}
                      alt={athlete.fullName}
                    />
                    <AvatarFallback className="rounded-xl font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 text-xs">
                      {getInitials(athlete.fullName)}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <Link
                      to={`/athletes/${athlete.athleteId}`}
                      className="font-bold text-sm text-foreground hover:text-primary transition-colors flex items-center gap-1 group/name truncate"
                    >
                      <span className="truncate">{athlete.fullName}</span>
                      <MdArrowForward className="size-3.5 opacity-0 group-hover/name:opacity-100 rtl:rotate-180 transition-opacity text-primary shrink-0" />
                    </Link>
                    {formattedDate && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-0.5">
                        <MdCalendarToday className="size-3 text-muted-foreground/70 shrink-0" />
                        <span>{formattedDate}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Injury Badges */}
                <div className="mt-3.5 flex flex-wrap items-center gap-1.5">
                  {bodyPartLabel && (
                    <Badge
                      variant="secondary"
                      className="gap-1 text-[11px] font-medium bg-muted text-foreground/80 border border-border/50"
                    >
                      <MdAccessibilityNew className="size-3 text-muted-foreground" />
                      <span>{bodyPartLabel}</span>
                    </Badge>
                  )}
                  {typeLabel && (
                    <Badge
                      variant="outline"
                      className="gap-1 text-[11px] font-semibold bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/25"
                    >
                      <MdWarningAmber className="size-3" />
                      <span>{typeLabel}</span>
                    </Badge>
                  )}
                </div>

                {/* Injury Comment */}
                {athlete.injuryComment && (
                  <div className="mt-3 rounded-xl bg-muted/40 p-2.5 text-xs text-muted-foreground border border-border/40 leading-relaxed flex items-start gap-2">
                    <MdNotes className="size-3.5 mt-0.5 text-muted-foreground/70 shrink-0" />
                    <span className="line-clamp-2">
                      "{athlete.injuryComment}"
                    </span>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-border/50">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="w-full h-8 rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 cursor-pointer justify-between px-2"
                >
                  <Link to={`/athletes/${athlete.athleteId}`}>
                    <span>View Profile</span>
                    <MdArrowForward className="size-3.5 rtl:rotate-180" />
                  </Link>
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
