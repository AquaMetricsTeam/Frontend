import { customFetch } from "@/services/customFetch";
import type {
  FetchGroupsParams,
  GroupsPaginatedResponse,
} from "../types/index";

export async function fetchGroups(
  params: FetchGroupsParams,
): Promise<ApiResponse<GroupsPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("PageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.includeArchived)
    query.set("includeArchived", String(params.includeArchived));
  if (params.onlyArchived)
    query.set("onlyArchived", String(params.onlyArchived));

  return customFetch<ApiResponse<GroupsPaginatedResponse>>(
    `/groups?${query.toString()}`,
  );
}
