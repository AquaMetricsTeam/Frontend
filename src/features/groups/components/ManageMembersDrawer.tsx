import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdPersonRemove, MdPeople, MdCalendarToday } from "react-icons/md";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGroupMembers } from "../hooks/useGroupMembers";
import { useRemoveAthlete } from "../hooks/useRemoveAthlete";
import { useAssignAthletes } from "../hooks/useAssignAthletes";
import { useAvailableAthletes } from "../hooks/useAvailableAthletes";
import { AthleteMultiSelect } from "./AthleteMultiSelect";
import type { Group } from "../types/index";

interface ManageMembersDrawerProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageMembersDrawer({
  group,
  open,
  onOpenChange,
}: ManageMembersDrawerProps) {
  const { t } = useTranslation("groups");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: membersData, isLoading: membersLoading } = useGroupMembers(
    group.id,
    open,
  );
  const { data: availableData } = useAvailableAthletes(open);
  const { mutate: remove, isPending: removing } = useRemoveAthlete(group.id);
  const { mutate: assign, isPending: assigning } = useAssignAthletes(
    group.id,
    () => setSelectedIds([]),
  );

  const members = membersData?.data ?? [];
  const available = availableData?.data ?? [];

  function handleAssign() {
    if (selectedIds.length === 0) return;
    assign({ athleteIds: selectedIds });
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} direction="right">
      <DrawerContent className="flex flex-col p-0 gap-0 inset-y-0 inset-e-0 inset-s-auto rounded-s-xl rounded-e-none max-w-lg w-full">
        {/* Header */}
        <DrawerHeader className="px-6 py-5 border-b border-border text-start pb-5">
          <div className="flex items-center gap-3">
            <div className="flex size-9 items-center justify-center rounded-xl bg-primary/10">
              <MdPeople className="size-5 text-primary" />
            </div>
            <div>
              <DrawerTitle className="text-base">{group.name}</DrawerTitle>
              <DrawerDescription className="text-xs text-start">
                {t("groups:drawer.subtitle")}
              </DrawerDescription>
            </div>
          </div>
        </DrawerHeader>

        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Current Members Section */}
          <div className="flex flex-col gap-3 overflow-hidden px-6 py-4 flex-1 min-h-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {t("groups:drawer.currentMembers")}
              </h3>
              <Badge
                variant="secondary"
                className="rounded-full text-xs bg-primary/10 text-primary border-primary/20"
              >
                {members.length}
              </Badge>
            </div>

            <div className="flex-1 overflow-y-auto rounded-xl border border-border divide-y divide-border min-h-0">
              {membersLoading ? (
                <div className="flex items-center justify-center py-10">
                  <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                </div>
              ) : members.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-10 text-center">
                  <MdPeople className="size-8 text-muted-foreground/40" />
                  <p className="text-sm text-muted-foreground">
                    {t("groups:drawer.noMembers")}
                  </p>
                </div>
              ) : (
                members.map((member) => (
                  <div
                    key={member.athleteId}
                    className="flex items-center gap-3 px-3 py-2.5 hover:bg-muted/30 transition-colors group"
                  >
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                      {member.fullName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-1 flex-col min-w-0">
                      <span className="text-sm font-medium text-foreground truncate">
                        {member.fullName}
                      </span>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MdCalendarToday className="size-3 shrink-0" />
                        {new Date(member.joinedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(member.athleteId)}
                      disabled={removing}
                      className="hidden group-hover:flex shrink-0 size-7 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
                      title={t("groups:drawer.removeMember")}
                    >
                      <MdPersonRemove className="size-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          <Separator />

          {/* Assign Athletes Section */}
          <div className="flex flex-col gap-3 px-6 py-4 shrink-0">
            <h3 className="text-sm font-semibold text-foreground">
              {t("groups:drawer.assignAthletes")}
            </h3>

            <AthleteMultiSelect
              athletes={available}
              selected={selectedIds}
              onSelectionChange={setSelectedIds}
            />

            <Button
              onClick={handleAssign}
              disabled={selectedIds.length === 0 || assigning}
              size="sm"
              className="self-end gap-1.5"
            >
              <MdPeople className="size-4" />
              {assigning
                ? t("groups:drawer.assigning")
                : t("groups:drawer.assignButton", {
                    count: selectedIds.length,
                  })}
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
