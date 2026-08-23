import { useQuery } from "@tanstack/react-query";
import { fetchAvailableAthletes } from "../services/fetchAvailableAthletes.service";
import { GROUP_KEYS } from "../constants/queryKeys";

export function useAvailableAthletes(enabled = true) {
  return useQuery({
    queryKey: GROUP_KEYS.availableAthletes,
    queryFn: fetchAvailableAthletes,
    enabled,
    staleTime: 0,
    gcTime: 0,
  });
}
