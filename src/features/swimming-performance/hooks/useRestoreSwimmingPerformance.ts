import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreSwimmingPerformance } from "../services/restoreSwimmingPerformance.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";
import { toast } from "sonner";

export function useRestoreSwimmingPerformance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => restoreSwimmingPerformance(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({
        queryKey: SWIMMING_PERFORMANCE_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: SWIMMING_PERFORMANCE_KEYS.detail(id),
      });
      toast.success(res?.message ?? "Performance record restored successfully");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "Failed to restore performance record");
    },
  });
}
