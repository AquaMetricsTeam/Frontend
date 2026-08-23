import { useQuery } from "@tanstack/react-query";
import { fetchGroupsLookup } from "../services/fetchGroupsLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";

export function useGroupsLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.groups(),
    queryFn: fetchGroupsLookup,
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
}
