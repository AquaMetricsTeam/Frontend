import { useQuery } from "@tanstack/react-query";
import { fetchGroup } from "../services/fetchGroup.service";
import { GROUP_KEYS } from "../constants/queryKeys";

export function useGroup(id: number) {
  return useQuery({
    queryKey: GROUP_KEYS.detail(id),
    queryFn: () => fetchGroup(id),
    enabled: id > 0,
    staleTime: 0,
    gcTime: 0,
  });
}
