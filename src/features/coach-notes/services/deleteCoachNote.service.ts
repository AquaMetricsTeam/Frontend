import { customFetch } from "@/services/customFetch";

export async function deleteCoachNote(
  noteId: number | string,
): Promise<ApiResponse<null>> {
  return customFetch<ApiResponse<null>>(`/coachnotes/${noteId}`, {
    method: "DELETE",
  });
}
