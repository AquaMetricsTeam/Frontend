import { useState } from "react";
import { useTranslation } from "react-i18next";
import { MdSearch, MdClose, MdPersonAdd } from "react-icons/md";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

import { cn } from "@/lib/utils";
import type { AvailableAthlete } from "../types/index";

interface AthleteMultiSelectProps {
  athletes: AvailableAthlete[];
  selected: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function AthleteMultiSelect({
  athletes,
  selected,
  onSelectionChange,
}: AthleteMultiSelectProps) {
  const { t } = useTranslation("groups");
  const [search, setSearch] = useState("");

  const filtered = athletes.filter((a) =>
    a.fullName.toLowerCase().includes(search.toLowerCase()),
  );

  function toggleAthlete(id: string) {
    if (selected.includes(id)) {
      onSelectionChange(selected.filter((s) => s !== id));
    } else {
      onSelectionChange([...selected, id]);
    }
  }

  function clearAll() {
    onSelectionChange([]);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search box */}
      <div className="relative">
        <MdSearch className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={t("groups:drawer.searchAthletes")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 ps-9 text-sm"
        />
      </div>

      {/* Selected chips */}
      {selected.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selected.map((id) => {
            const athlete = athletes.find((a) => a.athleteId === id);
            if (!athlete) return null;
            return (
              <Badge
                key={id}
                variant="secondary"
                className="gap-1 rounded-full bg-primary/10 text-primary border-primary/20 pe-1 text-xs"
              >
                {athlete.fullName}
                <button
                  type="button"
                  onClick={() => toggleAthlete(id)}
                  className="ms-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
                >
                  <MdClose className="size-3" />
                </button>
              </Badge>
            );
          })}
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
          >
            {t("groups:drawer.clearAll")}
          </button>
        </div>
      )}

      {/* Athlete list */}
      <div className="max-h-52 overflow-y-auto rounded-lg border border-border divide-y divide-border">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center py-8 text-sm text-muted-foreground">
            {t("groups:drawer.noAthletes")}
          </div>
        ) : (
          filtered.map((athlete) => {
            const isSelected = selected.includes(athlete.athleteId);
            return (
              <button
                key={athlete.athleteId}
                type="button"
                onClick={() => toggleAthlete(athlete.athleteId)}
                className={cn(
                  "flex w-full items-center gap-3 px-3 py-2.5 text-start transition-colors hover:bg-muted/50",
                  isSelected && "bg-primary/5",
                )}
              >
                <div
                  className={cn(
                    "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {athlete.fullName.charAt(0).toUpperCase()}
                </div>
                <span
                  className={cn(
                    "flex-1 text-sm",
                    isSelected ? "font-semibold text-foreground" : "text-foreground/80",
                  )}
                >
                  {athlete.fullName}
                </span>
                {isSelected && (
                  <MdPersonAdd className="size-4 text-primary shrink-0" />
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}
