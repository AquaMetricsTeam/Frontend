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
import { useDeleteExercise } from "../hooks/useDeleteExercise";
import type { Exercise } from "../types/index";

interface DeleteExerciseDialogProps {
  exercise: Exercise;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteExerciseDialog({
  exercise,
  open,
  onOpenChange,
}: DeleteExerciseDialogProps) {
  const { t } = useTranslation("exercises");
  const { mutate: del, isPending } = useDeleteExercise(() =>
    onOpenChange(false),
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t("exercises:deleteDialog.title")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("exercises:deleteDialog.description", {
              title: exercise.title,
            })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("exercises:deleteDialog.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => del(exercise.id)}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending
              ? t("exercises:deleteDialog.deleting")
              : t("exercises:deleteDialog.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
