import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { MdAutoAwesome, MdEditCalendar } from "react-icons/md";

interface PlanSourceBadgeProps {
  isAiGenerated: boolean;
}

export default function PlanSourceBadge({ isAiGenerated }: PlanSourceBadgeProps) {
  const { t } = useTranslation("aiPlanView");

  if (isAiGenerated) {
    return (
      <Badge
        variant="outline"
        className="gap-1 text-xs font-semibold border-primary/30 bg-primary/10 text-primary"
      >
        <MdAutoAwesome className="size-3.5" />
        {t("source.aiPersonalized")}
      </Badge>
    );
  }

  return (
    <Badge
      variant="outline"
      className="gap-1 text-xs font-semibold border-border/60 bg-muted/40 text-muted-foreground"
    >
      <MdEditCalendar className="size-3.5" />
      {t("source.manual")}
    </Badge>
  );
}