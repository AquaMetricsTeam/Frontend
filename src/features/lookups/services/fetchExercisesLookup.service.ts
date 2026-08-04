import { customFetch } from "@/services/customFetch";
import type { ExerciseLookupItem } from "../types/index";

export async function fetchExercisesLookup(): Promise<
  ApiResponse<ExerciseLookupItem[]>
> {
  return customFetch<ApiResponse<ExerciseLookupItem[]>>(
    "/exercises/exercises-lookup",
  );
}
