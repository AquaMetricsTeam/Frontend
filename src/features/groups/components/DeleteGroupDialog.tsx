import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useDeleteGroup } from "../hooks/useDeleteGroup";
import type { Group } from "../types/index";

interface DeleteGroupDialogProps {
  group: Group;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGroupDialog({
  group,
  open,
  onOpenChange,
}: DeleteGroupDialogProps) {
  const { t } = useTranslation("groups");
  const { mutate: del, isPending } = useDeleteGroup(() =>
    onOpenChange(false),
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("groups:deleteDialog.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("groups:deleteDialog.description", { name: group.name })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("groups:deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => del(group.id)}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending
              ? t("groups:deleteDialog.deleting")
              : t("groups:deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
