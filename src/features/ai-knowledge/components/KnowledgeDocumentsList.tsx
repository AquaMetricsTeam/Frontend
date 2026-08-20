import { useSearchParams } from "react-router-dom";
import { useKnowledgeDocuments } from "../hooks/useKnowledgeDocuments";
import WithLoadingAndError from "@/components/HOCs/WithLoadingAndError";
import KnowledgeDocumentListItem from "./KnowledgeDocumentListItem";

export default function KnowledgeDocumentsList() {
  const [searchParams] = useSearchParams();

  const domainParam = Number(searchParams.get("domain"));
  const domainId = domainParam > 0 ? domainParam : undefined;

  const query = useKnowledgeDocuments({ domainId });

  const documents = query.data ?? [];

  return (
    <WithLoadingAndError
      isLoading={query.isLoading}
      isError={query.isError}
      hasNoData={!query.isLoading && !query.isError && documents.length === 0}
      noDataMessageProps={{
        messageKey: "aiKnowledge:list.noDocuments",
        descriptionKey: "aiKnowledge:list.noDocumentsDescription",
      }}
    >
      <div className="space-y-3">
        {documents.map((document) => (
          <KnowledgeDocumentListItem key={document.id} document={document} />
        ))}
      </div>
    </WithLoadingAndError>
  );
}