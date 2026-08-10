import { useQuery } from "@tanstack/react-query";
import { fetchAvailableAthletesLookup } from "../services/fetchAvailableAthletesLookup.service";
import { LOOKUP_QUERY_KEYS } from "../constants/queryKeys";

export function useAvailableAthletesLookup(enabled: boolean = true) {
  return useQuery({
    queryKey: LOOKUP_QUERY_KEYS.availableAthletes(),
    queryFn: fetchAvailableAthletesLookup,
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
