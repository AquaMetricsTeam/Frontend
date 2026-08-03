import { useTranslation } from "react-i18next";
import { MdMoreHoriz, MdEdit, MdDelete } from "react-icons/md";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import type { Exercise } from "../types/index";
import { EditExerciseModal } from "./EditExerciseModal";
import { DeleteExerciseDialog } from "./DeleteExerciseDialog";

interface ExerciseActionsMenuProps {
  exercise: Exercise;
  editOpen: boolean;
  deleteOpen: boolean;
  onEditOpenChange: (open: boolean) => void;
  onDeleteOpenChange: (open: boolean) => void;
}

export function ExerciseActionsMenu({
  exercise,
  editOpen,
  deleteOpen,
  onEditOpenChange,
  onDeleteOpenChange,
}: ExerciseActionsMenuProps) {
  const { t } = useTranslation("exercises");

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="h-8 w-8 p-0 cursor-pointer"
            />
          }
        >
          <MdMoreHoriz className="size-5" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-36 p-1">
          <DropdownMenuItem
            onClick={() => onEditOpenChange(true)}
            className="cursor-pointer gap-2"
          >
            <MdEdit className="size-4" />
            {t("exercises:actions.edit")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => onDeleteOpenChange(true)}
            className="text-destructive focus:bg-destructive/10 cursor-pointer gap-2"
          >
            <MdDelete className="size-4" />
            {t("exercises:actions.delete")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditExerciseModal
        exercise={exercise}
        open={editOpen}
        onOpenChange={onEditOpenChange}
      />

      <DeleteExerciseDialog
        exercise={exercise}
        open={deleteOpen}
        onOpenChange={onDeleteOpenChange}
      />
    </>
  );
}
