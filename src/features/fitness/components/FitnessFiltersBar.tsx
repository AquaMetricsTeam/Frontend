import { SearchInput } from "@/components/common/SearchInput";
import { ComboboxSelect } from "@/components/common/ComboboxSelect";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MdAdd,
  MdFilterAlt,
  MdSortByAlpha,
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
} from "react-icons/md";
import { useAthletesLookup } from "@/features/lookups/hooks/useAthletesLookup";

interface FitnessFiltersBarProps {
  localSearch: string;
  onSearchChange: (value: string) => void;
  athleteId?: string;
  onAthleteChange: (id?: string) => void;
  sessionCompleted?: boolean;
  onSessionCompletedChange: (val?: boolean) => void;
  descending: boolean;
  onSortChange: (desc: boolean) => void;
  onLogClick: () => void;
}

export function FitnessFiltersBar({
  localSearch,
  onSearchChange,
  athleteId,
  onAthleteChange,
  sessionCompleted,
  onSessionCompletedChange,
  descending,
  onSortChange,
  onLogClick,
}: FitnessFiltersBarProps) {
  const { data: athletesRes } = useAthletesLookup();
  const athletes = athletesRes?.data ?? [];

  const athleteOptions = athletes.map((ath) => ({
    value: "athleteId" in ath ? ath.athleteId : (ath as { id: string }).id,
    label: "fullName" in ath ? ath.fullName : (ath as { name: string }).name,
  }));

  const activeFilters = [athleteId, sessionCompleted !== undefined].filter(
    Boolean,
  ).length;

  return (
    <div className="space-y-3 mb-4">
      {/* Top row */}
      <div className="flex items-center gap-3 justify-between">
        <div className="flex items-center gap-2 flex-1">
          <SearchInput
            value={localSearch}
            onChange={onSearchChange}
            placeholder="Search by athlete or session…"
            className="w-full sm:w-72"
          />
          {activeFilters > 0 && (
            <Badge
              variant="secondary"
              className="gap-1 text-xs bg-primary/10 text-primary border-primary/20 shrink-0"
            >
              <MdFilterAlt className="size-3" />
              {activeFilters}
            </Badge>
          )}
        </div>

        <Button
          size="sm"
          onClick={onLogClick}
          className="h-9 rounded-lg gap-1.5 shrink-0 cursor-pointer"
        >
          <MdAdd className="size-4" />
          Log Record
        </Button>
      </div>

      {/* Filter row */}
      <div className="flex flex-wrap items-end gap-3">
        {/* Athlete Combobox */}
        <ComboboxSelect
          label="Athlete"
          placeholder="All Athletes"
          searchPlaceholder="Search athletes..."
          clearLabel="All Athletes"
          options={athleteOptions}
          value={athleteId ?? ""}
          onValueChange={(val) => onAthleteChange(val || undefined)}
          hasValue={!!athleteId}
          className="w-full sm:w-48"
        />

        {/* Session Completed */}
        <div className="flex flex-col gap-1 w-full sm:w-40">
          <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
            Completion
          </Label>
          <Select
            value={
              sessionCompleted === undefined ? "ALL" : String(sessionCompleted)
            }
            onValueChange={(val) =>
              onSessionCompletedChange(
                val === "ALL" ? undefined : val === "true",
              )
            }
          >
            <SelectTrigger
              className="h-9 text-xs rounded-lg"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL" className="text-xs text-muted-foreground">
                Any Status
              </SelectItem>
              <SelectItem value="true" className="text-xs">
                Completed
              </SelectItem>
              <SelectItem value="false" className="text-xs">
                Incomplete
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="hidden sm:block h-9 w-px bg-border self-end" />

        {/* Sort */}
        <div className="flex flex-col gap-1">
          <Label className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground/80 px-0.5">
            Sort
          </Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onSortChange(!descending)}
            className="h-9 rounded-lg gap-1.5 text-xs cursor-pointer text-muted-foreground hover:text-foreground"
          >
            <MdSortByAlpha className="size-4" />
            {descending ? (
              <>Newest <MdKeyboardArrowDown className="size-3.5" /></>
            ) : (
              <>Oldest <MdKeyboardArrowUp className="size-3.5" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
