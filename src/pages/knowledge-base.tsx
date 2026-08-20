import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdUpload } from "react-icons/md";
import PageWrapper from "@/components/layouts/PageWrapper";
import Box from "@/components/layouts/Box";
import { Button } from "@/components/ui/button";
import KnowledgeDocumentsFilter from "@/features/ai-knowledge/components/KnowledgeDocumentsFilter";
import KnowledgeDocumentsList from "@/features/ai-knowledge/components/KnowledgeDocumentsList";
import UploadKnowledgeDocumentDialog from "@/features/ai-knowledge/components/UploadKnowledgeDocumentDialog";

export default function KnowledgeBasePage() {
  const { t } = useTranslation("aiKnowledge");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  return (
    <PageWrapper>
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-xl font-bold text-foreground">
          {t("page.title")}
        </h1>
        <p className="text-sm text-muted-foreground">
          {t("page.description")}
        </p>
      </div>

      <Box>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <KnowledgeDocumentsFilter />
          <Button
            onClick={() => setIsUploadOpen(true)}
            className="cursor-pointer gap-2"
          >
            <MdUpload className="size-4" />
            {t("page.uploadNew")}
          </Button>
        </div>

        <KnowledgeDocumentsList />
      </Box>

      <UploadKnowledgeDocumentDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
      />
    </PageWrapper>
  );
}