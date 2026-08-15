import { customFetch } from "@/services/customFetch";
import type {
  FetchTrainingPlansParams,
  TrainingPlansPaginatedResponse,
} from "../types/index";

export async function fetchTrainingPlans(
  params: FetchTrainingPlansParams,
): Promise<ApiResponse<TrainingPlansPaginatedResponse>> {
  const query = new URLSearchParams();
  if (params.pageNumber !== undefined)
    query.set("pageNumber", String(params.pageNumber));
  if (params.pageSize !== undefined)
    query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.isArchived !== undefined)
    query.set("isArchived", String(params.isArchived));
  return customFetch<ApiResponse<TrainingPlansPaginatedResponse>>(
    `/training-plans?${query.toString()}`,
  );
}
