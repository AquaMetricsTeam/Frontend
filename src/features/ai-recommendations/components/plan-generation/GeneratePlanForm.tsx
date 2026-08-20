import { useTranslation } from "react-i18next";
import { MdAutoAwesome } from "react-icons/md";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";

interface GeneratePlanFormProps {
  athleteId: string;
  onAthleteChange: (id: string) => void;
  query: string;
  onQueryChange: (q: string) => void;
  domainId: number | undefined;
  errors: { athleteId?: string; query?: string };
  onSubmit: () => void;
  isGenerating: boolean;
}

export default function GeneratePlanForm({
  athleteId,
  onAthleteChange,
  query,
  onQueryChange,
  domainId,
  errors,
  onSubmit,
  isGenerating,
}: GeneratePlanFormProps) {
  const { t } = useTranslation("aiPlan");

  const athletesQuery = useAthletesLookup(!isGenerating);
  const athleteOptions = (athletesQuery.data?.data ?? []).map((a) => ({
    value: a.athleteId,
    label: a.fullName,
  }));

  const domainLabels: Record<number, string> = {
    1: "Swimming",
    2: "Fitness",
    3: "Nutrition",
  };

  return (
    <div className="space-y-5">
      {domainId && (
        <div className="flex flex-col gap-1.5">
          <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
            {t("generate.domainLabel")}
          </Label>
          <p className="text-sm font-medium text-foreground">
            {domainLabels[domainId] ?? `Domain ${domainId}`}
          </p>
        </div>
      )}

      <ComboboxSelect
        label={t("generate.athleteLabel")}
        placeholder={t("generate.athletePlaceholder")}
        options={athleteOptions}
        value={athleteId}
        onValueChange={onAthleteChange}
        disabled={isGenerating || athletesQuery.isLoading}
        error={errors.athleteId}
      />

      <div className="flex flex-col gap-1.5">
        <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
          {t("generate.queryLabel")}
        </Label>
        <Textarea
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={t("generate.queryPlaceholder")}
          disabled={isGenerating}
          rows={4}
          className={`text-sm ${errors.query ? "border-destructive focus-visible:ring-destructive/50" : ""}`}
        />
        {errors.query && (
          <p className="text-xs text-destructive">{errors.query}</p>
        )}
      </div>

      <Button
        onClick={onSubmit}
        disabled={isGenerating || !athleteId || !query.trim()}
        className="w-full cursor-pointer gap-2"
      >
        <MdAutoAwesome className="size-4" />
        {isGenerating ? t("generate.generating") : t("generate.generateButton")}
      </Button>
    </div>
  );
}
