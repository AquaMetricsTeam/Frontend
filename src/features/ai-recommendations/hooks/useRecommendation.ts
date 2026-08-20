import { useQuery } from "@tanstack/react-query";
import { getRecommendation } from "../services/getRecommendation.service";
import { AI_KEYS } from "../constants/queryKeys";

export function useRecommendation(id: number, enabled = true) {
  return useQuery({
    queryKey: AI_KEYS.recommendationDetail(id),
    queryFn: () => getRecommendation(id),
    enabled: Boolean(id) && enabled,
  });
}
