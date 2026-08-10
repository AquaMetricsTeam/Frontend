import { customFetch } from "@/services/customFetch";
import type { TrainingRecordPaginatedResponse } from "@/features/training-record/types";

export interface SwimmingTrainingRecordQueryParams {
  pageIndex?: number;
  pageSize?: number;
  athleteId?: string;
  trainingSessionId?: number;
  injuryOccurred?: boolean;
  sessionCompleted?: boolean;
  minPerformanceRating?: number;
  maxPerformanceRating?: number;
  fromDate?: string;
  toDate?: string;
  search?: string;
  descending?: boolean;
}

export async function fetchSwimmingPerformances(
  params: SwimmingTrainingRecordQueryParams = {},
): Promise<ApiResponse<TrainingRecordPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.pageIndex !== undefined)
    query.set("PageIndex", String(params.pageIndex));
  if (params.pageSize !== undefined)
    query.set("PageSize", String(params.pageSize));
  if (params.athleteId) query.set("AthleteId", params.athleteId);
  if (params.trainingSessionId)
    query.set("TrainingSessionId", String(params.trainingSessionId));
  if (params.injuryOccurred !== undefined)
    query.set("InjuryOccurred", String(params.injuryOccurred));
  if (params.sessionCompleted !== undefined)
    query.set("SessionCompleted", String(params.sessionCompleted));
  if (params.minPerformanceRating !== undefined)
    query.set("MinPerformanceRating", String(params.minPerformanceRating));
  if (params.maxPerformanceRating !== undefined)
    query.set("MaxPerformanceRating", String(params.maxPerformanceRating));
  if (params.fromDate) query.set("FromDate", params.fromDate);
  if (params.toDate) query.set("ToDate", params.toDate);
  if (params.search) query.set("Search", params.search);
  if (params.descending !== undefined)
    query.set("Descending", String(params.descending));

  const queryString = query.toString();
  const endpoint = `/swimming-performance/trainingRecord${queryString ? `?${queryString}` : ""}`;

  return customFetch<ApiResponse<TrainingRecordPaginatedResponse>>(endpoint);
}
