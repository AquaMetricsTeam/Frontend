import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { useArchiveSwimmingPerformance } from "../hooks/useArchiveSwimmingPerformance";
import { useRestoreSwimmingPerformance } from "../hooks/useRestoreSwimmingPerformance";
import type { SwimmingPerformance } from "../types";

interface ArchiveSwimmingPerformanceDialogProps {
  performance: SwimmingPerformance | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isArchivedView?: boolean;
}

export function ArchiveSwimmingPerformanceDialog({
  performance,
  open,
  onOpenChange,
  isArchivedView = false,
}: ArchiveSwimmingPerformanceDialogProps) {
  const { t } = useTranslation("swimming");
  const archiveMutation = useArchiveSwimmingPerformance();
  const restoreMutation = useRestoreSwimmingPerformance();

  if (!performance) return null;

  const isArchived = isArchivedView || !!performance.isArchived;

  function handleConfirm() {
    if (!performance) return;

    if (isArchived) {
      restoreMutation.mutate(performance.id, {
        onSuccess: () => onOpenChange(false),
      });
    } else {
      archiveMutation.mutate(performance.id, {
        onSuccess: () => onOpenChange(false),
      });
    }
  }

  const isPending = archiveMutation.isPending || restoreMutation.isPending;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-base font-bold text-foreground">
            {isArchived ? t("table.restore") : t("table.archive")} Performance Log
          </AlertDialogTitle>
          <AlertDialogDescription className="text-xs text-muted-foreground">
            {isArchived
              ? `Are you sure you want to restore swimming performance #${performance.id}? It will be visible in the active performance log.`
              : `Are you sure you want to archive swimming performance #${performance.id}? It can be restored later.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={isPending}
            className="h-8 text-xs cursor-pointer"
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={isPending}
            className={
              isArchived
                ? "h-8 text-xs bg-emerald-600 hover:bg-emerald-700 cursor-pointer"
                : "h-8 text-xs bg-rose-600 hover:bg-rose-700 cursor-pointer"
            }
          >
            {isPending
              ? "Processing..."
              : isArchived
                ? t("table.restore")
                : t("table.archive")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
