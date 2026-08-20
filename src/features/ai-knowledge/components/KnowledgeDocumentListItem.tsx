import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdDelete } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { KnowledgeIndexStatus } from "../constants/enums";
import KnowledgeDocumentStatusBadge from "./KnowledgeDocumentStatusBadge";
import KnowledgeDocumentDomainBadge from "./KnowledgeDocumentDomainBadge";
import DeleteKnowledgeDocumentDialog from "./DeleteKnowledgeDocumentDialog";
import type { KnowledgeDocumentResponse } from "../types/index";

interface KnowledgeDocumentListItemProps {
  document: KnowledgeDocumentResponse;
}

export default function KnowledgeDocumentListItem({
  document,
}: KnowledgeDocumentListItemProps) {
  const { t, i18n } = useTranslation("aiKnowledge");
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isProcessing =
    document.indexStatus === KnowledgeIndexStatus.Processing;

  const uploadedDate = new Date(document.createdAt).toLocaleDateString(
    i18n.language,
  );

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted/50">
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <KnowledgeDocumentDomainBadge domainId={document.domainId} />
          <span className="truncate text-sm font-medium text-foreground">
            {document.title}
          </span>
        </div>
        <span className="text-xs text-muted-foreground">
          {t("list.uploadedAt", { date: uploadedDate })}
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-3">
        <KnowledgeDocumentStatusBadge status={document.indexStatus} />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsDeleteOpen(true)}
          disabled={isProcessing}
          aria-label={t("list.deleteDocument")}
          title={
            isProcessing
              ? t("list.deleteDisabledProcessing")
              : t("list.deleteDocument")
          }
          className="cursor-pointer text-muted-foreground hover:text-destructive"
        >
          <MdDelete className="size-4" />
        </Button>
      </div>

      <DeleteKnowledgeDocumentDialog
        document={document}
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
      />
    </div>
  );
}