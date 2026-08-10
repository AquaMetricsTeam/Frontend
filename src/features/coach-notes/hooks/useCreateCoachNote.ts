import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { createCoachNote } from "../services/createCoachNote.service";
import { COACH_NOTES_KEYS } from "../constants/queryKeys";
import type { CreateCoachNotePayload } from "../types/index";

export function useCreateCoachNote(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("coachNotes");

  return useMutation({
    mutationFn: (payload: CreateCoachNotePayload) => createCoachNote(payload),

    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: COACH_NOTES_KEYS.all });
      toast.success(response.message ?? t("toasts.createSuccess"));
      onSuccess?.();
    },
  });
}
