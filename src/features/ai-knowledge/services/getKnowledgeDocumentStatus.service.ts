import { customFetch } from "@/services/customFetch";
import type { KnowledgeDocumentResponse } from "../types/index";

/**
 * GET /knowledge-documents/{id} — Admin only.
 * Returns 200 with a RAW document object (NOT ApiResponse-wrapped). Used to poll
 * ingestion: indexStatus 1/4 → still processing; 2 → Indexed; 3 → Failed.
 */
export async function getKnowledgeDocumentStatus(
  id: number,
): Promise<KnowledgeDocumentResponse> {
  return customFetch<KnowledgeDocumentResponse>(`/knowledge-documents/${id}`);
}