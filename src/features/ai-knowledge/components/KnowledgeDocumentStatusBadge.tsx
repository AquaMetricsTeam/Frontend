import { useTranslation } from "react-i18next";
import { MdSync } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import { KnowledgeIndexStatus } from "../constants/enums";

interface KnowledgeDocumentStatusBadgeProps {
  status: number;
}

const STATUS_CONFIG: Record<
  number,
  { labelKey: string; className: string }
> = {
  [KnowledgeIndexStatus.Pending]: {
    labelKey: "status.pending",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  [KnowledgeIndexStatus.Processing]: {
    labelKey: "status.processing",
    className:
      "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  },
  [KnowledgeIndexStatus.Indexed]: {
    labelKey: "status.indexed",
    className:
      "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  },
  [KnowledgeIndexStatus.Failed]: {
    labelKey: "status.failed",
    className: "border-destructive/30 bg-destructive/15 text-destructive",
  },
};

export default function KnowledgeDocumentStatusBadge({
  status,
}: KnowledgeDocumentStatusBadgeProps) {
  const { t } = useTranslation("aiKnowledge");

  const info =
    STATUS_CONFIG[status] ?? STATUS_CONFIG[KnowledgeIndexStatus.Pending];

  return (
    <Badge variant="outline" className={`gap-1 ${info.className}`}>
      {status === KnowledgeIndexStatus.Processing && (
        <MdSync className="size-3 animate-spin" />
      )}
      {t(info.labelKey)}
    </Badge>
  );
}