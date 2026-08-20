import { customFetch } from "@/services/customFetch";

/**
 * DELETE /knowledge-documents/{id} — Admin only.
 * Returns 204 No Content (empty body). isJsonResponse=false is required because
 * customFetch would otherwise try to JSON-parse the empty 204 body.
 */
export async function deleteKnowledgeDocument(id: number): Promise<void> {
  await customFetch<unknown>(`/knowledge-documents/${id}`, {
    method: "DELETE",
  }, false);
}