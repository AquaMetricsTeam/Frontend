import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdAdd, MdStickyNote2, MdRefresh } from "react-icons/md";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CoachNoteCard } from "./CoachNoteCard";
import { CreateCoachNoteModal } from "./CreateCoachNoteModal";
import { EditCoachNoteModal } from "./EditCoachNoteModal";
import { useCoachNotes } from "../hooks/useCoachNotes";
import type { CoachNote, CoachNotesPaginatedResponse } from "../types/index";

interface AthleteNotesSheetProps {
  athlete: { id: string; fullName: string; email?: string } | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserId?: string;
}

export function AthleteNotesSheet({
  athlete,
  open,
  onOpenChange,
  currentUserId,
}: AthleteNotesSheetProps) {
  const { t } = useTranslation("coachNotes");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<CoachNote | null>(null);

  const athleteId = athlete?.id ?? "";

  const notesQuery = useCoachNotes(
    { athleteId, pageSize: 50 },
    !!athleteId && open,
  );

  const rawData = notesQuery.data as any;
  const responseData = (rawData?.data ?? rawData) as
    | CoachNotesPaginatedResponse
    | undefined;
  const notes = responseData?.items ?? [];
  const isLoading = notesQuery.isLoading;
  const isError = notesQuery.isError;

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="sm:max-w-md w-full flex flex-col h-full p-6 overflow-hidden">
          {/* Header */}
          <SheetHeader className="pb-4 border-b border-border space-y-1">
            <div className="flex items-center justify-between gap-2 me-6">
              <SheetTitle className="text-lg font-bold flex items-center gap-2">
                <MdStickyNote2 className="size-5 text-primary shrink-0" />
                <span>
                  {t("sheet.title", { name: athlete?.fullName || "" })}
                </span>
              </SheetTitle>
            </div>
            {athlete?.email && (
              <SheetDescription className="text-xs">
                {athlete.email}
              </SheetDescription>
            )}
          </SheetHeader>

          {/* Action bar */}
          <div className="py-3 border-b border-border/50 flex items-center justify-between gap-2 shrink-0">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("page.count_plural", { count: notes.length })}
            </span>
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs rounded-lg cursor-pointer"
              onClick={() => setIsCreateOpen(true)}
              disabled={!athleteId}
            >
              <MdAdd className="size-4" />
              {t("sheet.addQuickNote")}
            </Button>
          </div>

          {/* Notes list body */}
          <div className="flex-1 overflow-y-auto py-4 space-y-3.5 pe-1">
            {isLoading && (
              <div className="space-y-3">
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
                <Skeleton className="h-28 w-full rounded-xl" />
              </div>
            )}

            {isError && (
              <div className="flex flex-col items-center justify-center p-6 text-center rounded-xl border border-destructive/20 bg-destructive/5 space-y-2">
                <p className="text-xs font-medium text-destructive">
                  {t("toasts.fetchError", "Failed to load coach notes.")}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => notesQuery.refetch()}
                  className="h-8 text-xs gap-1.5"
                >
                  <MdRefresh className="size-3.5" />
                  Retry
                </Button>
              </div>
            )}

            {!isLoading && !isError && notes.length === 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl border border-dashed border-border bg-muted/20 my-4 space-y-2">
                <MdStickyNote2 className="size-10 text-muted-foreground/50" />
                <p className="text-sm font-semibold text-foreground">
                  {t("sheet.noNotesYet")}
                </p>
                <p className="text-xs text-muted-foreground">
                  {t("modal.createDescription")}
                </p>
                <Button
                  size="sm"
                  variant="outline"
                  className="mt-2 h-8 text-xs gap-1.5 cursor-pointer"
                  onClick={() => setIsCreateOpen(true)}
                >
                  <MdAdd className="size-3.5 text-primary" />
                  {t("sheet.addQuickNote")}
                </Button>
              </div>
            )}

            {!isLoading &&
              !isError &&
              notes.map((note: CoachNote) => (
                <CoachNoteCard
                  key={note.id}
                  note={note}
                  currentUserId={currentUserId}
                  onEdit={(n) => setEditingNote(n)}
                />
              ))}
          </div>
        </SheetContent>
      </Sheet>

      {/* Create note modal with fixed athlete */}
      <CreateCoachNoteModal
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        fixedAthleteId={athleteId}
        fixedAthleteName={athlete?.fullName}
      />

      {/* Edit note modal */}
      <EditCoachNoteModal
        open={!!editingNote}
        onOpenChange={(open) => {
          if (!open) setEditingNote(null);
        }}
        note={editingNote}
      />
    </>
  );
}
