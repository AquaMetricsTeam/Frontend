import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TableRow, TableCell } from "@/components/ui/table";
import {
  MdMoreVert,
  MdVisibility,
  MdEdit,
  MdCheckCircle,
  MdCancel,
  MdWarning,
} from "react-icons/md";
import type { TrainingRecordResponse } from "@/features/training-record/types";
import { cn } from "@/lib/utils";

interface SwimmingPerformanceTableRowProps {
  record: TrainingRecordResponse;
  onViewDetails: (item: TrainingRecordResponse) => void;
  onEdit: (item: TrainingRecordResponse) => void;
  canManage: boolean;
}

export function SwimmingPerformanceTableRow({
  record,
  onViewDetails,
  onEdit,
  canManage,
}: SwimmingPerformanceTableRowProps) {
  const { t } = useTranslation("swimming");

  return (
    <TableRow className="hover:bg-muted/40 transition-colors">
      {/* Athlete */}
      <TableCell className="py-3.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">
            {record.athleteName}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {record.sessionTitle}
          </span>
        </div>
      </TableCell>

      {/* Session Date */}
      <TableCell className="py-3.5 text-xs font-medium text-muted-foreground">
        {record.sessionDate}
      </TableCell>

      {/* Performance Rating */}
      <TableCell className="py-3.5">
        <Badge
          variant="secondary"
          className="bg-primary/10 text-primary border-primary/20 font-bold text-xs"
        >
          {record.performanceRating} / 10
        </Badge>
      </TableCell>

      {/* Fatigue Level */}
      <TableCell className="py-3.5">
        <Badge
          variant="secondary"
          className={cn(
            "font-bold text-xs",
            record.fatigueLevel >= 8
              ? "bg-rose-500/10 text-rose-600 border-rose-500/20"
              : record.fatigueLevel >= 5
                ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                : "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
          )}
        >
          {record.fatigueLevel} / 10
        </Badge>
      </TableCell>

      {/* Session Completed */}
      <TableCell className="py-3.5">
        <Badge
          variant="outline"
          className={cn(
            "text-xs font-semibold px-2 py-0.5 flex items-center gap-1 w-fit",
            record.sessionCompleted
              ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-600 border-rose-500/20",
          )}
        >
          {record.sessionCompleted ? (
            <>
              <MdCheckCircle className="size-3" />
              {t("table.completed")}
            </>
          ) : (
            <>
              <MdCancel className="size-3" />
              {t("table.incomplete")}
            </>
          )}
        </Badge>
      </TableCell>

      {/* Injury */}
      <TableCell className="py-3.5">
        {record.injuryOccurred ? (
          <Badge
            variant="outline"
            className="bg-rose-500/15 text-rose-600 border-rose-500/30 text-xs font-bold px-2 py-0.5 flex items-center gap-1 w-fit"
          >
            <MdWarning className="size-3.5" />
            {t("table.injury")}
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground italic">—</span>
        )}
      </TableCell>

      {/* Actions */}
      <TableCell className="py-3.5 text-end">
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                size="icon"
                className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
              />
            }
          >
            <MdMoreVert className="size-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onViewDetails(record)}
              className="gap-2 cursor-pointer text-xs"
            >
              <MdVisibility className="size-4 text-primary" />
              {t("table.viewDetails")}
            </DropdownMenuItem>

            {canManage && (
              <DropdownMenuItem
                onClick={() => onEdit(record)}
                className="gap-2 cursor-pointer text-xs"
              >
                <MdEdit className="size-4 text-amber-500" />
                {t("table.edit")}
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
