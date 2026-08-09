import { customFetch } from "@/services/customFetch";

export async function archiveSwimmingPerformance(
  id: number,
): Promise<ApiResponse<string>> {
  try {
    const res = await customFetch<ApiResponse<string>>(
      `/training-record/${id}/archive`,
      { method: "PATCH" },
    );
    if (res) return res;
  } catch {}

  return customFetch<ApiResponse<string>>(
    `/swimming-performance/${id}/archive`,
    { method: "PATCH" },
  );
}
