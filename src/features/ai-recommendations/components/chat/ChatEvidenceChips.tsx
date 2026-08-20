import { useTranslation } from "react-i18next";
import { MdDescription } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import type { RetrievedDocument } from "../../types/index";

interface ChatEvidenceChipsProps {
  evidence: RetrievedDocument[];
}

export default function ChatEvidenceChips({ evidence }: ChatEvidenceChipsProps) {
  const { t } = useTranslation("aiChat");

  if (!evidence.length) return null;

  return (
    <div className="mt-2 flex flex-wrap gap-1.5">
      <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground/70 me-1 self-center">
        {t("message.evidenceSources")}:
      </span>
      {evidence.map((doc, i) => {
        const label =
          doc.metadata?.title ?? doc.content.slice(0, 60) + (doc.content.length > 60 ? "..." : "");
        return (
          <Badge
            key={`${doc.documentId}-${i}`}
            variant="outline"
            className="gap-1 text-[10px] font-normal text-muted-foreground max-w-[220px]"
          >
            <MdDescription className="size-3 shrink-0" />
            <span className="truncate">{label}</span>
          </Badge>
        );
      })}
    </div>
  );
}
