import { useQuery } from "@tanstack/react-query";
import { listRecommendations } from "../services/listRecommendations.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { FetchRecommendationsParams } from "../types/index";

export function useRecommendations(
  params: FetchRecommendationsParams,
  enabled = true,
) {
  return useQuery({
    queryKey: AI_KEYS.recommendationList(params),
    queryFn: () => listRecommendations(params),
    enabled,
  });
}
