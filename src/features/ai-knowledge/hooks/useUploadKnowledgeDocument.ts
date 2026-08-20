import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";
import { uploadKnowledgeDocument } from "../services/uploadKnowledgeDocument.service";
import { KNOWLEDGE_KEYS } from "../constants/queryKeys";
import type { UploadKnowledgeDocumentRequest } from "../types/index";

export function useUploadKnowledgeDocument(onSuccess?: () => void) {
  const queryClient = useQueryClient();
  const { t } = useTranslation("aiKnowledge");

  return useMutation({
    mutationFn: (payload: UploadKnowledgeDocumentRequest) =>
      uploadKnowledgeDocument(payload),

    meta: { skipGlobalErrorToast: true },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: KNOWLEDGE_KEYS.documents() });
      toast.success(t("toasts.uploadSuccess"));
      onSuccess?.();
    },

    onError: (error) => {
      const err = error as Error & {
        status?: number;
        errors?: string[] | null;
      };

      if (err.status === 403) {
        toast.error(t("toasts.accessError"));
        return;
      }
      if (err.status === 400) {
        if (err.errors?.length) {
          toast.error(err.errors.join(" · "));
        } else if (err.message) {
          toast.error(err.message);
        } else {
          toast.error(t("toasts.uploadError"));
        }
        return;
      }
      toast.error(t("toasts.uploadError"));
    },
  });
}