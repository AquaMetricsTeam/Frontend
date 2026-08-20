import { customFetch } from "@/services/customFetch";
import type {
  FetchKnowledgeDocumentsParams,
  KnowledgeDocumentResponse,
} from "../types/index";

/**
 * GET /knowledge-documents — Admin only.
 * Returns 200 with a RAW array (NOT ApiResponse-wrapped, NOT paginated),
 * newest first. `domainId` is only sent when > 0, matching the contract.
 */
export async function listKnowledgeDocuments(
  params: FetchKnowledgeDocumentsParams = {},
): Promise<KnowledgeDocumentResponse[]> {
  const query = new URLSearchParams();

  if (params.domainId !== undefined && params.domainId > 0) {
    query.set("domainId", String(params.domainId));
  }

  const queryString = query.toString();
  const endpoint = `/knowledge-documents${queryString ? `?${queryString}` : ""}`;

  return customFetch<KnowledgeDocumentResponse[]>(endpoint);
}