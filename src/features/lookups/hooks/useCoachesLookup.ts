import { useQuery } from "@tanstack/react-query";
import { fetchCoachesLookup } from "../services/fetchCoachesLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";

export function useCoachesLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.coaches(),
    queryFn: fetchCoachesLookup,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
