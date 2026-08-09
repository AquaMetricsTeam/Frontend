import { useTranslation } from "react-i18next";
import { SearchInput } from "@/components/common/SearchInput";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MdSortByAlpha, MdArchive, MdAdd, MdFilterAlt } from "react-icons/md";
import { StrokeType, PerformanceStatus } from "../types";
import { STROKE_METADATA, STATUS_METADATA } from "../constants/enums";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";
import { cn } from "@/lib/utils";

interface SwimmingPerformanceFiltersBarProps {
  localSearch: string;
  onSearchChange: (value: string) => void;
  athleteId?: string;
  onAthleteChange: (id?: string) => void;
  stroke?: StrokeType;
  onStrokeChange: (stroke?: StrokeType) => void;
  status?: PerformanceStatus;
  onStatusChange: (status?: PerformanceStatus) => void;
  showArchived: boolean;
  onShowArchivedChange: (show: boolean) => void;
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
  stroke,
  onStrokeChange,
  status,
  onStatusChange,
  showArchived,
  onShowArchivedChange,
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

  const strokeOptions = Object.values(STROKE_METADATA).map((s) => ({
    value: String(s.value),
    label: t(s.labelKey),
  }));

  const statusOptions = Object.values(STATUS_METADATA).map((st) => ({
    value: String(st.value),
    label: t(st.labelKey),
  }));

  const filterCount = [athleteId, stroke !== undefined, status !== undefined, showArchived].filter(Boolean).length;

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
          label={t("filters.strokeLabel")}
          placeholder={t("filters.allStrokes")}
          searchPlaceholder="Search strokes..."
          clearLabel={t("filters.allStrokes")}
          options={strokeOptions}
          value={stroke !== undefined ? String(stroke) : ""}
          onValueChange={(val) =>
            onStrokeChange(val ? (Number(val) as StrokeType) : undefined)
          }
          hasValue={stroke !== undefined}
          className="w-full sm:w-40"
        />

        <ComboboxSelect
          label={t("filters.statusLabel")}
          placeholder={t("filters.allStatuses")}
          searchPlaceholder="Search status..."
          clearLabel={t("filters.allStatuses")}
          options={statusOptions}
          value={status !== undefined ? String(status) : ""}
          onValueChange={(val) =>
            onStatusChange(val ? (Number(val) as PerformanceStatus) : undefined)
          }
          hasValue={status !== undefined}
          className="w-full sm:w-40"
        />

        <div className="hidden sm:block h-9 w-px bg-border self-end" />

        {/* Archive toggle */}
        <div className="flex flex-col gap-1">
          <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
            {t("filters.archivedLabel")}
          </span>
          <Button
            type="button"
            variant={showArchived ? "secondary" : "outline"}
            size="sm"
            onClick={() => onShowArchivedChange(!showArchived)}
            className={cn(
              "h-9 rounded-lg gap-1.5 text-xs cursor-pointer",
              showArchived &&
                "border-amber-500/40 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20",
            )}
          >
            <MdArchive className="size-4" />
            {showArchived ? t("filters.showingArchived") : t("filters.showArchived")}
          </Button>
        </div>

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
            className="h-9 rounded-lg gap-1.5 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <MdSortByAlpha className="size-4" />
            {descending ? t("filters.sortDescending") : t("filters.sortAscending")}
          </Button>
        </div>
      </div>
    </div>
  );
}
