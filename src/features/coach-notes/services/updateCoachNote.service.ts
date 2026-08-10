import { customFetch } from "@/services/customFetch";
import type { UpdateCoachNotePayload, CoachNote } from "../types/index";

export async function updateCoachNote(
  payload: UpdateCoachNotePayload,
): Promise<ApiResponse<CoachNote>> {
  return customFetch<ApiResponse<CoachNote>>(`/coachnotes/${payload.noteId}`, {
    method: "PUT",
    body: JSON.stringify({ content: payload.content }),
  });
}
