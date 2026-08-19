import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MdGroup } from "react-icons/md";
import type { Group } from "../types/index";
import { GroupActionsMenu } from "./GroupActionsMenu";

interface GroupTableRowProps {
  group: Group;
}

export function GroupTableRow({ group }: GroupTableRowProps) {
  const { t } = useTranslation("groups");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [membersOpen, setMembersOpen] = useState(false);

  return (
    <TableRow
      className="border-border transition-colors hover:bg-muted/40 cursor-pointer"
      onClick={() => setMembersOpen(true)}
    >
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            <MdGroup className="size-4 text-primary" />
          </div>
          <span className="font-semibold text-sm text-foreground">
            {group.name}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-sm text-muted-foreground py-3 max-w-xs truncate">
        {group.description || (
          <span className="italic text-muted-foreground/50">
            {t("groups:table.noDescription")}
          </span>
        )}
      </TableCell>

      <TableCell className="py-3">
        <Badge
          variant="secondary"
          className="rounded-full px-2.5 py-0.5 text-xs font-semibold text-primary bg-primary/10 border-primary/20"
        >
          {group.athleteCount} {t("groups:table.athletes")}
        </Badge>
      </TableCell>

      <TableCell className="py-3">
        {group.isArchived ? (
          <Badge
            variant="secondary"
            className="rounded-full bg-muted text-muted-foreground border-border text-xs"
          >
            {t("groups:status.archived")}
          </Badge>
        ) : (
          <Badge
            variant="secondary"
            className="rounded-full bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-xs"
          >
            {t("groups:status.active")}
          </Badge>
        )}
      </TableCell>

      <TableCell
        className="py-3 text-start"
        onClick={(e) => e.stopPropagation()}
      >
        <GroupActionsMenu
          group={group}
          editOpen={editOpen}
          deleteOpen={deleteOpen}
          membersOpen={membersOpen}
          onEditOpenChange={setEditOpen}
          onDeleteOpenChange={setDeleteOpen}
          onMembersOpenChange={setMembersOpen}
        />
      </TableCell>
    </TableRow>
  );
}
