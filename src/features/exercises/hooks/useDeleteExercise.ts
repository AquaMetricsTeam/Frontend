import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { deleteExercise } from "../services/deleteExercise.service";
import { EXERCISE_KEYS } from "../constants/queryKeys";
import { LOOKUP_QUERY_KEYS } from "@/features/lookups/constants/queryKeys";

export function useDeleteExercise(onSuccess?: () => void) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteExercise(id),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: EXERCISE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: LOOKUP_QUERY_KEYS.all });
      toast.success(response.message ?? "Exercise deleted successfully.");
      onSuccess?.();
    },

    onError: (error: { message?: string }) => {
      toast.error(error?.message ?? "Failed to delete exercise.");
    },
  });
}
