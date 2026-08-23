import { useQuery } from "@tanstack/react-query";
import { fetchGroups } from "../services/fetchGroups.service";
import { GROUP_KEYS } from "../constants/queryKeys";
import type { FetchGroupsParams } from "../types/index";

export function useGroups(params: FetchGroupsParams) {
  const {
    pageNumber = 1,
    pageSize = 10,
    search,
    includeArchived,
    onlyArchived,
  } = params;

  return useQuery({
    queryKey: GROUP_KEYS.list({
      pageNumber,
      pageSize,
      search,
      includeArchived,
      onlyArchived,
    }),
    queryFn: () =>
      fetchGroups({
        pageNumber,
        pageSize,
        search,
        includeArchived,
        onlyArchived,
      }),
    staleTime: 0,
    gcTime: 0,
  });
}
