import { useState } from "react";
import {
  MdMoreVert,
  MdEdit,
  MdAssignment,
  MdArchive,
  MdUnarchive,
  MdTimer,
  MdFitnessCenter,
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
}

export function TemplateTableRow({
  plan,
  onAssign,
  onEdit,
}: TemplateTableRowProps) {
  const [confirmArchive, setConfirmArchive] = useState(false);
  const archiveMutation = useArchiveTrainingPlan();
  const restoreMutation = useRestoreTrainingPlan();
  const totalDuration = calculatePlanDuration(plan);

  return (
    <>
      <TableRow className="group">
        <TableCell>
          <div className="flex flex-col gap-0.5">
            <span className="font-medium text-foreground">{plan.title}</span>
            {plan.description && (
              <span className="text-xs text-muted-foreground line-clamp-1">
                {plan.description}
              </span>
            )}
          </div>
        </TableCell>

        <TableCell>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MdFitnessCenter className="size-3.5" />
              {plan.planExercises?.length ?? 0} ex.
            </span>
            <span className="flex items-center gap-1">
              <MdTimer className="size-3.5" />
              ~{totalDuration} min
            </span>
          </div>
        </TableCell>

        <TableCell>
          {plan.isArchived ? (
            <Badge variant="secondary" className="text-xs">
              Archived
            </Badge>
          ) : (
            <Badge
              variant="secondary"
              className="text-xs bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              Active
            </Badge>
          )}
        </TableCell>

        <TableCell className="text-end">
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
              {!plan.isArchived && (
                <>
                  <DropdownMenuItem onClick={() => onEdit(plan)}>
                    <MdEdit className="size-4 me-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onAssign(plan)}>
                    <MdAssignment className="size-4 me-2" />
                    Assign
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => setConfirmArchive(true)}
                    className="text-destructive focus:text-destructive"
                  >
                    <MdArchive className="size-4 me-2" />
                    Archive
                  </DropdownMenuItem>
                </>
              )}
              {plan.isArchived && (
                <DropdownMenuItem onClick={() => restoreMutation.mutate(plan.id)}>
                  <MdUnarchive className="size-4 me-2" />
                  Restore
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
