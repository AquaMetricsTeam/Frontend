import { customFetch } from "@/services/customFetch";
import type { MarkAttendancePayload } from "../types/index";

export async function markAttendance(
  payload: MarkAttendancePayload,
): Promise<ApiResponse<boolean>> {
  return customFetch<ApiResponse<boolean>>("/attendance", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
