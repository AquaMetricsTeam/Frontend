import { useQuery } from "@tanstack/react-query";
import { fetchAdminAthletes } from "../services/fetchAdminAthletes.service";
import { ATHLETE_QUERY_KEYS } from "../constants/queryKeys";
import type { FetchAthletesParams } from "../types/index";

export function useAdminAthletes(params: FetchAthletesParams, enabled = true) {
  return useQuery({
    queryKey: ATHLETE_QUERY_KEYS.adminList(params),
    queryFn: () => fetchAdminAthletes(params),
    enabled,
  });
}
