import { customFetch } from "@/services/customFetch";
import type { AttendanceRecord } from "../types/index";

export async function fetchSessionAttendance(
  sessionId: number,
): Promise<ApiResponse<AttendanceRecord[]>> {
  return customFetch<ApiResponse<AttendanceRecord[]>>(
    `/attendance/session/${sessionId}`,
  );
}
