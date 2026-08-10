import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MdMoreVert,
  MdVisibility,
  MdEdit,
  MdCheckCircle,
  MdCancel,
  MdWarning,
} from "react-icons/md";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { TrainingRecordResponse } from "@/features/training-record/types";
import { cn } from "@/lib/utils";

function RatingBar({ value, max = 10 }: { value: number; max?: number }) {
  const pct = (value / max) * 100;
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 rounded-full bg-muted overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            pct >= 70 ? "bg-emerald-500" : pct >= 40 ? "bg-amber-500" : "bg-rose-500",
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="text-xs font-semibold tabular-nums text-foreground">
        {value}/{max}
      </span>
    </div>
  );
}

interface FitnessRecordsTableProps {
  records: TrainingRecordResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onViewDetails: (record: TrainingRecordResponse) => void;
  onEdit: (record: TrainingRecordResponse) => void;
}

export function FitnessRecordsTable({
  records,
  isLoading,
  isError,
  onRetry,
  onViewDetails,
  onEdit,
}: FitnessRecordsTableProps) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              Athlete
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              Session
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              Date
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              Performance
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              Fatigue
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase">
              Status
            </TableHead>
            <TableHead className="text-xs font-semibold text-muted-foreground uppercase text-end">
              Actions
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
            {records.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">
                      {r.athleteName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-xs text-muted-foreground">
                    {r.sessionTitle}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-xs font-mono text-muted-foreground">
                    {r.sessionDate}
                  </span>
                </TableCell>
                <TableCell>
                  <RatingBar value={r.performanceRating} />
                </TableCell>
                <TableCell>
                  <RatingBar value={r.fatigueLevel} />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-[10px] font-semibold px-2 py-0.5 flex items-center gap-1 w-fit",
                        r.sessionCompleted
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-rose-500/10 text-rose-600 border-rose-500/20",
                      )}
                    >
                      {r.sessionCompleted ? (
                        <>
                          <MdCheckCircle className="size-3" />
                          Completed
                        </>
                      ) : (
                        <>
                          <MdCancel className="size-3" />
                          Incomplete
                        </>
                      )}
                    </Badge>
                    {r.injuryOccurred && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold bg-rose-500/10 text-rose-600 border-rose-500/20 px-2 py-0.5 flex items-center gap-1 w-fit"
                      >
                        <MdWarning className="size-3" />
                        Injury
                      </Badge>
                    )}
                  </div>
                </TableCell>
                <TableCell className="text-end">
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
                        onClick={() => onViewDetails(r)}
                        className="gap-2 cursor-pointer text-xs"
                      >
                        <MdVisibility className="size-4 text-primary" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onEdit(r)}
                        className="gap-2 cursor-pointer text-xs"
                      >
                        <MdEdit className="size-4 text-amber-500" />
                        Edit Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
