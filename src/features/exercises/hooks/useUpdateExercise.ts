import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { updateExercise } from "../services/updateExercise.service";
import { EXERCISE_KEYS } from "../constants/queryKeys";
import type { UpdateExercisePayload } from "../types/index";

export function useUpdateExercise(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateExercisePayload;
    }) => updateExercise(id, payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all });
      toast.success(response.message ?? "Exercise updated successfully.");
      onSuccess();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to update exercise.");
    },
  });
}
