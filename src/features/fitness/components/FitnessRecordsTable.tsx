import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { TrainingRecordResponse } from "@/features/training-record/types";
import { cn } from "@/lib/utils";

interface FitnessRecordsTableProps {
  records: TrainingRecordResponse[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

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

export function FitnessRecordsTable({
  records,
  isLoading,
  isError,
  onRetry,
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
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            columnCount={6}
            rowCount={5}
            onRetry={onRetry}
            isEmpty={records.length === 0}
            emptyTitle="No fitness records yet"
            emptyDescription="Log a fitness session to start tracking performance"
          >
            {records.map((r) => (
              <TableRow key={r.id} className="hover:bg-muted/30 transition-colors">
                <TableCell>
                  <span className="text-sm font-semibold text-foreground">
                    {r.athleteName}
                  </span>
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
                        "text-[10px] font-semibold",
                        r.sessionCompleted
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20",
                      )}
                    >
                      {r.sessionCompleted ? "Completed" : "Partial"}
                    </Badge>
                    {r.injuryOccurred && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-semibold bg-rose-500/10 text-rose-600 border-rose-500/20"
                      >
                        Injury
                      </Badge>
                    )}
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
