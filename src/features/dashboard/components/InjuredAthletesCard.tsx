import { useState, useMemo } from "react";
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
  MdOpenInNew,
  MdSearchOff,
} from "react-icons/md";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { SearchInput } from "@/components/common/SearchInput";
import {
  getInjuryBodyPartLabel,
  getInjuryTypeLabel,
} from "@/features/training-record/constants/injury";
import type { InjuredAthlete } from "../types/index";

interface InjuredAthletesCardProps {
  athletes?: InjuredAthlete[];
}

const MAX_VISIBLE = 3;

function getInitials(name: string): string {
  if (!name) return "AT";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function AthleteInjuryItem({
  athlete,
  onNavigate,
}: {
  athlete: InjuredAthlete;
  onNavigate?: () => void;
}) {
  const { t, i18n } = useTranslation(["dashboard", "training", "common"]);

  const bodyPartLabel = getInjuryBodyPartLabel(
    athlete.injuryBodyPart,
    (k, opts) => t(k, opts),
  );
  const typeLabel = getInjuryTypeLabel(athlete.injuryType, (k, opts) =>
    t(k, opts),
  );
  const formattedDate = athlete.injuryDate
    ? new Date(athlete.injuryDate).toLocaleDateString(
        i18n.language === "ar" ? "ar-EG" : "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        },
      )
    : null;

  return (
    <div className="rounded-2xl border border-border/80 bg-muted/15 p-4.5 hover:border-rose-500/35 hover:bg-card hover:shadow-sm transition-all duration-200 flex flex-col justify-between group">
      <div>
        {/* Athlete Identity Row */}
        <div className="flex items-center gap-3">
          <Avatar className="size-11 rounded-xl ring-1 ring-border/60 shrink-0 group-hover:ring-rose-500/30 transition-all">
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
              onClick={onNavigate}
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
            <span className="line-clamp-2">"{athlete.injuryComment}"</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <div className="mt-4 pt-3 border-t border-border/50">
        <Link
          to={`/athletes/${athlete.athleteId}`}
          onClick={onNavigate}
          className="inline-flex w-full h-8 items-center justify-between px-2 rounded-xl text-xs font-semibold text-muted-foreground hover:text-primary hover:bg-primary/5 transition-colors"
        >
          <span>{t("dashboard:injuries.viewProfile")}</span>
          <MdArrowForward className="size-3.5 rtl:rotate-180" />
        </Link>
      </div>
    </div>
  );
}

export function InjuredAthletesCard({
  athletes = [],
}: InjuredAthletesCardProps) {
  const { t } = useTranslation(["dashboard", "training", "common"]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const displayedAthletes = athletes.slice(0, MAX_VISIBLE);
  const hasMore = athletes.length > MAX_VISIBLE;

  const filteredAthletes = useMemo(() => {
    if (!searchQuery.trim()) return athletes;
    const q = searchQuery.toLowerCase();
    return athletes.filter((a) => a.fullName.toLowerCase().includes(q));
  }, [athletes, searchQuery]);

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
                {t("dashboard:injuries.cardTitle")}
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("dashboard:injuries.empty")}
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
    <>
      <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-5">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
              <MdLocalHospital className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-foreground">
                  {t("dashboard:injuries.cardTitle")}
                </h3>
                <Badge
                  variant="outline"
                  className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold px-2 py-0.5 rounded-full"
                >
                  {t("dashboard:injuries.countBadge", {
                    count: athletes.length,
                  })}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("dashboard:injuries.cardSubtitle")}
              </p>
            </div>
          </div>

          {hasMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="gap-1.5 text-xs font-semibold self-start sm:self-auto cursor-pointer rounded-xl hover:border-rose-500/40 hover:text-rose-600 dark:hover:text-rose-400 transition-colors"
            >
              <MdOpenInNew className="size-3.5" />
              <span>
                {t("dashboard:injuries.viewAll", { count: athletes.length })}
              </span>
            </Button>
          )}
        </div>

        {/* Grid of Displayed Injured Athletes (Max 3) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayedAthletes.map((athlete) => (
            <AthleteInjuryItem
              key={`${athlete.athleteId}-${athlete.injuryDate}`}
              athlete={athlete}
            />
          ))}
        </div>

        {/* Show More Trigger Banner if > 3 */}
        {hasMore && (
          <div className="pt-1 flex items-center justify-center border-t border-border/40">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsDialogOpen(true)}
              className="gap-2 text-xs font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 hover:bg-rose-500/10 rounded-xl px-4 py-2 h-9 cursor-pointer transition-all duration-200"
            >
              <span>
                {t("dashboard:injuries.showMore")} (+
                {athletes.length - MAX_VISIBLE})
              </span>
              <MdArrowForward className="size-3.5 rtl:rotate-180" />
            </Button>
          </div>
        )}
      </div>

      {/* Modern Dialog to View All Injured Athletes */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-4xl max-h-[85vh] flex flex-col p-0 overflow-hidden rounded-3xl bg-card border border-border/80 shadow-2xl">
          {/* Dialog Header */}
          <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/60 bg-muted/20">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shrink-0">
                <MdLocalHospital className="size-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <DialogTitle className="text-base font-bold text-foreground">
                    {t("dashboard:injuries.dialogTitle")}
                  </DialogTitle>
                  <Badge
                    variant="outline"
                    className="border-rose-500/30 bg-rose-500/10 text-rose-600 dark:text-rose-400 text-[11px] font-bold px-2 py-0.5 rounded-full"
                  >
                    {t("dashboard:injuries.countBadge", {
                      count: athletes.length,
                    })}
                  </Badge>
                </div>
                <DialogDescription className="text-xs text-muted-foreground mt-0.5">
                  {t("dashboard:injuries.dialogSubtitle")}
                </DialogDescription>
              </div>
            </div>

            {/* Quick Search */}
            <div className="mt-3.5">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={t("dashboard:injuries.searchPlaceholder")}
                className="w-full sm:max-w-md"
              />
            </div>
          </DialogHeader>

          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-6">
            {filteredAthletes.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <MdSearchOff className="size-8 opacity-40" />
                <p className="text-xs font-medium">
                  {t("dashboard:injuries.noSearchMatch")}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {filteredAthletes.map((athlete) => (
                  <AthleteInjuryItem
                    key={`dialog-${athlete.athleteId}-${athlete.injuryDate}`}
                    athlete={athlete}
                    onNavigate={() => setIsDialogOpen(false)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Dialog Footer */}
          <div className="px-6 py-4 border-t border-border/60 bg-muted/20 flex items-center justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsDialogOpen(false)}
              className="cursor-pointer rounded-xl px-4"
            >
              {t("common:close")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
