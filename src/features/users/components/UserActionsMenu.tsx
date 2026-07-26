import { MdMoreHoriz } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useUpdateUserStatus } from "../hooks/useUpdateUserStatus";

interface UserActionsMenuProps {
  userId: string;
  isActive: boolean;
}

export function UserActionsMenu({ userId, isActive }: UserActionsMenuProps) {
  const { mutate: updateStatus, isPending } = useUpdateUserStatus();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" className="h-8 w-8 p-0 cursor-pointer" />}>
        <MdMoreHoriz className="size-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-36 p-1">
        {isActive ? (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => updateStatus({ userId, payload: { isActive: false } })}
            className="text-destructive focus:bg-destructive/10 cursor-pointer"
          >
            Deactivate
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            disabled={isPending}
            onClick={() => updateStatus({ userId, payload: { isActive: true } })}
            className="text-emerald-600 focus:bg-emerald-500/10 cursor-pointer"
          >
            Activate
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
