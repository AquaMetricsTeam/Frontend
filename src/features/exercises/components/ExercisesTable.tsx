import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { Exercise } from "../types/index";
import { ExerciseTableRow } from "./ExerciseTableRow";

const COLUMNS = ["title", "description", "category", "actions"] as const;

interface ExercisesTableProps {
  exercises: Exercise[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function ExercisesTable({
  exercises,
  isLoading,
  isError,
  onRetry,
}: ExercisesTableProps) {
  const { t } = useTranslation("exercises");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            {COLUMNS.map((col) => (
              <TableHead
                key={col}
                className="h-10 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
              >
                {t(`exercises:table.${col}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            hasNoData={!isLoading && !isError && exercises.length === 0}
            skeletonProps={{ rows: 8, columns: 4 }}
            errorMessageProps={{ onRetry }}
          >
            {exercises.map((exercise) => (
              <ExerciseTableRow key={exercise.id} exercise={exercise} />
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
