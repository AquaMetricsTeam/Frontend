import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MdDeleteOutline } from "react-icons/md";
import { SwimmingDrillForm } from "./SwimmingDrillForm";

interface DrillCardProps {
  index: number;
  totalDrills: number;
  prefix?: string;
  onRemove: () => void;
}

export function DrillCard({
  index,
  totalDrills,
  prefix = `swimmingPerformances.${index}`,
  onRemove,
}: DrillCardProps) {
  const { t } = useTranslation("swimming");

  return (
    <div className="rounded-2xl border border-border bg-card p-5 space-y-5 shadow-xs">
      {/* Card Header */}
      <div className="flex items-center justify-between border-b border-border pb-3">
        <Badge
          variant="secondary"
          className="text-xs font-bold bg-primary/10 text-primary border-primary/20"
        >
          {t("builder.drillCardTitle", { index: index + 1 })}
        </Badge>

        {totalDrills > 1 && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onRemove}
            className="h-7 text-xs text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 gap-1 cursor-pointer"
          >
            <MdDeleteOutline className="size-4" />
            {t("builder.removeDrill")}
          </Button>
        )}
      </div>

      <SwimmingDrillForm prefix={prefix} />
    </div>
  );
}
