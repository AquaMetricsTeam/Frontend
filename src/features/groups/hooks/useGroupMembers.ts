import { useQuery } from "@tanstack/react-query";
import { fetchGroupMembers } from "../services/fetchGroupMembers.service";
import { GROUP_KEYS } from "../constants/queryKeys";

export function useGroupMembers(groupId: number, enabled = true) {
  return useQuery({
    queryKey: GROUP_KEYS.members(groupId),
    queryFn: () => fetchGroupMembers(groupId),
    enabled: enabled && groupId > 0,
  });
}
