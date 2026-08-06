import { useQuery } from "@tanstack/react-query";
import { fetchAthletesLookup } from "../services/fetchAthletesLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";

export function useAthletesLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.athletes(),
    queryFn: fetchAthletesLookup,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
