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
import { useExercisesLookup } from "@/features/lookups/hooks/useExercisesLookup";
import { calculatePlanDuration, type TrainingPlan } from "../../types/index";
import { cn } from "@/lib/utils";

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
  const { data: lookupRes } = useExercisesLookup();
  const exerciseLookup = lookupRes?.data ?? [];
  const exerciseMap = new Map(exerciseLookup.map((e) => [e.id, e.title]));
  const totalDuration = calculatePlanDuration(plan);

  return (
    <>
      <TableRow
        className={cn(
          "group cursor-pointer transition-colors",
          plan.isArchived
            ? "bg-muted/20 hover:bg-muted/40 opacity-80"
            : "hover:bg-muted/50"
        )}
        onClick={() => onView?.(plan)}
      >
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={cn(
                  "font-medium transition-colors",
                  plan.isArchived
                    ? "text-muted-foreground"
                    : "text-foreground group-hover:text-primary"
                )}
              >
                {plan.title}
              </span>
              {plan.isArchived && (
                <Badge
                  variant="outline"
                  className="gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0"
                >
                  <MdArchive className="size-3" />
                  {t("templates.filter.archived", { defaultValue: "Archived" })}
                </Badge>
              )}
            </div>
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
                  className={cn(
                    "text-[11px] font-normal shrink-0",
                    plan.isArchived
                      ? "bg-muted text-muted-foreground border-transparent"
                      : "bg-primary/10 text-primary border-primary/20"
                  )}
                >
                  {ex.exerciseName ||
                    exerciseMap.get(ex.exerciseId) ||
                    `Exercise #${ex.exerciseId}`}
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
            <MdTimer
              className={cn(
                "size-3.5",
                plan.isArchived ? "text-muted-foreground" : "text-primary"
              )}
            />
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
            <AlertDialogTitle>
              {t("templates.archive.confirmTitle", {
                defaultValue: "Archive Training Plan?",
              })}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {t("templates.archive.confirmDescription", {
                defaultValue:
                  "This plan will be hidden from active lists. You can restore it later.",
              })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              {t("common:actions.cancel", { defaultValue: "Cancel" })}
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => archiveMutation.mutate(plan.id)}>
              {t("templates.archive.confirmAction", {
                defaultValue: "Archive",
              })}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
