import { useTranslation } from "react-i18next";
import { SearchInput } from "@/components/common/SearchInput";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdSortByAlpha, MdAdd, MdFilterAlt } from "react-icons/md";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { cn } from "@/lib/utils";

interface SwimmingPerformanceFiltersBarProps {
  localSearch: string;
  onSearchChange: (value: string) => void;
  athleteId?: string;
  onAthleteChange: (id?: string) => void;
  sessionCompleted?: boolean;
  onSessionCompletedChange: (val?: boolean) => void;
  injuryOccurred?: boolean;
  onInjuryChange: (val?: boolean) => void;
  descending: boolean;
  onSortChange: (desc: boolean) => void;
  onLogClick: () => void;
  canManage: boolean;
}

export function SwimmingPerformanceFiltersBar({
  localSearch,
  onSearchChange,
  athleteId,
  onAthleteChange,
  sessionCompleted,
  onSessionCompletedChange,
  injuryOccurred,
  onInjuryChange,
  descending,
  onSortChange,
  onLogClick,
  canManage,
}: SwimmingPerformanceFiltersBarProps) {
  const { t } = useTranslation("swimming");
  const { data: athletesRes } = useAthletesLookup();
  const athletes = athletesRes?.data ?? [];

  const athleteOptions = athletes.map((a) => ({
    value: "athleteId" in a ? a.athleteId : (a as { id: string }).id,
    label: "fullName" in a ? a.fullName : (a as { name: string }).name,
  }));

  const completedOptions = [
    { value: "true", label: t("filters.completed") },
    { value: "false", label: t("filters.notCompleted") },
  ];

  const injuryOptions = [
    { value: "true", label: t("filters.injuryYes") },
    { value: "false", label: t("filters.injuryNo") },
  ];

  const filterCount = [
    athleteId,
    sessionCompleted !== undefined,
    injuryOccurred !== undefined,
  ].filter(Boolean).length;

  return (
    <div className="space-y-3 mb-4">
      {/* Row 1: Search + Log button */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput
            value={localSearch}
            onChange={onSearchChange}
            placeholder={t("filters.searchPlaceholder")}
            className="w-full sm:w-72"
          />
          {filterCount > 0 && (
            <Badge className="gap-1 text-xs bg-primary/10 text-primary border-primary/20 shrink-0">
              <MdFilterAlt className="size-3" />
              {filterCount}
            </Badge>
          )}
        </div>

        {canManage && (
          <Button
            size="sm"
            onClick={onLogClick}
            className="h-9 rounded-lg gap-1.5 shrink-0 cursor-pointer"
          >
            <MdAdd className="size-4" />
            {t("page.logButton")}
          </Button>
        )}
      </div>

      {/* Row 2: Filters */}
      <div className="flex flex-wrap items-end gap-3">
        <ComboboxSelect
          label={t("filters.athleteLabel")}
          placeholder={t("filters.allAthletes")}
          searchPlaceholder="Search athletes..."
          clearLabel={t("filters.allAthletes")}
          options={athleteOptions}
          value={athleteId ?? ""}
          onValueChange={(val) => onAthleteChange(val || undefined)}
          hasValue={!!athleteId}
          className="w-full sm:w-48"
        />

        <ComboboxSelect
          label={t("filters.sessionCompletedLabel")}
          placeholder={t("filters.allSessions")}
          searchPlaceholder="Filter..."
          clearLabel={t("filters.allSessions")}
          options={completedOptions}
          value={sessionCompleted !== undefined ? String(sessionCompleted) : ""}
          onValueChange={(val) =>
            onSessionCompletedChange(val !== "" ? val === "true" : undefined)
          }
          hasValue={sessionCompleted !== undefined}
          className="w-full sm:w-44"
        />

        <ComboboxSelect
          label={t("filters.injuryLabel")}
          placeholder={t("filters.allInjury")}
          searchPlaceholder="Filter..."
          clearLabel={t("filters.allInjury")}
          options={injuryOptions}
          value={injuryOccurred !== undefined ? String(injuryOccurred) : ""}
          onValueChange={(val) =>
            onInjuryChange(val !== "" ? val === "true" : undefined)
          }
          hasValue={injuryOccurred !== undefined}
          className="w-full sm:w-40"
        />

        <div className="hidden sm:block h-9 w-px bg-border self-end" />

        {/* Sort toggle */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
            {t("filters.sortLabel")}
          </span>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSortChange(!descending)}
            className={cn(
              "h-9 rounded-lg gap-1.5 text-xs cursor-pointer text-muted-foreground hover:text-foreground",
            )}
          >
            <MdSortByAlpha className="size-4" />
            {descending ? t("filters.sortDescending") : t("filters.sortAscending")}
          </Button>
        </div>
      </div>
    </div>
  );
}
