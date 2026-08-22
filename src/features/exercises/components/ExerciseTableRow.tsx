import { useState } from "react";
import { useTranslation } from "react-i18next";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Exercise } from "../types/index";
import { MUSCLE_GROUP_META, getMuscleGroupLabel } from "../constants/muscleGroups";
import { SWIMMING_CATEGORY_META, getSwimmingCategoryLabel } from "../constants/swimmingCategories";
import { ExerciseActionsMenu } from "./ExerciseActionsMenu";

interface ExerciseTableRowProps {
  exercise: Exercise;
}

export function ExerciseTableRow({ exercise }: ExerciseTableRowProps) {
  const { t } = useTranslation("exercises");
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const muscleMeta = exercise.muscleGroup != null ? MUSCLE_GROUP_META[exercise.muscleGroup] : null;
  const swimMeta = exercise.category != null ? SWIMMING_CATEGORY_META[exercise.category] : null;
  const categoryMeta = muscleMeta ?? swimMeta;

  const categoryLabel =
    exercise.muscleGroup != null
      ? getMuscleGroupLabel(exercise.muscleGroup, t)
      : exercise.category != null
        ? getSwimmingCategoryLabel(exercise.category, t)
        : null;


  return (
    <TableRow className="border-border transition-colors hover:bg-muted/40">
      <TableCell className="py-3">
        <div className="flex items-center gap-3">
          {categoryMeta && (
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-lg"
              style={{ background: `color-mix(in oklch, ${categoryMeta.colorVar} 15%, transparent)` }}
            >
              <categoryMeta.Icon
                className="size-4"
                style={{ color: categoryMeta.colorVar }}
                strokeWidth={1.75}
              />
            </span>
          )}
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

      <TableCell className="py-3">
        {categoryMeta ? (
          <Badge
            variant="secondary"
            className="text-xs font-medium gap-1.5"
            style={{
              background: `color-mix(in oklch, ${categoryMeta.colorVar} 12%, transparent)`,
              color: categoryMeta.colorVar,
              borderColor: `color-mix(in oklch, ${categoryMeta.colorVar} 25%, transparent)`,
            }}
          >
            <categoryMeta.Icon className="size-3" strokeWidth={2} />
            {categoryLabel}
          </Badge>
        ) : (
          <span className="italic text-muted-foreground/50 text-sm">—</span>
        )}
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
