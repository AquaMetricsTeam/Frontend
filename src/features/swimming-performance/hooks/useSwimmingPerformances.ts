import { useQuery } from "@tanstack/react-query";
import {
  fetchSwimmingPerformances,
  type SwimmingTrainingRecordQueryParams,
} from "../services/fetchSwimmingPerformances.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";

export function useSwimmingPerformances(
  params: SwimmingTrainingRecordQueryParams = {},
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: SWIMMING_PERFORMANCE_KEYS.list(params),
    queryFn: () => fetchSwimmingPerformances(params),
    enabled,
  });
}
