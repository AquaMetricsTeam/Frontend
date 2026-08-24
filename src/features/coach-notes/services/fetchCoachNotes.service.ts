import { customFetch } from "@/services/customFetch";
import type {
  FetchCoachNotesParams,
  CoachNotesPaginatedResponse,
} from "../types/index";

export async function fetchCoachNotes(
  params: FetchCoachNotesParams,
): Promise<ApiResponse<CoachNotesPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.athleteId) query.set("athleteId", params.athleteId);
  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));

  const queryString = query.toString();
  const basePath = params.isMy ? "/coachnotes/my" : "/coachnotes";
  const endpoint = `${basePath}${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<CoachNotesPaginatedResponse>>(endpoint);
}
