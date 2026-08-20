import { customFetch } from "@/services/customFetch";
import { generateIdempotencyKey } from "@/lib/utils";
import type {
  KnowledgeDocumentUploadResponse,
  UploadKnowledgeDocumentRequest,
} from "../types/index";

/**
 * POST /knowledge-documents (multipart/form-data) — Admin only.
 * Returns 202 Accepted with a RAW document object (NOT ApiResponse-wrapped).
 *
 * A fresh idempotency key is generated per call because customFetch's payload
 * hash ignores FormData bodies (hashes to ""), so two different uploads within
 * the TTL would otherwise reuse the same key.
 */
export async function uploadKnowledgeDocument({
  file,
  title,
  domainId,
}: UploadKnowledgeDocumentRequest): Promise<KnowledgeDocumentUploadResponse> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("domainId", String(domainId));

  return customFetch<KnowledgeDocumentUploadResponse>("/knowledge-documents", {
    method: "POST",
    body: formData,
    idempotencyKey: generateIdempotencyKey(),
    timeoutMs: 120_000,
  });
}