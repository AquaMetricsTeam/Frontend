import type { FetchKnowledgeDocumentsParams } from "../types/index";

export const KNOWLEDGE_KEYS = {
  all: ["knowledge-documents"] as const,

  // Documents
  documents: () => [...KNOWLEDGE_KEYS.all, "documents"] as const,
  documentList: (params?: FetchKnowledgeDocumentsParams) =>
    [...KNOWLEDGE_KEYS.documents(), "list", params] as const,
  documentDetail: (id: number) =>
    [...KNOWLEDGE_KEYS.documents(), "detail", id] as const,
};