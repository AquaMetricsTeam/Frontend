import { useTranslation } from "react-i18next";
import { MdCheckCircle } from "react-icons/md";
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
import { useApproveAthleteRegistration } from "../hooks/useApproveAthleteRegistration";
import type { PendingAthlete } from "../types/index";

interface ApproveAthleteDialogProps {
  athlete: PendingAthlete | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApproved?: () => void;
}

export function ApproveAthleteDialog({
  athlete,
  open,
  onOpenChange,
  onApproved,
}: ApproveAthleteDialogProps) {
  const { t } = useTranslation("athletes");

  const { mutate: approve, isPending } = useApproveAthleteRegistration(() => {
    onOpenChange(false);
    onApproved?.();
  });

  if (!athlete) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <MdCheckCircle className="size-6" />
            </div>
            <div>
              <AlertDialogTitle>
                {t("registration.dialog.approveTitle")}
              </AlertDialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {athlete.fullName} ({athlete.email})
              </p>
            </div>
          </div>

          <AlertDialogDescription className="mt-2 text-sm">
            {t("registration.dialog.approveDescription", {
              name: athlete.fullName,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isPending}>
            {t("registration.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => approve(athlete.athleteId)}
            disabled={isPending}
            className="bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 cursor-pointer"
          >
            {isPending
              ? t("registration.dialog.approving")
              : t("registration.dialog.confirmApprove")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
