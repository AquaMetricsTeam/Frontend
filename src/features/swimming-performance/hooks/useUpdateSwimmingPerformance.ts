import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSwimmingPerformance } from "../services/updateSwimmingPerformance.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";
import type { UpdateSwimmingPerformancePayload } from "../types";
import { toast } from "sonner";

export function useUpdateSwimmingPerformance(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateSwimmingPerformancePayload) =>
      updateSwimmingPerformance(id, payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({
        queryKey: SWIMMING_PERFORMANCE_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: SWIMMING_PERFORMANCE_KEYS.detail(id),
      });
      toast.success(res?.message ?? "Swimming performance updated successfully");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "Failed to update swimming performance");
    },
  });
}
