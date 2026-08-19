import { useTranslation } from "react-i18next";
import { MdHealing, MdLocationOn, MdNotes } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import {
  getInjuryBodyPartLabel,
  getInjuryTypeLabel,
} from "../constants/injury";
import { cn } from "@/lib/utils";

interface InjuryDetailCardProps {
  injuryType?: number | null;
  injuryBodyPart?: number | null;
  injuryComment?: string | null;
  className?: string;
}

export function InjuryDetailCard({
  injuryType,
  injuryBodyPart,
  injuryComment,
  className,
}: InjuryDetailCardProps) {
  const { t } = useTranslation("training");

  const typeLabel = getInjuryTypeLabel(injuryType, t);
  const partLabel = getInjuryBodyPartLabel(injuryBodyPart, t);

  return (
    <div
      className={cn(
        "p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 dark:bg-rose-950/30 space-y-2.5 text-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2 border-b border-rose-500/20 pb-2">
        <span className="font-bold text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
          <MdHealing className="size-4" />
          {t("injury.title", { defaultValue: "Injury Information" })}
        </span>
        <Badge
          variant="outline"
          className="bg-rose-500/20 text-rose-600 dark:text-rose-300 border-rose-500/30 font-semibold text-[10px] px-2 py-0.5"
        >
          {t("injury.occurred", { defaultValue: "Injury Occurred" })}
        </Badge>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {partLabel && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background/80 text-foreground border border-border/60 font-medium text-xs">
            <MdLocationOn className="size-3.5 text-rose-500 shrink-0" />
            <span className="text-muted-foreground font-normal">
              {t("injury.bodyPartLabel", { defaultValue: "Body Part" })}:
            </span>{" "}
            {partLabel}
          </span>
        )}

        {typeLabel && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-background/80 text-foreground border border-border/60 font-medium text-xs">
            <MdHealing className="size-3.5 text-amber-500 shrink-0" />
            <span className="text-muted-foreground font-normal">
              {t("injury.typeLabel", { defaultValue: "Type" })}:
            </span>{" "}
            {typeLabel}
          </span>
        )}
      </div>

      {injuryComment && (
        <div className="flex items-start gap-1.5 bg-background/60 p-2 rounded-lg border border-border/40 text-foreground/90 leading-relaxed">
          <MdNotes className="size-3.5 text-muted-foreground mt-0.5 shrink-0" />
          <span>{injuryComment}</span>
        </div>
      )}
    </div>
  );
}
