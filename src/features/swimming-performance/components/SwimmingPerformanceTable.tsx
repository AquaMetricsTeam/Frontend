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
import type { TrainingRecordResponse } from "@/features/training-record/types";

interface SwimmingPerformanceTableProps {
  records: TrainingRecordResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetails: (item: TrainingRecordResponse) => void;
  onEdit: (item: TrainingRecordResponse) => void;
  canManage: boolean;
}

export function SwimmingPerformanceTable({
  records,
  isLoading,
  isError,
  onRetry,
  onViewDetails,
  onEdit,
  canManage,
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
              {t("table.sessionDate")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.performanceRating")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.fatigueLevel")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.sessionStatus")}
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              {t("table.injury")}
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
            hasNoData={!isLoading && !isError && records.length === 0}
            skeletonProps={{ rows: 5, columns: 7 }}
            errorMessageProps={{ onRetry }}
            noDataMessageProps={{
              messageKey: "common:noData.default",
              descriptionKey: "common:noData.description",
            }}
          >
            {records.map((item) => (
              <SwimmingPerformanceTableRow
                key={item.id}
                record={item}
                onViewDetails={onViewDetails}
                onEdit={onEdit}
                canManage={canManage}
              />
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
