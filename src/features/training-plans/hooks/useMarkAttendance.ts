import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { markAttendance } from "../services/markAttendance.service";
import { ATTENDANCE_KEYS } from "../constants/queryKeys";

export function useMarkAttendance(
  sessionId: number,
  onSuccess?: () => void,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markAttendance,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ATTENDANCE_KEYS.bySession(sessionId),
      });
      toast.success("Attendance saved successfully");
      onSuccess?.();
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message || "Failed to save attendance");
    },
  });
}
