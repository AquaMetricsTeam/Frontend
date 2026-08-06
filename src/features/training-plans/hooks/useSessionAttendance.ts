import { useQuery } from "@tanstack/react-query";
import { fetchSessionAttendance } from "../services/fetchSessionAttendance.service";
import { ATTENDANCE_KEYS } from "../constants/queryKeys";

export function useSessionAttendance(
  sessionId: number,
  enabled: boolean = true,
) {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.bySession(sessionId),
    queryFn: () => fetchSessionAttendance(sessionId),
    enabled: enabled && sessionId > 0,
  });
}
