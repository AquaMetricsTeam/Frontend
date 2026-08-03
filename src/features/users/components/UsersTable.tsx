import { useTranslation } from "react-i18next";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import TableLoadingAndError from "@/components/HOCs/TableLoadingAndError";
import type { StaffUser } from "../types/index";
import { UserTableRow } from "./UserTableRow";

const TABLE_HEADER_KEYS = ["name", "email", "role", "status", "actions"] as const;

interface UsersTableProps {
  users: StaffUser[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
}

export function UsersTable({
  users,
  isLoading,
  isError,
  onRetry,
}: UsersTableProps) {
  const { t } = useTranslation("users");

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent border-border">
            {TABLE_HEADER_KEYS.map((key) => (
              <TableHead
                key={key}
                className="h-10 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground"
              >
                {t(`users:table.${key}`)}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableLoadingAndError
            isLoading={isLoading}
            isError={isError}
            hasNoData={!isLoading && !isError && users.length === 0}
            skeletonProps={{ rows: 8, columns: 5 }}
            errorMessageProps={{ onRetry }}
          >
            {users.map((user) => (
              <UserTableRow key={user.id} user={user} />
            ))}
          </TableLoadingAndError>
        </TableBody>
      </Table>
    </div>
  );
}
