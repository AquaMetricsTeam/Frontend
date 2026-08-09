import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveSwimmingPerformance } from "../services/archiveSwimmingPerformance.service";
import { SWIMMING_PERFORMANCE_KEYS } from "../constants/queryKeys";
import { toast } from "sonner";

export function useArchiveSwimmingPerformance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => archiveSwimmingPerformance(id),
    onSuccess: (res, id) => {
      queryClient.invalidateQueries({
        queryKey: SWIMMING_PERFORMANCE_KEYS.all,
      });
      queryClient.invalidateQueries({
        queryKey: SWIMMING_PERFORMANCE_KEYS.detail(id),
      });
      toast.success(res?.message ?? "Performance record archived successfully");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "Failed to archive performance record");
    },
  });
}
