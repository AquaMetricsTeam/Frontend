import { useQuery } from "@tanstack/react-query";
import { fetchSwimmingPerformances } from "../services/fetchSwimmingPerformances.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";
import type { SwimmingPerformanceQueryParameters } from "../types";

export function useSwimmingPerformances(
  params: SwimmingPerformanceQueryParameters = {},
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: SWIMMING_PERFORMANCE_KEYS.list(params),
    queryFn: () => fetchSwimmingPerformances(params),
    enabled,
  });
}
