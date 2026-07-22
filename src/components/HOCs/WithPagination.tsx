import type { ReactNode } from "react";
import Pagination from "@/components/common/Pagination";
import { cn } from "@/lib/utils";

type WithPaginationProps = {
  children: ReactNode;
  pageCount?: number;
  className?: string;
};

function WithPagination({
  pageCount,
  children,
  className,
}: WithPaginationProps) {
  return (
    <div className={cn("flex flex-col gap-7.5", className)}>
      {children}
      <Pagination pageCount={pageCount} />
    </div>
  );
}

export default WithPagination;
