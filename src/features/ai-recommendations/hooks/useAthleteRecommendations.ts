import { useQuery } from "@tanstack/react-query";
import { listAthleteRecommendations } from "../services/listAthleteRecommendations.service";
import { AI_KEYS } from "../constants/queryKeys";
import type { FetchAthleteRecommendationsParams } from "../types/index";

export function useAthleteRecommendations(
  athleteId: string,
  params: FetchAthleteRecommendationsParams = {},
  enabled = true,
) {
  return useQuery({
    queryKey: AI_KEYS.athleteRecommendations(athleteId, params),
    queryFn: () => listAthleteRecommendations(athleteId, params),
    enabled: Boolean(athleteId) && enabled,
  });
}
