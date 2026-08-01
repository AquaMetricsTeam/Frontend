import { customFetch } from "@/services/customFetch";
import type { FetchUsersParams, UsersPaginatedResponse } from "../types/index";

export async function fetchUsers(
  params: FetchUsersParams,
): Promise<ApiResponse<UsersPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.role) query.set("role", params.role);
  if (params.isActive !== undefined)
    query.set("isActive", String(params.isActive));
  if (params.sortBy) query.set("sortBy", params.sortBy);
  if (params.sortDirection) query.set("sortDirection", params.sortDirection);

  return customFetch<ApiResponse<UsersPaginatedResponse>>(
    `/Users/users?${query.toString()}`,
  );
}
