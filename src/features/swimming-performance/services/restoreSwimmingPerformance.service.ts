import { customFetch } from "@/services/customFetch";

export async function restoreSwimmingPerformance(
  id: number,
): Promise<ApiResponse<string>> {
  try {
    const res = await customFetch<ApiResponse<string>>(
      `/training-record/${id}/restore`,
      { method: "PATCH" },
    );
    if (res) return res;
  } catch {}

  return customFetch<ApiResponse<string>>(
    `/swimming-performance/${id}/restore`,
    { method: "PATCH" },
  );
}
