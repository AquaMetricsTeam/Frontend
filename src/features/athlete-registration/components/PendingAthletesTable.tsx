import { useTranslation } from "react-i18next";
import {
  MdCheckCircle,
  MdClose,
  MdDescription,
  MdHourglassTop,
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
import type { PendingAthlete } from "../types/index";

interface PendingAthletesTableProps {
  athletes: PendingAthlete[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onReview: (athlete: PendingAthlete) => void;
  onApprove: (athlete: PendingAthlete) => void;
  onReject: (athlete: PendingAthlete) => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

export function PendingAthletesTable({
  athletes,
  isLoading,
  isError,
  onRetry,
  onReview,
  onApprove,
  onReject,
}: PendingAthletesTableProps) {
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
              {t("registration.table.eligibilityDoc")}
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
                key={athlete.athleteId}
                className="hover:bg-muted/40 transition-colors group cursor-pointer"
                onClick={() => onReview(athlete)}
              >
                {/* Name + Avatar */}
                <TableCell className="py-3.5 ps-6 font-medium">
                  <div className="flex items-center gap-3">
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
                      <div className="font-semibold text-foreground text-sm group-hover:text-primary transition-colors">
                        {athlete.fullName}
                      </div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {athlete.athleteId.substring(0, 8)}...
                      </div>
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell className="py-3.5 text-sm text-muted-foreground">
                  {athlete.email}
                </TableCell>

                {/* Eligibility Document */}
                <TableCell
                  className="py-3.5"
                  onClick={(e) => {
                    e.stopPropagation();
                    onReview(athlete);
                  }}
                >
                  {athlete.eligibilityDocumentUrl ? (
                    <Badge
                      variant="outline"
                      className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 text-xs px-2 py-0.5 rounded-md font-medium inline-flex items-center gap-1 cursor-pointer"
                    >
                      <MdDescription className="size-3" />
                      {t("registration.table.hasDocument")}
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground italic">
                      {t("registration.table.noDocument")}
                    </span>
                  )}
                </TableCell>

                {/* Status */}
                <TableCell className="py-3.5">
                  <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 hover:bg-amber-500/25 border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium flex items-center w-fit gap-1">
                    <MdHourglassTop className="size-3" />
                    {athlete.registrationStatus || t("status.pending")}
                  </Badge>
                </TableCell>

                {/* Actions */}
                <TableCell
                  className="py-3.5 pe-6 text-end"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-1.5">
                    {/* Review Details */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 rounded-lg border-border hover:border-primary/50 hover:bg-primary/5 cursor-pointer"
                      onClick={() => onReview(athlete)}
                    >
                      <MdVisibility className="size-3.5 text-primary" />
                      <span>{t("registration.actions.review")}</span>
                    </Button>

                    {/* Quick Approve */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 rounded-lg border-emerald-500/30 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500 cursor-pointer"
                      onClick={() => onApprove(athlete)}
                    >
                      <MdCheckCircle className="size-3.5" />
                      <span>{t("registration.actions.approve")}</span>
                    </Button>

                    {/* Quick Reject */}
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 text-xs gap-1 rounded-lg border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive cursor-pointer"
                      onClick={() => onReject(athlete)}
                    >
                      <MdClose className="size-3.5" />
                      <span>{t("registration.actions.reject")}</span>
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
