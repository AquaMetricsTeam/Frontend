import { customFetch } from "@/services/customFetch";
import type { CreateCoachNotePayload, CoachNote } from "../types/index";

export async function createCoachNote(
  payload: CreateCoachNotePayload,
): Promise<ApiResponse<CoachNote>> {
  return customFetch<ApiResponse<CoachNote>>("/coachnotes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
