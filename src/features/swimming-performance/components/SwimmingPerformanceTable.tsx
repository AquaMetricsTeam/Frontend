import { useTranslation } from "react-i18next";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
} from "@/components/ui/table";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import { SwimmingPerformanceTableRow } from "./SwimmingPerformanceTableRow";
import type { SwimmingPerformance } from "../types";

interface SwimmingPerformanceTableProps {
  performances: SwimmingPerformance[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetails: (item: SwimmingPerformance) => void;
  onEdit: (item: SwimmingPerformance) => void;
  onArchiveToggle: (item: SwimmingPerformance) => void;
  canManage: boolean;
  isArchivedView?: boolean;
}

export function SwimmingPerformanceTable({
  performances,
  isLoading,
  isError,
  onRetry,
  onViewDetails,
  onEdit,
  onArchiveToggle,
  canManage,
  isArchivedView = false,
}: SwimmingPerformanceTableProps) {
  const { t } = useTranslation("swimming");

  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.athlete")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.stroke")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.distanceReps")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.splitTimes")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.technicalRating")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.rpe")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.status")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-end">
              {t("table.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            columnCount={8}
            rowCount={5}
            onRetry={onRetry}
            isEmpty={performances.length === 0}
            emptyTitle={t("table.noRecords")}
            emptyDescription={t("table.noRecordsDesc")}
          >
            {performances.map((item) => (
              <SwimmingPerformanceTableRow
                key={item.id}
                performance={item}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                onArchiveToggle={onArchiveToggle}
                canManage={canManage}
                isArchivedView={isArchivedView}
              />
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
