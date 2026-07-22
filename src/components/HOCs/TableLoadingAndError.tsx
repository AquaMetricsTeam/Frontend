import type { ReactNode } from "react";
import {
  type SkeletonTableRowsProps,
  TableSkeletonRows,
} from "@/components/common/TableSkeletonRows";
import ErrorMessage, {
  type ErrorMessageProps,
} from "@/components/feedbacks/ErrorMessage";
import NoData, { type NoDataProps } from "@/components/feedbacks/NoData";
import { TableCell, TableRow } from "../ui/table";

interface TableLoadingAndErrorProps {
  isLoading?: boolean;
  isError?: boolean;
  hasNoData?: boolean;
  skeletonProps?: SkeletonTableRowsProps;
  errorMessageProps?: ErrorMessageProps;
  noDataMessageProps?: NoDataProps;
  children: ReactNode;
}

function TableLoadingAndError({
  isLoading,
  isError,
  hasNoData,
  skeletonProps,
  errorMessageProps,
  noDataMessageProps,
  children,
}: TableLoadingAndErrorProps) {
  if (isLoading) return <TableSkeletonRows {...skeletonProps} />;
  else if (isError)
    return (
      <TableRow>
        <TableCell colSpan={skeletonProps?.columns}>
          <ErrorMessage {...errorMessageProps} />
        </TableCell>
      </TableRow>
    );
  else if (hasNoData)
    return (
      <TableRow>
        <TableCell colSpan={skeletonProps?.columns}>
          <NoData {...noDataMessageProps} />
        </TableCell>
      </TableRow>
    );
  return children;
}

export default TableLoadingAndError;
