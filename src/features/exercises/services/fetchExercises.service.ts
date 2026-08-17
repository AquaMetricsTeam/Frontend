import { customFetch } from "@/services/customFetch";
import type {
  FetchExercisesParams,
  ExercisesPaginatedResponse,
} from "../types/index";

export async function fetchExercises(
  params: FetchExercisesParams,
): Promise<ApiResponse<ExercisesPaginatedResponse>> {
  const query = new URLSearchParams();

  if (params.page !== undefined) query.set("page", String(params.page));
  if (params.pageSize !== undefined) query.set("pageSize", String(params.pageSize));
  if (params.search) query.set("search", params.search);
  if (params.muscleGroup !== undefined) query.set("muscleGroup", String(params.muscleGroup));
  if (params.category !== undefined) query.set("category", String(params.category));
  if (params.includeArchived) query.set("includeArchived", "true");
  if (params.onlyArchived) query.set("onlyArchived", "true");

  return customFetch<ApiResponse<ExercisesPaginatedResponse>>(
    `/exercises?${query.toString()}`,
  );
}
