import { customFetch } from "@/services/customFetch";
import type {
  SwimmingPerformanceQueryParameters,
  SwimmingPerformancesPaginatedResponse,
} from "../types";

export async function fetchSwimmingPerformances(
  params: SwimmingPerformanceQueryParameters = {},
): Promise<ApiResponse<SwimmingPerformancesPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageIndex !== undefined)
    query.set("PageIndex", String(params.pageIndex));
  if (params.pageSize !== undefined)
    query.set("PageSize", String(params.pageSize));
  if (params.athleteId) query.set("AthleteId", params.athleteId);
  if (params.trainingSessionId)
    query.set("TrainingSessionId", String(params.trainingSessionId));
  if (params.stroke !== undefined) query.set("Stroke", String(params.stroke));
  if (params.status !== undefined) query.set("Status", String(params.status));
  if (params.descending !== undefined)
    query.set("Descending", String(params.descending));
  if (params.isArchived !== undefined)
    query.set("onlyArchived", String(params.isArchived));
  if (params.search) query.set("Search", params.search);

  const queryString = query.toString();
  const endpoint = `/swimming-performance${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<SwimmingPerformancesPaginatedResponse>>(
    endpoint,
  );
}
