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
import { useDeleteKnowledgeDocument } from "../hooks/useDeleteKnowledgeDocument";
import type { KnowledgeDocumentResponse } from "../types/index";

interface DeleteKnowledgeDocumentDialogProps {
  document: KnowledgeDocumentResponse | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function DeleteKnowledgeDocumentDialog({
  document,
  open,
  onOpenChange,
}: DeleteKnowledgeDocumentDialogProps) {
  const { t } = useTranslation("aiKnowledge");
  const { mutate: del, isPending } = useDeleteKnowledgeDocument(() =>
    onOpenChange(false),
  );

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("delete.description", { title: document?.title ?? "" })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>
            {t("delete.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => document && del(document.id)}
            disabled={isPending || !document}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? t("delete.deleting") : t("delete.confirm")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}