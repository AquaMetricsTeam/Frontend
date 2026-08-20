import { useTranslation } from "react-i18next";
import { MdDescription } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import type { RecommendationEvidenceResponse } from "../../types/index";

interface EvidenceSourcesProps {
  evidence: RecommendationEvidenceResponse[];
}

export default function EvidenceSources({ evidence }: EvidenceSourcesProps) {
  const { t } = useTranslation("aiPlan");

  if (!evidence.length) return null;

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {t("review.evidenceSources")}
      </h4>
      <div className="flex flex-wrap gap-1.5">
        {evidence.map((doc) => (
          <Badge
            key={`${doc.documentId}-${doc.chunkId}`}
            variant="outline"
            className="gap-1 text-[10px] font-normal text-muted-foreground max-w-[260px]"
          >
            <MdDescription className="size-3 shrink-0" />
            <span className="truncate">{doc.documentTitle}</span>
            <span className="text-muted-foreground/60">
              ({Math.round(doc.score * 100)}%)
            </span>
          </Badge>
        ))}
      </div>
    </div>
  );
}
