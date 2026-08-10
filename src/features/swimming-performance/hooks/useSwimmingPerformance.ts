import { useQuery } from "@tanstack/react-query";
import { fetchSwimmingPerformance } from "../services/fetchSwimmingPerformance.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";

export function useSwimmingPerformance(id: number, enabled: boolean = true) {
  return useQuery({
    queryKey: SWIMMING_PERFORMANCE_KEYS.detail(id),
    queryFn: () => fetchSwimmingPerformance(id),
    enabled: enabled && id > 0,
  });
}
