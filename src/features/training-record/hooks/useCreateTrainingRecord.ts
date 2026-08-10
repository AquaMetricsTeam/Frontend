import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTrainingRecord } from "../services/createTrainingRecord.service";
import { TRAINING_RECORD_KEYS } from "../constants/queryKeys";
import { SWIMMING_PERFORMANCE_KEYS } from "@/features/swimming-performance/constants/queryKeys";
import type { CreateTrainingRecordPayload } from "../types";
import { toast } from "sonner";

export function useCreateTrainingRecord() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTrainingRecordPayload) =>
      createTrainingRecord(payload),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: TRAINING_RECORD_KEYS.all });
      queryClient.invalidateQueries({ queryKey: SWIMMING_PERFORMANCE_KEYS.all });
      toast.success(res?.message ?? "Performance record logged successfully");
    },
    onError: (err: { message?: string }) => {
      toast.error(err?.message ?? "Failed to log performance record");
    },
  });
}
