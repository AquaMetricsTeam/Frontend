import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export interface SkeletonTableRowsProps {
  rows?: number;
  columns?: number;
  columnWidths?: string[];
}

export function TableSkeletonRows({
  rows = 15,
  columns = 6,
  columnWidths = [
    "w-[30px]",
    "w-[80px]",
    "w-[80px]",
    "w-[80px]",
    "w-[80px]",
    "w-[100px]",
  ],
}: SkeletonTableRowsProps) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <TableRow key={`skeleton-row-${rowIndex}`}>
          {Array.from({ length: columns }).map((_, colIndex) => (
            <TableCell key={`skeleton-cell-${rowIndex}-${colIndex}`}>
              <Skeleton
                className={`h-4 ${columnWidths[colIndex] || "w-[100px]"}`}
              />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}
