import { useTranslation } from "react-i18next";
import { MdMoreHoriz, MdEdit, MdDelete, MdPeople } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Group } from "../types/index";
import { EditGroupModal } from "./EditGroupModal";
import { DeleteGroupDialog } from "./DeleteGroupDialog";
import { ManageMembersDrawer } from "./ManageMembersDrawer";

interface GroupActionsMenuProps {
  group: Group;
  editOpen: boolean;
  deleteOpen: boolean;
  membersOpen: boolean;
  onEditOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
  onMembersOpenChange: (open: boolean) => void;
}

export function GroupActionsMenu({
  group,
  editOpen,
  deleteOpen,
  membersOpen,
  onEditOpenChange,
  onDeleteOpenChange,
  onMembersOpenChange,
}: GroupActionsMenuProps) {
  const { t } = useTranslation("groups");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 p-0 cursor-pointer"
            />
          }
        >
          <MdMoreHoriz className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-44 p-1">
          <DropdownMenuItem
            onClick={() => onMembersOpenChange(true)}
            className="cursor-pointer gap-2"
          >
            <MdPeople className="size-4 text-primary" />
            {t("groups:actions.manageMembers")}
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => onEditOpenChange(true)}
            className="cursor-pointer gap-2"
          >
            <MdEdit className="size-4" />
            {t("groups:actions.edit")}
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => onDeleteOpenChange(true)}
            className="text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
          >
            <MdDelete className="size-4" />
            {t("groups:actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditGroupModal
        group={group}
        open={editOpen}
        onOpenChange={onEditOpenChange}
      />

      <DeleteGroupDialog
        group={group}
        open={deleteOpen}
        onOpenChange={onDeleteOpenChange}
      />

      <ManageMembersDrawer
        group={group}
        open={membersOpen}
        onOpenChange={onMembersOpenChange}
      />
    </>
  );
}
