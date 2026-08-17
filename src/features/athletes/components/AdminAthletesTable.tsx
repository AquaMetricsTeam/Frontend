import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  MdPersonAdd,
  MdCheckCircle,
  MdCancel,
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
import type { AdminAthlete } from "../types/index";

interface AdminAthletesTableProps {
  athletes: AdminAthlete[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onOpenAssignModal: (athlete: AdminAthlete) => void;
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

function CoachBadge({ name, role }: { name: string; role: string }) {
  const cls = ROLE_BADGE_CLASS[role] ?? DEFAULT_BADGE_CLASS;
  return (
    <Badge
      variant="outline"
      className={`text-[11px] px-2 py-0.5 rounded-md font-medium border ${cls}`}
    >
      {name} ({formatRole(role)})
    </Badge>
  );
}

export function AdminAthletesTable({
  athletes,
  isLoading,
  isError,
  onRetry,
  onOpenAssignModal,
}: AdminAthletesTableProps) {
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
              {t("table.email")}
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.coaches")}
            </TableHead>
            <TableHead className="py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.status")}
            </TableHead>
            <TableHead className="py-3 pe-6 text-end text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            skeletonProps={{ rows: 5, columns: 5 }}
            errorMessageProps={{ onRetry }}
            hasNoData={!isLoading && !isError && athletes.length === 0}
          >
            {athletes.map((athlete) => (
              <TableRow
                key={athlete.id}
                className="hover:bg-muted/40 transition-colors group"
              >
                {/* Name + Avatar */}
                <TableCell className="py-3.5 ps-6 font-medium">
                  <Link
                    to={`/athletes/${athlete.athleteId || athlete.id}`}
                    className="flex items-center gap-3 group/link hover:opacity-90 transition-opacity"
                  >
                    {athlete.profilePictureUrl ? (
                      <img
                        src={athlete.profilePictureUrl}
                        alt={athlete.fullName}
                        className="h-9 w-9 rounded-full object-cover border border-border/50 shrink-0"
                      />
                    ) : (
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 shrink-0">
                        {getInitials(athlete.fullName)}
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-foreground text-sm group-hover/link:text-primary transition-colors">
                        {athlete.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(athlete.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </Link>
                </TableCell>

                {/* Email */}
                <TableCell className="py-3.5 text-sm text-muted-foreground">
                  {athlete.email}
                </TableCell>

                {/* Assigned Coaches — clickable cell */}
                <TableCell
                  className="py-3.5 cursor-pointer hover:bg-primary/5 transition-colors"
                  onClick={() => onOpenAssignModal(athlete)}
                  title={t("table.manageCoaches")}
                >
                  {athlete.assignedCoaches.length === 0 ? (
                    <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary">
                      <MdPersonAdd className="size-4 text-primary" />
                      {t("table.noCoaches")}
                    </span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-1.5">
                      {athlete.assignedCoaches.map((c) => (
                        <CoachBadge
                          key={c.coachId}
                          name={c.coachName}
                          role={c.role}
                        />
                      ))}
                    </div>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5">
                  {athlete.isActive ? (
                    <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/25 border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center w-fit gap-1">
                      <MdCheckCircle className="size-3" />
                      {t("status.active")}
                    </Badge>
                  ) : (
                    <Badge
                      variant="outline"
                      className="text-muted-foreground text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center w-fit gap-1"
                    >
                      <MdCancel className="size-3" />
                      {t("status.inactive")}
                    </Badge>
                  )}
                </TableCell>

                {/* Actions */}
                <TableCell className="py-3.5 pe-6 text-end">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs   gap-1.5 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                    >
                      <Link
                        to={`/athletes/${athlete.athleteId || athlete.id}`}
                        className="flex items-center gap-1"
                      >
                        <MdVisibility className="size-3.5 text-primary" />
                        <span>{t("table.viewProfile")}</span>
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1.5 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                      onClick={() => onOpenAssignModal(athlete)}
                    >
                      <MdPersonAdd className="size-3.5 text-primary" />
                      {t("table.manageCoaches")}
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
