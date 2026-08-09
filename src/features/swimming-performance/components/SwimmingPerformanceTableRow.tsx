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
  MdArchive,
  MdUnarchive,
  MdTimer,
} from "react-icons/md";
import type { SwimmingPerformance } from "../types";
import { STROKE_METADATA, STATUS_METADATA } from "../constants/enums";
import { formatTimeSpanDisplay } from "./MmSsInput";
import { MiniRatingBar } from "./SegmentedRatingControl";
import { cn } from "@/lib/utils";

interface SwimmingPerformanceTableRowProps {
  performance: SwimmingPerformance;
  onViewDetails: (item: SwimmingPerformance) => void;
  onEdit: (item: SwimmingPerformance) => void;
  onArchiveToggle: (item: SwimmingPerformance) => void;
  canManage: boolean;
  isArchivedView?: boolean;
}

export function SwimmingPerformanceTableRow({
  performance,
  onViewDetails,
  onEdit,
  onArchiveToggle,
  canManage,
  isArchivedView = false,
}: SwimmingPerformanceTableRowProps) {
  const { t } = useTranslation("swimming");

  const strokeMeta = STROKE_METADATA[performance.stroke];
  const statusMeta = STATUS_METADATA[performance.status];

  // Calculate avg rating from the 5 technical grades
  const avgGrade =
    (performance.technique +
      performance.start +
      performance.turns +
      performance.finish +
      performance.paceConsistency) /
    5;

  return (
    <TableRow
      className={cn(
        "hover:bg-muted/40 transition-colors",
        isArchivedView && "opacity-75 bg-muted/20",
      )}
    >
      {/* Athlete */}
      <TableCell className="font-semibold text-foreground py-3.5">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-foreground">
            {performance.athleteName ?? "Athlete"}
          </span>
          <span className="text-[11px] font-medium text-muted-foreground">
            {performance.trainingSessionTitle ?? "Training Session"}
          </span>
        </div>
      </TableCell>

      {/* Stroke Tag */}
      <TableCell className="py-3.5">
        <Badge
          variant="outline"
          className={cn("text-xs font-semibold px-2.5 py-0.5", strokeMeta?.badgeClass)}
        >
          {strokeMeta ? t(strokeMeta.labelKey) : "Freestyle"}
        </Badge>
      </TableCell>

      {/* Distance × Reps */}
      <TableCell className="py-3.5 text-xs font-medium text-foreground">
        <span className="font-bold text-primary">
          {performance.distanceMeters}m
        </span>{" "}
        × {performance.repetitions}{" "}
        <span className="text-[11px] text-muted-foreground">
          ({performance.restIntervalSeconds}s rest)
        </span>
      </TableCell>

      {/* Split Times (Best / Avg / Worst) */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-2 font-mono text-xs">
          <span className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400">
            <MdTimer className="size-3 text-emerald-500" />
            {formatTimeSpanDisplay(performance.bestRepTime)}
          </span>
          <span className="text-muted-foreground font-normal">/</span>
          <span className="font-medium text-foreground">
            {formatTimeSpanDisplay(performance.averageRepTime)}
          </span>
          <span className="text-muted-foreground font-normal">/</span>
          <span className="font-medium text-rose-500">
            {formatTimeSpanDisplay(performance.worstRepTime)}
          </span>
        </div>
      </TableCell>

      {/* Technical Evaluation */}
      <TableCell className="py-3.5">
        <div className="flex items-center gap-2">
          <MiniRatingBar rating={avgGrade} />
          <span className="text-xs font-bold text-foreground font-mono">
            {avgGrade.toFixed(1)}
          </span>
        </div>
      </TableCell>

      {/* RPE */}
      <TableCell className="py-3.5">
        {performance.rpe ? (
          <Badge
            variant="secondary"
            className="text-xs font-bold font-mono bg-primary/10 text-primary border-primary/20"
          >
            {performance.rpe} / 10
          </Badge>
        ) : (
          <span className="text-xs text-muted-foreground italic">—</span>
        )}
      </TableCell>

      {/* Status */}
      <TableCell className="py-3.5">
        <Badge
          variant="outline"
          className={cn("text-xs font-semibold px-2 py-0.5", statusMeta?.badgeClass)}
        >
          {statusMeta ? t(statusMeta.labelKey) : "Completed"}
        </Badge>
      </TableCell>

      {/* Actions Dropdown */}
      <TableCell className="py-3.5 text-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="size-8 rounded-lg cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <MdMoreVert className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={() => onViewDetails(performance)}
              className="gap-2 cursor-pointer text-xs"
            >
              <MdVisibility className="size-4 text-primary" />
              {t("table.viewDetails")}
            </DropdownMenuItem>

            {canManage && (
              <>
                {!isArchivedView && (
                  <DropdownMenuItem
                    onClick={() => onEdit(performance)}
                    className="gap-2 cursor-pointer text-xs"
                  >
                    <MdEdit className="size-4 text-amber-500" />
                    {t("table.edit")}
                  </DropdownMenuItem>
                )}

                {isArchivedView ? (
                  <DropdownMenuItem
                    onClick={() => onArchiveToggle(performance)}
                    className="gap-2 cursor-pointer text-xs text-emerald-600 focus:text-emerald-600 font-semibold"
                  >
                    <MdUnarchive className="size-4 text-emerald-500" />
                    {t("table.restore")}
                  </DropdownMenuItem>
                ) : (
                  <DropdownMenuItem
                    onClick={() => onArchiveToggle(performance)}
                    className="gap-2 cursor-pointer text-xs text-rose-600 focus:text-rose-600"
                  >
                    <MdArchive className="size-4 text-rose-500" />
                    {t("table.archive")}
                  </DropdownMenuItem>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}
