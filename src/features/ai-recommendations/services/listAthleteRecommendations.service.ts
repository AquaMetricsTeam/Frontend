import { customFetch } from "@/services/customFetch";
import type {
  FetchAthleteRecommendationsParams,
  RecommendationListItem,
  PagedResponse,
} from "../types/index";

export async function listAthleteRecommendations(
  athleteId: string,
  params: FetchAthleteRecommendationsParams,
): Promise<ApiResponse<PagedResponse<RecommendationListItem>>> {
  const query = new URLSearchParams();

  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));

  const queryString = query.toString();
  const endpoint = `/ai-recommendations/athlete/${athleteId}${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<PagedResponse<RecommendationListItem>>>(
    endpoint,
  );
}
