import { customFetch } from "@/services/customFetch";
import type { FetchSessionsParams, SessionsPaginatedResponse } from "../types/index";

export async function fetchTrainingSessions(
  params: FetchSessionsParams,
): Promise<ApiResponse<SessionsPaginatedResponse>> {
  const query = new URLSearchParams();
  if (params.pageNumber !== undefined) query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
  return customFetch<ApiResponse<SessionsPaginatedResponse>>(
    `/training-sessions?${query.toString()}`,
  );
}
