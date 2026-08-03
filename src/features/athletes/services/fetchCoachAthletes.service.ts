import { customFetch } from "@/services/customFetch";
import type { FetchAthletesParams, CoachAthletesPaginatedResponse } from "../types/index";

export async function fetchCoachAthletes(
  params: FetchAthletesParams,
): Promise<ApiResponse<CoachAthletesPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);

  return customFetch<ApiResponse<CoachAthletesPaginatedResponse>>(
    `/athletes?${query.toString()}`,
  );
}
