import { useTranslation } from "react-i18next";
import {
  MdGroups,
  MdPool,
  MdFitnessCenter,
  MdPersonAdd,
  MdPerson,
  MdRestaurant,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { AthleteOverviewResponse } from "../../../types/index";

interface AthleteCoachesGroupsTabProps {
  athlete: AthleteOverviewResponse;
  isAdmin?: boolean;
  onOpenAssignModal?: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function getDomainMeta(domainName?: string, domainId?: number) {
  const name = String(domainName || "").toLowerCase();
  if (name.includes("swim") || domainId === 1) {
    return {
      icon: MdPool,
      badgeClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
      avatarClass:
        "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      cardBorderHover: "hover:border-blue-500/40",
      label: "Swimming",
    };
  }
  if (name.includes("fit") || domainId === 2) {
    return {
      icon: MdFitnessCenter,
      badgeClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
      avatarClass:
        "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      cardBorderHover: "hover:border-emerald-500/40",
      label: "Fitness",
    };
  }
  if (name.includes("nutri") || domainId === 3) {
    return {
      icon: MdRestaurant,
      badgeClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
      avatarClass:
        "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      cardBorderHover: "hover:border-amber-500/40",
      label: "Nutrition",
    };
  }
  return {
    icon: MdPerson,
    badgeClass: "bg-primary/10 text-primary border-primary/30",
    avatarClass: "bg-primary/10 text-primary border-primary/20",
    cardBorderHover: "hover:border-primary/40",
    label: domainName || "Coach",
  };
}

export function AthleteCoachesGroupsTab({
  athlete,
  isAdmin,
  onOpenAssignModal,
}: AthleteCoachesGroupsTabProps) {
  const { t } = useTranslation("athletes");

  const coaches = athlete.coaches || [];
  const groups = athlete.groups || [];

  return (
    <div className="space-y-8">
      {/* Section 1: Assigned Coaches */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <MdPerson className="size-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">
                {t("profile.coaches.title")}
              </h3>
              <p className="text-xs text-muted-foreground">
                {t("profile.coaches.subtitle", { count: coaches.length })}
              </p>
            </div>
          </div>

          {isAdmin && onOpenAssignModal && (
            <Button
              size="sm"
              variant="outline"
              onClick={onOpenAssignModal}
              className="h-9 gap-1.5 rounded-xl border-border hover:border-primary/40 hover:bg-primary/5 text-xs font-semibold cursor-pointer"
            >
              <MdPersonAdd className="size-4 text-primary" />
              <span>{t("table.manageCoaches")}</span>
            </Button>
          )}
        </div>

        {coaches.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
              <MdPerson className="size-6" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-foreground">
              {t("table.noCoaches")}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("profile.coaches.noCoachesAssignedDesc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {coaches.map((coach) => {
              const meta = getDomainMeta(coach.domainName, coach.domainId);
              const DomainIcon = meta.icon;

              return (
                <div
                  key={coach.coachId}
                  className={`flex items-center gap-4 rounded-2xl border border-border bg-card p-4 shadow-xs ${meta.cardBorderHover} hover:shadow-sm transition-all`}
                >
                  {/* Coach Avatar */}
                  {coach.profilePictureUrl ? (
                    <img
                      src={coach.profilePictureUrl}
                      alt={coach.coachName}
                      className="size-14 rounded-2xl object-cover border border-border shrink-0"
                    />
                  ) : (
                    <div
                      className={`flex size-14 items-center justify-center rounded-2xl font-bold text-sm border shrink-0 ${meta.avatarClass}`}
                    >
                      {getInitials(coach.coachName)}
                    </div>
                  )}

                  {/* Coach Info */}
                  <div className="space-y-1.5 overflow-hidden">
                    <h4 className="text-sm font-bold text-foreground truncate">
                      {coach.coachName}
                    </h4>

                    <Badge
                      variant="outline"
                      className={`text-[11px] gap-1 font-semibold border ${meta.badgeClass}`}
                    >
                      <DomainIcon className="size-3" />
                      <span>{coach.domainName || meta.label}</span>
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Section 2: Assigned Squads & Groups */}
      <div className="space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-500">
            <MdGroups className="size-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">
              {t("profile.groups.title")}
            </h3>
            <p className="text-xs text-muted-foreground">
              {t("profile.groups.subtitle", { count: groups.length })}
            </p>
          </div>
        </div>

        {groups.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card p-10 text-center shadow-xs">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-cyan-500/10 text-cyan-500">
              <MdGroups className="size-6" />
            </div>
            <h4 className="mt-3 text-sm font-semibold text-foreground">
              {t("profile.groups.noGroupsFound")}
            </h4>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("profile.groups.noGroupsDesc")}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map((group) => {
              const meta = getDomainMeta(group.domainName, group.domainId);
              const DomainIcon = meta.icon;

              return (
                <div
                  key={group.id}
                  className={`flex items-center justify-between rounded-2xl border border-border bg-card p-4 shadow-xs ${meta.cardBorderHover} hover:shadow-sm transition-all`}
                >
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-foreground">
                      {group.name}
                    </h4>
                    <span className="text-xs text-muted-foreground">
                      ID: #{group.id}
                    </span>
                  </div>

                  <Badge
                    variant="outline"
                    className={`text-[11px] gap-1 font-semibold border ${meta.badgeClass}`}
                  >
                    <DomainIcon className="size-3" />
                    <span>{group.domainName || meta.label}</span>
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
