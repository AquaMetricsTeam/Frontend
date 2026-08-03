import { customFetch } from "@/services/customFetch";
import type { FetchAthletesParams, AdminAthletesPaginatedResponse } from "../types/index";

export async function fetchAdminAthletes(
  params: FetchAthletesParams,
): Promise<ApiResponse<AdminAthletesPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);

  return customFetch<ApiResponse<AdminAthletesPaginatedResponse>>(
    `/users/athletes?${query.toString()}`,
  );
}
