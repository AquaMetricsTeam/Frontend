// ─── Knowledge Document (list / status polling) ──────────────────────────────
// Shape returned by GET /knowledge-documents and GET /knowledge-documents/{id}
// as a RAW object (NOT wrapped in ApiResponse<T>).
export interface KnowledgeDocumentResponse {
  id: number;
  title: string;
  domainId: number;
  uploadedById: string;
  indexStatus: number;
  vectorRef: string | null;
  createdAt: string;
  updatedAt: string | null;
}

// 202 response of POST /knowledge-documents — identical shape minus `vectorRef`,
// which the upload endpoint does not return.
export type KnowledgeDocumentUploadResponse = Omit<
  KnowledgeDocumentResponse,
  "vectorRef"
>;

// ─── Request payloads ─────────────────────────────────────────────────────────
// Uploaded as multipart/form-data; the file is appended by the service.
export interface UploadKnowledgeDocumentRequest {
  file: File;
  title: string;
  domainId: number;
}

// ─── Fetch params ─────────────────────────────────────────────────────────────
export interface FetchKnowledgeDocumentsParams {
  domainId?: number;
}