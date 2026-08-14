import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdMoreVert,
  MdEdit,
  MdAssignment,
  MdArchive,
  MdUnarchive,
  MdTimer,
  MdVisibility,
} from "react-icons/md";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useArchiveTrainingPlan } from "../../hooks/useArchiveTrainingPlan";
import { useRestoreTrainingPlan } from "../../hooks/useRestoreTrainingPlan";
import { calculatePlanDuration, type TrainingPlan } from "../../types/index";

interface TemplateTableRowProps {
  plan: TrainingPlan;
  onAssign: (plan: TrainingPlan) => void;
  onEdit: (plan: TrainingPlan) => void;
  onView?: (plan: TrainingPlan) => void;
}

export function TemplateTableRow({
  plan,
  onAssign,
  onEdit,
  onView,
}: TemplateTableRowProps) {
  const { t } = useTranslation("training");
  const [confirmArchive, setConfirmArchive] = useState(false);
  const archiveMutation = useArchiveTrainingPlan();
  const restoreMutation = useRestoreTrainingPlan();
  const totalDuration = calculatePlanDuration(plan);

  return (
    <>
      <TableRow
        className="group cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => onView?.(plan)}
      >
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground group-hover:text-primary transition-colors">
              {plan.title}
            </span>
            {plan.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {plan.description}
              </span>
            )}
          </div>
        </TableCell>

        <TableCell>
          {plan.planExercises && plan.planExercises.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 max-w-xs">
              {plan.planExercises.slice(0, 2).map((ex, idx) => (
                <Badge
                  key={ex.id ?? idx}
                  variant="secondary"
                  className="text-[11px] font-normal bg-primary/10 text-primary border-primary/20 shrink-0"
                >
                  {ex.exerciseName || `Exercise #${ex.exerciseId}`}
                </Badge>
              ))}
              {plan.planExercises.length > 2 && (
                <span className="text-xs text-muted-foreground font-medium">
                  +{plan.planExercises.length - 2} more
                </span>
              )}
            </div>
          ) : (
            <span className="text-xs text-muted-foreground font-normal">
              No exercises
            </span>
          )}
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <MdTimer className="size-3.5 text-primary" />
            <span>~{totalDuration} min</span>
          </div>
        </TableCell>

        <TableCell className="text-end" onClick={(e) => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                />
              }
            >
              <MdMoreVert className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onView?.(plan)}>
                <MdVisibility className="size-4 me-2" />
                {t("templates.actions.view", { defaultValue: "View Details" })}
              </DropdownMenuItem>
              {!plan.isArchived && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(plan)}>
                    <MdEdit className="size-4 me-2" />
                    {t("templates.actions.edit", { defaultValue: "Edit" })}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAssign(plan)}>
                    <MdAssignment className="size-4 me-2" />
                    {t("templates.actions.assign", { defaultValue: "Assign" })}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setConfirmArchive(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <MdArchive className="size-4 me-2" />
                    {t("templates.actions.archive", { defaultValue: "Archive" })}
                  </DropdownMenuItem>
                </>
              )}
              {plan.isArchived && (
                <DropdownMenuItem onClick={() => restoreMutation.mutate(plan.id)}>
                  <MdUnarchive className="size-4 me-2" />
                  {t("templates.actions.restore", { defaultValue: "Restore" })}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      <AlertDialog open={confirmArchive} onOpenChange={setConfirmArchive}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Training Plan?</AlertDialogTitle>
            <AlertDialogDescription>
              This plan will be hidden from active lists. You can restore it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => archiveMutation.mutate(plan.id)}>
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
