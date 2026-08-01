import { TableCell, TableRow } from "@/components/ui/table";
import type { StaffUser } from "../types/index";
import { RoleBadge } from "./RoleBadge";
import { StatusBadge } from "./StatusBadge";
import { UserActionsMenu } from "./UserActionsMenu";

interface UserTableRowProps {
  user: StaffUser;
}

export function UserTableRow({ user }: UserTableRowProps) {
  return (
    <TableRow className="border-border transition-colors hover:bg-muted/40">
      <TableCell className="font-semibold text-sm text-foreground py-3">
        {user.fullName}
      </TableCell>
      <TableCell className="text-sm text-muted-foreground py-3">
        {user.email}
      </TableCell>
      <TableCell className="py-3">
        <RoleBadge role={user.role} />
      </TableCell>
      <TableCell className="py-3">
        <StatusBadge isActive={user.isActive} />
      </TableCell>
      <TableCell className="py-3 text-start">
        <UserActionsMenu userId={user.id} isActive={user.isActive} />
      </TableCell>
    </TableRow>
  );
}
