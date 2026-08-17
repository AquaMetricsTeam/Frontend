import { customFetch } from "@/services/customFetch";
import type { ExerciseLookupItem, FetchExercisesLookupParams } from "../types/index";

export async function fetchExercisesLookup(
  params?: FetchExercisesLookupParams
): Promise<ApiResponse<ExerciseLookupItem[]>> {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.muscleGroup !== undefined && params.muscleGroup !== null) {
    query.set("muscleGroup", String(params.muscleGroup));
  }
  if (params?.category !== undefined && params.category !== null) {
    query.set("category", String(params.category));
  }
  const queryString = query.toString();
  return customFetch<ApiResponse<ExerciseLookupItem[]>>(
    `/exercises/exercises-lookup${queryString ? `?${queryString}` : ""}`
  );
}
