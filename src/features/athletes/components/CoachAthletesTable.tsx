import { useTranslation } from "react-i18next";
import { MdMale, MdFemale, MdPerson } from "react-icons/md";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { CoachAthlete, Gender, RegistrationStatus } from "../types/index";

interface CoachAthletesTableProps {
  athletes: CoachAthlete[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .join("")
    .substring(0, 2)
    .toUpperCase();
}

function GenderBadge({ gender }: { gender: Gender }) {
  if (gender === 1)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 font-medium">
        <MdMale className="size-3.5" />
        Male
      </span>
    );
  if (gender === 2)
    return (
      <span className="inline-flex items-center gap-1 text-xs text-pink-600 dark:text-pink-400 font-medium">
        <MdFemale className="size-3.5" />
        Female
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-xs text-muted-foreground font-medium">
      <MdPerson className="size-3.5" />
      Unknown
    </span>
  );
}

function RegistrationBadge({ status }: { status: RegistrationStatus }) {
  if (status === 1)
    return (
      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium w-fit">
        Active
      </Badge>
    );
  if (status === 2)
    return (
      <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-medium w-fit">
        Pending
      </Badge>
    );
  return (
    <Badge
      variant="outline"
      className="text-muted-foreground text-xs px-2.5 py-0.5 rounded-full font-medium w-fit"
    >
      Inactive
    </Badge>
  );
}

export function CoachAthletesTable({
  athletes,
  isLoading,
  isError,
  onRetry,
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
            <TableHead className="py-3 pe-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              {t("table.registrationStatus")}
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
            {athletes.map((athlete, idx) => (
              <TableRow
                key={`${athlete.email}-${idx}`}
                className="hover:bg-muted/40 transition-colors"
              >
                {/* Name + Avatar */}
                <TableCell className="py-3.5 ps-6 font-medium">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary font-semibold text-xs border border-primary/20 shrink-0">
                      {getInitials(athlete.fullName)}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">
                        {athlete.fullName}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {athlete.email}
                      </div>
                    </div>
                  </div>
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

                {/* Registration Status */}
                <TableCell className="py-3.5 pe-6">
                  <RegistrationBadge status={athlete.registrationStatus} />
                </TableCell>
              </TableRow>
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
