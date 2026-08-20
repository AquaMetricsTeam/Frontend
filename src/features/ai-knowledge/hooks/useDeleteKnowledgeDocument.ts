import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { deleteKnowledgeDocument } from "../services/deleteKnowledgeDocument.service";
import { KNOWLEDGE_KEYS } from "../constants/queryKeys";

export function useDeleteKnowledgeDocument(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("aiKnowledge");

  return useMutation({
    mutationFn: (id: number) => deleteKnowledgeDocument(id),

    meta: { skipGlobalErrorToast: true },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_KEYS.documents() });
      toast.success(t("toasts.deleteSuccess"));
      onSuccess?.();
    },

    onError: (error) => {
      const err = error as Error & { status?: number };

      if (err.status === 403) {
        toast.error(t("toasts.accessError"));
        return;
      }
      toast.error(err.message || t("toasts.deleteError"));
    },
  });
}