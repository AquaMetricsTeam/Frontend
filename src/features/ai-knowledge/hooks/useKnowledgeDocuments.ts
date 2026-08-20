import { useQuery } from "@tanstack/react-query";
import { listKnowledgeDocuments } from "../services/listKnowledgeDocuments.service";
import { KNOWLEDGE_KEYS } from "../constants/queryKeys";
import { KnowledgeIndexStatus } from "../constants/enums";
import type {
  FetchKnowledgeDocumentsParams,
  KnowledgeDocumentResponse,
} from "../types/index";

// Contract (§3.8): poll every few seconds while indexStatus is Pending (1) or
// Processing (4); stop when Indexed (2) or Failed (3).
const POLL_INTERVAL_MS = 3000;

function hasActiveProcessing(
  data: KnowledgeDocumentResponse[] | undefined,
): boolean {
  return (
    data?.some(
      (doc) =>
        doc.indexStatus === KnowledgeIndexStatus.Pending ||
        doc.indexStatus === KnowledgeIndexStatus.Processing,
    ) ?? false
  );
}

export function useKnowledgeDocuments(
  params: FetchKnowledgeDocumentsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: KNOWLEDGE_KEYS.documentList(params),
    queryFn: () => listKnowledgeDocuments(params),
    enabled,
    refetchInterval: (query) =>
      hasActiveProcessing(query.state.data as
        | KnowledgeDocumentResponse[]
        | undefined)
        ? POLL_INTERVAL_MS
        : false,
  });
}