import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { Group } from "../types/index";
import { GroupTableRow } from "./GroupTableRow";

const COLUMNS = ["name", "description", "members", "status", "actions"] as const;

interface GroupsTableProps {
  groups: Group[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function GroupsTable({
  groups,
  isLoading,
  isError,
  onRetry,
}: GroupsTableProps) {
  const { t } = useTranslation("groups");

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
                {t(`groups:table.${col}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            hasNoData={!isLoading && !isError && groups.length === 0}
            skeletonProps={{ rows: 8, columns: 5 }}
            errorMessageProps={{ onRetry }}
          >
            {groups.map((group) => (
              <GroupTableRow key={group.id} group={group} />
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
