import { useTranslation } from "react-i18next";
import { MdWarningAmber } from "react-icons/md";
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
import { useRejectAthleteRegistration } from "../hooks/useRejectAthleteRegistration";
import type { PendingAthlete } from "../types/index";

interface RejectAthleteDialogProps {
  athlete: PendingAthlete | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onRejected?: () => void;
}

export function RejectAthleteDialog({
  athlete,
  open,
  onOpenChange,
  onRejected,
}: RejectAthleteDialogProps) {
  const { t } = useTranslation("athletes");

  const { mutate: reject, isPending } = useRejectAthleteRegistration(() => {
    onOpenChange(false);
    onRejected?.();
  });

  if (!athlete) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="sm:max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
              <MdWarningAmber className="size-6" />
            </div>
            <div>
              <AlertDialogTitle>
                {t("registration.dialog.rejectTitle")}
              </AlertDialogTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                {athlete.fullName} ({athlete.email})
              </p>
            </div>
          </div>

          <AlertDialogDescription className="mt-2 text-sm">
            {t("registration.dialog.rejectDescription", {
              name: athlete.fullName,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isPending}>
            {t("registration.dialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => reject(athlete.athleteId)}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90 cursor-pointer"
          >
            {isPending
              ? t("registration.dialog.rejecting")
              : t("registration.dialog.confirmReject")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
