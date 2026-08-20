import { customFetch } from "@/services/customFetch";
import type {
  FetchRecommendationsParams,
  RecommendationListItem,
  PagedResponse,
} from "../types/index";

export async function listRecommendations(
  params: FetchRecommendationsParams,
): Promise<ApiResponse<PagedResponse<RecommendationListItem>>> {
  const query = new URLSearchParams();

  if (params.domainId !== undefined)
    query.set("domainId", String(params.domainId));
  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));

  const queryString = query.toString();
  const endpoint = `/ai-recommendations${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<PagedResponse<RecommendationListItem>>>(
    endpoint,
  );
}
