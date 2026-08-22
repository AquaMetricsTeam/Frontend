import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdMale,
  MdFemale,
  MdPerson,
  MdStickyNote2,
  MdVisibility,
} from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { CoachAthlete, Gender } from "../types/index";

interface CoachAthletesTableProps {
  athletes: CoachAthlete[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenNotes?: (athlete: {
    id: string;
    fullName: string;
    email?: string;
  }) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function formatRole(role: string) {
  switch (role) {
    case "SwimmingCoach":
      return "Swimming";
    case "FitnessCoach":
      return "Fitness";
    case "NutritionSpecialist":
      return "Nutrition";
    default:
      return role;
  }
}

const ROLE_BADGE_CLASS: Record<string, string> = {
  SwimmingCoach:
    "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30",
  FitnessCoach:
    "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
  NutritionSpecialist:
    "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30",
};

const DEFAULT_BADGE_CLASS = "bg-primary/10 text-primary border-primary/30";

function CoachBadge({ name, role }: { name: string; role?: string }) {
  const cls = (role && ROLE_BADGE_CLASS[role]) ?? DEFAULT_BADGE_CLASS;
  return (
    <Badge
      variant="outline"
      className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${cls}`}
    >
      {name} {role ? `(${formatRole(role)})` : ""}
    </Badge>
  );
}

function getCoachesList(
  athlete: CoachAthlete,
): { id: string; name: string; role?: string }[] {
  if (Array.isArray(athlete.coaches) && athlete.coaches.length > 0) {
    return athlete.coaches.map((c, i) => {
      if (typeof c === "string") {
        return { id: `c-${i}`, name: c };
      }
      return {
        id: c.coachId || `c-${i}`,
        name: c.coachName || c.name || "Unknown Coach",
        role: c.role,
      };
    });
  }
  if (Array.isArray(athlete.coachNames) && athlete.coachNames.length > 0) {
    return athlete.coachNames.map((name, i) => ({ id: `cn-${i}`, name }));
  }
  return [];
}

function GenderBadge({ gender }: { gender: Gender }) {
  if (gender === 1)
    return (
      <Badge
        variant="outline"
        className="rounded-md font-medium text-xs gap-1 border-blue-500/20 text-blue-700 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5"
      >
        <MdMale className="size-3.5" />
        <span>Male</span>
      </Badge>
    );
  if (gender === 2)
    return (
      <Badge
        variant="outline"
        className="rounded-md font-medium text-xs gap-1 border-pink-500/20 text-pink-700 dark:text-pink-400 bg-pink-500/10 px-2 py-0.5"
      >
        <MdFemale className="size-3.5" />
        <span>Female</span>
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="rounded-md font-medium text-xs gap-1 text-muted-foreground px-2 py-0.5"
    >
      <MdPerson className="size-3.5" />
      <span>Unknown</span>
    </Badge>
  );
}

export function CoachAthletesTable({
  athletes,
  isLoading,
  isError,
  onRetry,
  onOpenNotes,
}: CoachAthletesTableProps) {
  const { t } = useTranslation("athletes");

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50 hover:bg-muted/50 border-b border-border">
            <TableHead className="py-3 ps-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.name")}
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.gender")}
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.age")}
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.groups")}
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.coaches")}
            </TableHead>
            <TableHead className="py-3 pe-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground text-end">
              {t("table.actions", "Actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            skeletonProps={{ rows: 5, columns: 6 }}
            errorMessageProps={{ onRetry }}
            hasNoData={!isLoading && !isError && athletes.length === 0}
          >
            {athletes.map((athlete, idx) => {
              const coachesList = getCoachesList(athlete);

              return (
                <TableRow
                  key={`${athlete.email}-${idx}`}
                  className="hover:bg-muted/40 transition-colors"
                >
                  {/* Name + Avatar */}
                  <TableCell className="py-3.5 ps-6 font-medium">
                    <Link
                      to={`/athletes/${athlete.athleteId || athlete.id}`}
                      className="flex items-center gap-3 group/link hover:opacity-90 transition-opacity"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 shrink-0">
                        {getInitials(athlete.fullName)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground text-sm group-hover/link:text-primary transition-colors">
                          {athlete.fullName}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {athlete.email}
                        </div>
                      </div>
                    </Link>
                  </TableCell>

                  {/* Gender */}
                  <TableCell className="py-3.5">
                    <GenderBadge gender={athlete.gender} />
                  </TableCell>

                  {/* Age */}
                  <TableCell className="py-3.5 text-sm text-muted-foreground">
                    {athlete.age}
                  </TableCell>

                  {/* Groups */}
                  <TableCell className="py-3.5">
                    {athlete.groupNames.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap gap-1">
                        {athlete.groupNames.map((g) => (
                          <Badge
                            key={g}
                            variant="secondary"
                            className="text-[11px] px-2 py-0.5 rounded-md font-medium"
                          >
                            {g}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </TableCell>

                  {/* Coaches */}
                  <TableCell className="py-3.5">
                    {coachesList.length === 0 ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <div className="flex flex-wrap items-center gap-1.5">
                        {coachesList.map((c) => (
                          <CoachBadge key={c.id} name={c.name} role={c.role} />
                        ))}
                      </div>
                    )}
                  </TableCell>

                  {/* Actions */}
                  <TableCell className="py-3.5 pe-6">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 gap-1 px-2 text-xs text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                      >
                        <Link
                          to={`/athletes/${athlete.athleteId || athlete.id}`}
                          className="flex items-center gap-1"
                        >
                          <MdVisibility className="size-3.5 text-primary" />
                          <span>{t("table.viewProfile")}</span>
                        </Link>
                      </Button>
                      {onOpenNotes && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 gap-1.5 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10 rounded-lg cursor-pointer"
                          onClick={() =>
                            onOpenNotes({
                              id: athlete.id || athlete.athleteId || "",
                              fullName: athlete.fullName,
                              email: athlete.email,
                            })
                          }
                        >
                          <MdStickyNote2 className="size-4" />
                          <span>Notes</span>
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
