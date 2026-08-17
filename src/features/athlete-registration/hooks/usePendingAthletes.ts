import { useQuery } from "@tanstack/react-query";
import { fetchPendingAthletes } from "../services/fetchPendingAthletes.service";
import { ATHLETE_REGISTRATION_QUERY_KEYS } from "../constants/queryKeys";

export function usePendingAthletes(enabled = true) {
  return useQuery({
    queryKey: ATHLETE_REGISTRATION_QUERY_KEYS.pending(),
    queryFn: fetchPendingAthletes,
    enabled,
  });
}
