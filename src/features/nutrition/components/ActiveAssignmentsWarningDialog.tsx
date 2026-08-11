import { useTranslation } from "react-i18next";
import { MdWarning } from "react-icons/md";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

interface ActiveAssignmentsWarningDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeAssignmentCount: number;
  action: "edit" | "delete";
  onConfirm: () => void;
  isLoading?: boolean;
}

export function ActiveAssignmentsWarningDialog({
  open,
  onOpenChange,
  activeAssignmentCount,
  action,
  onConfirm,
  isLoading = false,
}: ActiveAssignmentsWarningDialogProps) {
  const { t } = useTranslation("nutrition");

  const isDelete = action === "delete";

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        {/* Header with Icon */}
        <AlertDialogHeader>
          <div className="flex items-start gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-amber-500/20 flex-shrink-0 mt-0.5">
              <MdWarning className="size-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1">
              <AlertDialogTitle className="text-base font-semibold">
                {isDelete
                  ? t("modal.warningDialog.deleteTitle")
                  : t("modal.warningDialog.editTitle")}
              </AlertDialogTitle>
            </div>
          </div>
        </AlertDialogHeader>

        {/* Description */}
<AlertDialogDescription className="text-sm leading-relaxed">
  <span className="block">
    {t("modal.warningDialog.warningMessage", {
      count: activeAssignmentCount,
      interpolation: { escapeValue: false },
    })}
  </span>

  <span className="block mt-3 text-xs text-muted-foreground">
    {isDelete
      ? t("modal.warningDialog.deleteWarning")
      : t("modal.warningDialog.editWarning")}
  </span>
</AlertDialogDescription>

        {/* Footer */}
        <AlertDialogFooter className="gap-2 sm:gap-0">
          <AlertDialogCancel disabled={isLoading}>
            {t("common:cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={isLoading}
            className={isDelete ? "bg-destructive hover:bg-destructive/90" : ""}
          >
            {isLoading ? (
              <>
                <span className="animate-spin inline-block me-2">⏳</span>
                {t("common:processing")}
              </>
            ) : isDelete ? (
              t("common:delete")
            ) : (
              t("common:save")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
