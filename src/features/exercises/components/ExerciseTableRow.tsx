import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { MdFitnessCenter } from "react-icons/md";
import type { Exercise } from "../types/index";
import { ExerciseActionsMenu } from "./ExerciseActionsMenu";

interface ExerciseTableRowProps {
  exercise: Exercise;
}

export function ExerciseTableRow({ exercise }: ExerciseTableRowProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  return (
    <TableRow className="border-border transition-colors hover:bg-muted/40">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-secondary/20">
            <MdFitnessCenter className="size-4 text-secondary-foreground" />
          </div>
          <span className="font-semibold text-sm text-foreground">
            {exercise.title}
          </span>
        </div>
      </TableCell>

      <TableCell className="text-sm text-muted-foreground py-3 max-w-[180px]">
        {exercise.description ? (
          <span className="line-clamp-2">{exercise.description}</span>
        ) : (
          <span className="italic text-muted-foreground/50">—</span>
        )}
      </TableCell>


      <TableCell className="text-sm text-muted-foreground py-3 whitespace-nowrap">
        {new Date(exercise.createdAt).toLocaleDateString()}
      </TableCell>

      <TableCell className="py-3 text-start">
        <ExerciseActionsMenu
          exercise={exercise}
          editOpen={editOpen}
          deleteOpen={deleteOpen}
          onEditOpenChange={setEditOpen}
          onDeleteOpenChange={setDeleteOpen}
        />
      </TableCell>
    </TableRow>
  );
}
