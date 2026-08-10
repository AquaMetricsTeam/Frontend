import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateTrainingRecord } from "../services/updateTrainingRecord.service";
import { TRAINING_RECORD_KEYS } from "../constants/queryKeys";
import type { UpdateTrainingRecordPayload } from "../types";

export function useUpdateTrainingRecord(id: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateTrainingRecordPayload) =>
      updateTrainingRecord(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_RECORD_KEYS.all });
    },
  });
}
