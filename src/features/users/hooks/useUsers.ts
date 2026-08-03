import { useQuery } from "@tanstack/react-query";
import { fetchUsers } from "../services/fetchUsers.service";
import { USER_KEYS } from "../constants/queryKeys";
import type { FetchUsersParams } from "../types/index";

const PAGE_SIZE = 10;

export function useUsers(params: FetchUsersParams) {
  const { pageNumber = 1, pageSize = PAGE_SIZE, search, role, isActive } =
    params;

  return useQuery({
    queryKey: USER_KEYS.list({ pageNumber, pageSize, search, role, isActive }),
    queryFn: () =>
      fetchUsers({ pageNumber, pageSize, search, role, isActive }),
  });
}
