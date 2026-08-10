import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  MdEdit,
  MdDelete,
  MdMoreVert,
  MdSchedule,
  MdPerson,
  MdFormatQuote,
} from "react-icons/md";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useDeleteCoachNote } from "../hooks/useDeleteCoachNote";
import type { CoachNote } from "../types/index";

interface CoachNoteCardProps {
  note: CoachNote;
  currentUserId?: string;
  athleteName?: string;
  onEdit?: (note: CoachNote) => void;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr);
    return new Intl.DateTimeFormat(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  } catch {
    return dateStr;
  }
}

export function CoachNoteCard({
  note,
  currentUserId,
  athleteName,
  onEdit,
}: CoachNoteCardProps) {
  const { t } = useTranslation("coachNotes");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Author check or fallback (author can edit/delete)
  const isAuthor =
    !currentUserId ||
    !note.authorId ||
    currentUserId.toLowerCase() === note.authorId.toLowerCase();

  const deleteMutation = useDeleteCoachNote(() => {
    setIsDeleteOpen(false);
  });

  function handleDeleteConfirm() {
    deleteMutation.mutate(note.id);
  }

  const isEdited = note.updatedAt && note.updatedAt !== note.createdAt;

  return (
    <>
      <div className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/80 backdrop-blur-xs p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 border-s-4 border-s-primary">
        {/* Quote icon watermark in background */}
        <MdFormatQuote className="absolute -bottom-2 -end-2 size-24 text-muted/30 pointer-events-none select-none" />

        <div className="relative z-10 space-y-3">
          {/* Top Bar: Athlete Badge (if available) + Date + Actions Menu */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              {athleteName ? (
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                  <MdPerson className="size-3.5" />
                  <span>{athleteName}</span>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <MdSchedule className="size-3.5 text-primary" />
                  <span>{formatDate(note.createdAt)}</span>
                </div>
              )}
            </div>

            {/* Actions Menu */}
            {isAuthor && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground cursor-pointer shrink-0"
                    />
                  }
                >
                  <MdMoreVert className="size-4" />
                  <span className="sr-only">{t("card.actions")}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    className="gap-2 text-xs font-medium cursor-pointer"
                    onClick={() => onEdit?.(note)}
                  >
                    <MdEdit className="size-4 text-primary" />
                    {t("card.edit")}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="gap-2 text-xs font-medium text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => setIsDeleteOpen(true)}
                  >
                    <MdDelete className="size-4" />
                    {t("card.delete")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Main Note Content */}
          <p className="text-sm font-normal text-foreground/90 whitespace-pre-wrap leading-relaxed">
            {note.content}
          </p>
        </div>

        {/* Footer Meta Row (Date if athleteName shown, plus edited indicator) */}
        <div className="relative z-10 pt-4 mt-2 border-t border-border/40 flex items-center justify-between text-[11px] text-muted-foreground">
          {athleteName && (
            <div className="flex items-center gap-1">
              <MdSchedule className="size-3.5 text-muted-foreground/70" />
              <span>{formatDate(note.createdAt)}</span>
            </div>
          )}

          {isEdited && (
            <span className="ms-auto italic text-muted-foreground/70">
              {t("card.edited")}
            </span>
          )}
        </div>
      </div>

      {/* Delete Confirmation Alert Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteDialog.description")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel disabled={deleteMutation.isPending}>
              {t("deleteDialog.cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground cursor-pointer"
              disabled={deleteMutation.isPending}
              onClick={handleDeleteConfirm}
            >
              {deleteMutation.isPending
                ? t("deleteDialog.deleting")
                : t("deleteDialog.confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
