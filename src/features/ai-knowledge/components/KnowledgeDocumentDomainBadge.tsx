import { useTranslation } from "react-i18next";
import { MdPool, MdFitnessCenter, MdRestaurant } from "react-icons/md";
import type { IconType } from "react-icons";
import { Badge } from "@/components/ui/badge";
import { DomainId, KNOWLEDGE_DOMAINS } from "../constants/enums";

interface KnowledgeDocumentDomainBadgeProps {
  domainId: number;
}

const DOMAIN_STYLES: Record<number, { icon: IconType; className: string }> = {
  [DomainId.Swimming]: {
    icon: MdPool,
    className:
      "bg-cyan-500/10 text-xs font-semibold text-cyan-700 border-cyan-500/20 dark:text-cyan-400",
  },
  [DomainId.Fitness]: {
    icon: MdFitnessCenter,
    className:
      "bg-blue-500/10 text-xs font-semibold text-blue-700 border-blue-500/20 dark:text-blue-400",
  },
  [DomainId.Nutrition]: {
    icon: MdRestaurant,
    className:
      "bg-emerald-500/10 text-xs font-semibold text-emerald-700 border-emerald-500/20 dark:text-emerald-400",
  },
};

export default function KnowledgeDocumentDomainBadge({
  domainId,
}: KnowledgeDocumentDomainBadgeProps) {
  const { t } = useTranslation("aiKnowledge");

  const domain = KNOWLEDGE_DOMAINS.find((d) => d.id === domainId);
  const style = DOMAIN_STYLES[domainId];

  if (!domain || !style) {
    return (
      <Badge
        variant="secondary"
        className="text-xs font-semibold text-muted-foreground"
      >
        {domainId}
      </Badge>
    );
  }

  const Icon = style.icon;

  return (
    <Badge variant="secondary" className={`gap-1 ${style.className}`}>
      <Icon className="size-3.5" />
      {t(domain.labelKey)}
    </Badge>
  );
}