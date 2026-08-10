import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteCoachNote } from "../services/deleteCoachNote.service";
import { COACH_NOTES_KEYS } from "../constants/queryKeys";

export function useDeleteCoachNote(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("coachNotes");

  return useMutation({
    mutationFn: (noteId: number | string) => deleteCoachNote(noteId),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: COACH_NOTES_KEYS.all });
      toast.success(response.message ?? t("toasts.deleteSuccess"));
      onSuccess?.();
    },
  });
}
