import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createExercise } from "../services/createExercise.service";
import { EXERCISE_KEYS } from "../constants/queryKeys";
import type { CreateExercisePayload } from "../types/index";

export function useCreateExercise(onSuccess: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateExercisePayload) => createExercise(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all });
      toast.success(response.message ?? "Exercise created successfully.");
      onSuccess();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to create exercise.");
    },
  });
}
