import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { updateCoachNote } from "../services/updateCoachNote.service";
import { COACH_NOTES_KEYS } from "../constants/queryKeys";
import type { UpdateCoachNotePayload } from "../types/index";

export function useUpdateCoachNote(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("coachNotes");

  return useMutation({
    mutationFn: (payload: UpdateCoachNotePayload) => updateCoachNote(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: COACH_NOTES_KEYS.all });
      toast.success(response.message ?? t("toasts.updateSuccess"));
      onSuccess?.();
    },
  });
}
